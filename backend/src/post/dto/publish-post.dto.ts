import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PublishPostDto {
  @ApiPropertyOptional({
    description: '기존 임시저장(또는 수정) 중이던 글 번호',
  })
  postId?: number;

  @ApiProperty({ description: '게시글 제목 (필수)' })
  title!: string;

  @ApiProperty({ description: '게시글 본문 (필수)' })
  content!: string;

  @ApiPropertyOptional({ description: '태그 목록', type: [String] })
  tags?: string[];

  @ApiProperty({ description: '카테고리 이름' })
  categoryName!: string;
}
