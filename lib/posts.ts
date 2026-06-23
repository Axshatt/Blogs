import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post, PostFrontmatter, Category } from '@/types/post';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.mdx'));
}

function extractFirstImageUrl(content: string): string | null {
  const mdMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (mdMatch && mdMatch[1]) {
    return mdMatch[1];
  }
  const htmlMatch = content.match(/<img\s+[^>]*src=["']([^"']+)["']/i);
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }
  return null;
}

function parsePost(filename: string): Post {
  const slug = filename.replace(/\.mdx$/, '');
  const filepath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  if (!frontmatter.coverImage) {
    const fallbackImage = extractFirstImageUrl(content);
    if (fallbackImage) {
      frontmatter.coverImage = fallbackImage;
    }
  }

  const { text } = readingTime(content);

  return { slug, frontmatter, content, readingTime: text };
}

export function getAllPosts(): Post[] {
  return getPostFiles()
    .map(parsePost)
    .filter((p) => !p.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.published).getTime() -
        new Date(a.frontmatter.published).getTime()
    );
}

export function getPostBySlug(slug: string): Post | undefined {
  const filename = `${slug}.mdx`;
  const filepath = path.join(POSTS_DIR, filename);
  if (!fs.existsSync(filepath)) return undefined;
  return parsePost(filename);
}

export function getPostsByCategory(category: Category): Post[] {
  return getAllPosts().filter((p) => p.frontmatter.category === category);
}

export function getAllSlugs(): string[] {
  return getPostFiles().map((f) => f.replace(/\.mdx$/, ''));
}
