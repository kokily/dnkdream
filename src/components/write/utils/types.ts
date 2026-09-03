export type WriteDraft = {
  id: string;
  category: string;
  title: string;
  body: string;
  thumbnail: string | null;
  publishedAt: Date | null;
  tags: { name: string }[];
};
