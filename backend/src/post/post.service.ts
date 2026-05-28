import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveDraftDto } from './dto/save-draft.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { Category } from './entities/category.entity';
import { Post, PostStatus } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // 임시 저장
  async saveDraft(saveDraftDto: SaveDraftDto) {
    const {
      postId,
      title = '',
      content = '',
      tags = [],
      categoryName,
    } = saveDraftDto;

    let categoryId;

    if (categoryName) {
      let category = await this.categoryRepository.findOne({
        where: { name: categoryName },
      });

      if (!category) {
        category = this.categoryRepository.create({ name: categoryName });
        category = await this.categoryRepository.save(category);
      }

      categoryId = category.id;
    }

    const post = this.postRepository.create({
      id: postId,
      title,
      content,
      tags,
      status: PostStatus.DRAFT,
      categoryId,
    });

    const savedPost = await this.postRepository.save(post);

    return {
      id: savedPost.id,
      message: postId ? '임시 저장 업데이트 완료' : '임시 저장 완료',
    };
  }

  async getLatestDraft() {
    return this.postRepository.findOne({
      where: { status: PostStatus.DRAFT },
      order: { updatedAt: 'DESC' },
    });
  }

  // Publish
  async publishPost(publishPostDto: PublishPostDto) {
    const { postId, title, content, tags = [], categoryName } = publishPostDto;

    let category = await this.categoryRepository.findOne({
      where: { name: categoryName },
    });

    if (!category && categoryName) {
      category = this.categoryRepository.create({ name: categoryName });
      category = await this.categoryRepository.save(category);
    }

    if (postId) {
      // 기존 DRAFT 글을 PUBLISHED로 상태 변경하며 덮어쓰기
      await this.postRepository.update(postId, {
        title,
        content,
        tags,
        categoryId: category?.id, // 카테고리 ID 연결
        status: PostStatus.PUBLISHED,
      });

      return {
        id: postId,
        message: '게시글 퍼블리싱 성공',
      };
    } else {
      // 임시 저장 없이 바로 작성과 동시에 Publishing 하는 경우
      const newPost = this.postRepository.create({
        title,
        content,
        tags,
        categoryId: category?.id,
        status: PostStatus.PUBLISHED,
      });
      const savedPost = await this.postRepository.save(newPost);

      return {
        id: savedPost.id,
        message: '게시글 퍼블리싱 성공',
      };
    }
  }

  // 전체 게시글 조회 (PUBLISHED 상태만)
  async findAll(page: number, limit: number, categoryId?: number) {
    const skip = (page - 1) * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      where: {
        status: PostStatus.PUBLISHED,
        ...(categoryId && { categoryId }),
      },
      relations: ['category'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: posts,
      meta: {
        totalItems: total,
        itemCount: posts.length,
        itemsPerPage: limit,
        totalPage: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  // 상세 포스트 조회
  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id, status: PostStatus.PUBLISHED },
      relations: ['category'],
    });

    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  // 게시글 삭제
  async remove(id: number) {
    await this.postRepository.delete(id);
    return {
      message: '게시글이 삭제되었습니다.',
    };
  }
}
