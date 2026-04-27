export type ContentType = "note" | "writing" | "image" | "video" | "audio";
export type Domain = "tech" | "art" | "music" | "personal";
export type Status = "public" | "draft";

export interface Frontmatter {
  title?: string;
  date: string;
  type: ContentType;
  domain: Domain;
  status: Status;
  tags?: string[];
  url?: string;
  cover?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  excerpt: string;
}
