import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly catgegoryService: CategoryService,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async create(
    createProductDto: CreateProductDto,
    fileName?: string | undefined,
  ) {
    try {
      const product = this.productRepository.create(createProductDto);
      if (createProductDto.categoryId) {
        const catgory = await this.catgegoryService.findOne(
          createProductDto.categoryId,
        );
        product.category = catgory;
      }
      if (fileName) {
        product.image = fileName;
      }
      return await this.productRepository.save(product);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException();
    }
  }

  public async findAll(paginationDto: PaginationDto) {
    return await this.paginationProvider.paginateQuery(
      paginationDto,
      this.productRepository,
      undefined,
      ['category'],
    );
  }

  public async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException();
    return product;
  }

  public async update(
    id: number,
    updateProductDto: UpdateProductDto,
    fileName?: string | undefined,
  ) {
    const product = await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.catgegoryService.findOne(
        updateProductDto.categoryId,
      );
      product.category = category;
    }

    if (fileName) {
      product.image = fileName;
    }

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  public async remove(id: number) {
    return await this.productRepository.delete(id);
  }

  public async uploadFile(id: number, file: string) {
    const product = await this.findOne(id);
    product.image = file;
    return await this.productRepository.save(product);
  }
}
