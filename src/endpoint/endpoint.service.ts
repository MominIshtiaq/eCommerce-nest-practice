import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Endpoint } from './entities/endpoint.entity';
import { Repository } from 'typeorm';
import { CreateEndpointDto } from './dto/create-endpoint.interface';

@Injectable()
export class EndpointService {
  constructor(
    @InjectRepository(Endpoint)
    private readonly endpointRepository: Repository<Endpoint>,
  ) {}

  public async create(createEndpointDto: CreateEndpointDto) {
    const endpoint = this.endpointRepository.create(createEndpointDto);
    return await this.endpointRepository.save(endpoint);
  }
}
