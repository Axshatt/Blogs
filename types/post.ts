export type Category = 'build-log' | 'tutorial' | 'experiment';

export interface PostFrontmatter {
  title: string;
  excerpt: string;
  category: Category;
  tags: string[];
  published: string;
  canonical_url?: string;
  coverImage?: string;
  draft: boolean;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
}

export interface PostWithContent extends Post {
  compiledSource: string;
}
