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

  public async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      if (createProductDto.categoryId) {
        const catgory = await this.catgegoryService.findOne(
          createProductDto.categoryId,
        );
        product.category = catgory;
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

  public async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.catgegoryService.findOne(
        updateProductDto.categoryId,
      );
      product.category = category;
    }

    Object.assign(product, updateProductDto);

    return await this.productRepository.save(product);
  }

  public async remove(id: number) {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }

  public async uploadFile(id: number, file: string) {
    const product = await this.findOne(id);
    product.image = file;
    return await this.productRepository.save(product);
  }
}
