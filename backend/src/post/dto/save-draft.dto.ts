import { ApiPropertyOptional } from "@nestjs/swagger";

export class SaveDraftDto {
  @ApiPropertyOptional({ description: '기존 임시저장 글 번호 (덮어쓰기용)'})
  postId?: number;

  @ApiPropertyOptional({ description: '게시글 제목' })
  title?: string;

  @ApiPropertyOptional({ description: '게시글 본문' })
  content?: string;

  @ApiPropertyOptional({ description: '태그 목록', type: [String] })
  tags?: string[];

  @ApiPropertyOptional({ description: '카테고리' })
  categoryName!: string;
}