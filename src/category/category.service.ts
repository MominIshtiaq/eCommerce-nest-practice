import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IsNull, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { buildCategoryTree } from 'src/utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async create(createCategoryDto: CreateCategoryDto) {
    let parentCatgory: Category | null = null;

    if (createCategoryDto.parentId) {
      parentCatgory = await this.findOne(createCategoryDto.parentId);
    }
    const category = this.categoryRepository.create(createCategoryDto);
    category.parent = parentCatgory ?? null;
    return await this.categoryRepository.save(category);
  }

  public async findAll(paginationDto: PaginationDto) {
    const paginated = await this.paginationProvider.paginateQuery(
      paginationDto,
      this.categoryRepository,
      { isActive: true },
      ['children', 'parent'],
    );

    return {
      ...paginated,
      data: buildCategoryTree(paginated.data),
    };
  }

  public async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['children', 'parent'],
    });
    if (!category) throw new NotFoundException('Item not found');
    return category;
  }

  public async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Item not found');
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  public async remove(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Item not found');
    category.isActive = false;
    return await this.categoryRepository.softRemove(category);
  }
}
