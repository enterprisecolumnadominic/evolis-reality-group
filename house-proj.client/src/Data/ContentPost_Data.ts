/* src/Data/ContentPost_Data.ts */

export interface ContentPost_Data {
  id: string;
  guid: string;
  type: "Blog" | "Event";
  title: string;
  slug: string;
  author: string;
  content: string; // HTML or Markdown string
  imageUrl: string;
  publishedDate: string; // ISO Date string
  eventDate?: string | null;
  isFeatured: boolean;
  tagLine: string;
  tags: string[];
  isActive: boolean;
}

export const EmptyContentState: ContentPost_Data = {
  id: "00000000-0000-0000-0000-000000000000",
  guid: "00000000-0000-0000-0000-000000000000",
  type: "Blog",
  title: "",
  slug: "",
  author: "Admin",
  content: "",
  imageUrl: "",
  publishedDate: new Date().toISOString(),
  eventDate: null,
  isFeatured: false,
  tagLine: "",
  tags: [],
  isActive: true,
};
