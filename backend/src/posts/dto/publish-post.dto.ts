import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class PublishPostDto {
  @ApiPropertyOptional({ example: 1 })
  postId?: number;

  @ApiProperty({ example: '게시글 제목' })
  title!: string;

  @ApiProperty({ example: '# 본문' })
  content!: string;

  @ApiPropertyOptional({ example: ['nestjs'] })
  tags?: string[];

  @ApiPropertyOptional({ example: '개발' })
  categoryName?: string;
}