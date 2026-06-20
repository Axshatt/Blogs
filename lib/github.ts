import { Octokit } from 'octokit';
import matter from 'gray-matter';
import type { Post, PostFrontmatter } from '@/types/post';

function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not defined');
  }
  return new Octokit({ auth: token });
}

const OWNER = process.env.GITHUB_OWNER || '';
const REPO = process.env.GITHUB_REPO || '';
const BRANCH = process.env.GITHUB_BRANCH || 'main';

export async function getLatestPostsFromGitHub(): Promise<Post[]> {
  const octokit = getOctokit();
  try {
    const { data: contents } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: 'content/posts',
      ref: BRANCH,
    });

    if (!Array.isArray(contents)) return [];

    const posts = await Promise.all(
      contents
        .filter((file) => file.name.endsWith('.mdx'))
        .map(async (file) => {
          const res = await fetch(file.download_url!, {
            headers: {
              Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
            cache: 'no-store',
          });
          const raw = await res.text();
          const { data, content } = matter(raw);
          const frontmatter = data as PostFrontmatter;
          const slug = file.name.replace(/\.mdx$/, '');

          return {
            slug,
            frontmatter: {
              ...frontmatter,
              draft: frontmatter.draft ?? false,
            },
            content,
            readingTime: `${Math.ceil(content.split(/\s+/).length / 200)} min read`,
          } as Post;
        })
    );

    return posts.sort(
      (a, b) =>
        new Date(b.frontmatter.published).getTime() -
        new Date(a.frontmatter.published).getTime()
    );
  } catch (error) {
    console.error('Error fetching posts from GitHub:', error);
    return [];
  }
}

export async function getPostFromGitHub(slug: string): Promise<Post | null> {
  const octokit = getOctokit();
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: `content/posts/${slug}.mdx`,
      ref: BRANCH,
    });

    if (Array.isArray(data) || !('content' in data)) return null;

    const raw = Buffer.from(data.content, 'base64').toString('utf-8');
    const { data: frontData, content } = matter(raw);
    const frontmatter = frontData as PostFrontmatter;

    return {
      slug,
      frontmatter: {
        ...frontmatter,
        draft: frontmatter.draft ?? false,
      },
      content,
      readingTime: `${Math.ceil(content.split(/\s+/).length / 200)} min read`,
    };
  } catch (error) {
    console.error(`Error fetching post ${slug} from GitHub:`, error);
    return null;
  }
}

export async function writePostToGitHub(
  slug: string,
  frontmatter: Partial<PostFrontmatter>,
  content: string,
  commitMessage: string
): Promise<boolean> {
  const octokit = getOctokit();
  const filePath = `content/posts/${slug}.mdx`;
  // Clean up undefined properties to avoid js-yaml dumping errors
  const cleanFrontmatter = Object.fromEntries(
    Object.entries(frontmatter).filter(([_, v]) => v !== undefined)
  );
  const mdxFileContent = matter.stringify(content, cleanFrontmatter);

  let sha: string | undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      ref: BRANCH,
    });

    if (!Array.isArray(data) && 'sha' in data) {
      sha = data.sha;
    }
  } catch (e) {}

  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      message: commitMessage,
      content: Buffer.from(mdxFileContent).toString('base64'),
      sha,
      branch: BRANCH,
    });

    await triggerVercelDeploy();
    return true;
  } catch (error) {
    console.error('Error committing file to GitHub:', error);
    return false;
  }
}

export async function deletePostFromGitHub(slug: string): Promise<boolean> {
  const octokit = getOctokit();
  const filePath = `content/posts/${slug}.mdx`;

  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      ref: BRANCH,
    });

    if (Array.isArray(data) || !('sha' in data)) {
      return false;
    }

    await octokit.rest.repos.deleteFile({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      message: `Delete blog post: ${slug}`,
      sha: data.sha,
      branch: BRANCH,
    });

    await triggerVercelDeploy();
    return true;
  } catch (error) {
    console.error(`Error deleting post ${slug} from GitHub:`, error);
    return false;
  }
}

export async function uploadImageToGitHub(
  filename: string,
  base64Data: string
): Promise<string | null> {
  const octokit = getOctokit();
  const filePath = `public/blog-images/${filename}`;

  let sha: string | undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      ref: BRANCH,
    });

    if (!Array.isArray(data) && 'sha' in data) {
      sha = data.sha;
    }
  } catch (e) {}

  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      message: `Upload image: ${filename}`,
      content: base64Data,
      sha,
      branch: BRANCH,
    });

    return `/blog-images/${filename}`;
  } catch (error) {
    console.error(`Error uploading image ${filename} to GitHub:`, error);
    return null;
  }
}

async function triggerVercelDeploy() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK;
  if (!hookUrl) {
    console.warn('VERCEL_DEPLOY_HOOK not configured. Redeployment skipped.');
    return;
  }

  try {
    const res = await fetch(hookUrl, { method: 'POST' });
    if (res.ok) {
      console.log('Successfully triggered Vercel redeployment webhook');
    } else {
      console.error('Failed to trigger Vercel deployment:', await res.text());
    }
  } catch (error) {
    console.error('Error triggering Vercel deployment:', error);
  }
}
