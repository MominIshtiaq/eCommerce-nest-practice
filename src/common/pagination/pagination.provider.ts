import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { Paginated } from './pagination.interface';
import { REQUEST } from '@nestjs/core';
import { type Request } from 'express';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationDto: PaginationDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
    relation?: string[],
  ): Promise<Paginated<T>> {
    const limit = paginationDto?.limit ?? 10;
    const page = paginationDto?.page ?? 1;

    const findOptions: FindManyOptions = {
      take: limit,
      skip: (page - 1) * limit,
    };

    if (where) {
      findOptions.where = where;
    }

    if (relation) {
      findOptions.relations = relation;
    }

    const data = await repository.find(findOptions);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);

    const hostname = this.request.headers.host; // localhost:3002
    const protocol = this.request.protocol; // http
    const baseUrl = `${protocol}://${hostname}/`; // http://localhost:3002/
    const url = new URL(this.request.url, baseUrl); // http://localhost:3002/user?limit=10&page=1

    const nextPage = totalPages === 0 || page === totalPages ? page : page + 1;
    const prevPage = page <= 1 ? 1 : page - 1;

    return {
      data,
      meta: {
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
      },
      links: {
        first: `${url.origin}${url.pathname}?limit=${limit}&page=1`,
        last: `${url.origin}${url.pathname}?limit=${limit}&page=${totalPages || 1}`,
        current: `${url.origin}${url.pathname}?limit=${limit}&page=${page}`,
        next: `${url.origin}${url.pathname}?limit=${limit}&page=${nextPage}`,
        previous: `${url.origin}${url.pathname}?limit=${limit}&page=${prevPage}`,
      },
    };
  }
}
