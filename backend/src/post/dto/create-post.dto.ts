export class CreatePostDto {
  title!: string;
  content!: string;
  thumbnail?: string;
  tags!: string[];
  isPublished?: boolean;
}
