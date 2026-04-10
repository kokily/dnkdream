import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    // TypeORM Post DB 주입
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  // 게시글 작성
  async create(createPostDto: CreatePostDto) {
    const newPost = this.postRepository.create(createPostDto);
    return await this.postRepository.save(newPost);
  }

  // 전체 게시글 조회
  async findAll() {
    return await this.postRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // 특정 게시글 하나 조회
  async findOne(id: number) {
    return await this.postRepository.findOne({ where: { id } });
  }
}
