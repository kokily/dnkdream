import { ApiPropertyOptional } from "@nestjs/swagger";

export class SaveDraftDto {
  @ApiPropertyOptional({
    example: 1,
    description: '수정할 글 ID',
  })
  postId?: number;

  @ApiPropertyOptional({ example: '제목' })
  title?: string;

  @ApiPropertyOptional({ example: '# 마크다운 본문' })
  content?: string;

  @ApiPropertyOptional({ example: ['nestjs', 'blog'] })
  tags?: string[];

  @ApiPropertyOptional({ example: '개발' })
  categoryName?: string;
}