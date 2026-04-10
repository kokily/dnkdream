import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  // POST /api/post: 새 게시글 작성
  @Post('post')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  // GET /api/posts: 전체 게시글 조회
  @Get('/posts')
  findAll() {
    return this.postService.findAll();
  }

  // GET /api/post/:id
  @Get('/post/:id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }
}
