import {
  Controller,
  UseGuards,
  Post as HttpPost,
  Body,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { SaveDraftDto } from './dto/save-draft.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('게시글 (Post)')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 🔒 작성중인 포스트 임시저장, Ctrl+S
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '임시 저장 (자동/수동)' })
  @HttpPost('post')
  saveDraft(@Body() saveDraftDto: SaveDraftDto) {
    return this.postService.saveDraft(saveDraftDto);
  }

  // 🔒 임시글 불러오기
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '가장 최근 임시 저장 포스트 불러오기' })
  @Get('draft')
  getDraft() {
    return this.postService.getLatestDraft();
  }

  // 🔒 게시글 퍼블리싱
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '게시글 퍼블리싱' })
  @HttpPost('publish')
  publishPost(@Body() publishPostDto: PublishPostDto) {
    return this.postService.publishPost(publishPostDto);
  }

  // 🔒 게시글 삭제
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }

  // 🔒 이미지 업로드
  @HttpPost('image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${file.originalname}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = `http://localhost/api/uploads/${file.filename}`;
    return { url: imageUrl };
  }

  // 전체 게시글 조회
  @ApiOperation({ summary: '전체 게시글 목록 조회' })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: number,
  ) {
    return this.postService.findAll(page, limit, categoryId);
  }

  // 단일 게시글 조회
  @ApiOperation({ summary: '단일 게시글 조회' })
  @ApiParam({ name: 'id', description: '게시글 ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }
}
