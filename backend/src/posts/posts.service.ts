import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, PostStatus } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { SaveDraftDto } from './dto/save-draft.dto';
import { PublishPostDto } from './dto/publish-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private posts: Repository<Post>,
    @InjectRepository(Category) private categories: Repository<Category>,
  ) {}

  private async resolveCategoryId(categoryName?: string): Promise<number | null> {
    if (!categoryName) return null;

    let category = await this.categories.findOne({
      where: {
        name: categoryName,
      }
    });

    if (!category) {
      category = await this.categories.save(
        this.categories.create({ name: categoryName }),
      );
    }

    return category.id
  }

  async saveDraft(dto: SaveDraftDto) {
    const categoryId = await this.resolveCategoryId(dto.categoryName);

    if (dto.postId) {
      await this.posts.update(dto.postId, {
        title: dto.title ?? '',
        content: dto.content ?? '',
        tags: dto.tags ?? [],
        status: PostStatus.DRAFT,
        categoryId,
      });

      return {
        id: dto.postId,
        message: '임시 저장 업데이트 완료',
      };
    }

    const post = await this.posts.save(
      this.posts.create({
        title: dto.title ?? '',
        content: dto.content ?? '',
        tags: dto.tags ?? [],
        status: PostStatus.DRAFT,
        categoryId,
      }),
    );

    return {
      id: post.id,
      message: '임시 저장 완료',
    };
  }

  async getLatestDraft() {
    const [draft] = await this.posts.find({
      where: { status: PostStatus.DRAFT },
      relations: { category: true },
      order: { updatedAt: 'DESC' },
      take: 1,
    });

    return draft ?? null;
  }

  async publish(dto: PublishPostDto) {
    const categoryId = await this.resolveCategoryId(dto.categoryName);

    if (dto.postId) {
      await this.posts.update(dto.postId, {
        title: dto.title,
        content: dto.content,
        tags: dto.tags ?? [],
        status: PostStatus.PUBLISHED,
        categoryId,
      });

      return {
        id: dto.postId,
        message: '게시글 발행 성공',
      };
    }

    const post = await this.posts.save(
      this.posts.create({
        title: dto.title,
        content: dto.content,
        tags: dto.tags ?? [],
        status: PostStatus.PUBLISHED,
        categoryId,
      }),      
    );

    return {
      id: post.id,
      message: '게시글 발행 성공',
    };
  }

  async findAll(page = 1, limit = 10, categoryId?: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.posts.findAndCount({
      where: {
        status: PostStatus.PUBLISHED,
        ...(categoryId ? { categoryId } : {}),
      },
      relations: { category: true },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const post = await this.posts.findOne({
      where: { id, status: PostStatus.PUBLISHED },
      relations: { category: true },
    });

    if (!post) {
      throw new NotFoundException('해당 게시글을 찾을 수 없습니다.');
    }

    return post;
  }

  async remove(id: number) {
    await this.posts.delete(id);
    return {
      message: '게시글이 삭제되었습니다.',
    };
  }
}
