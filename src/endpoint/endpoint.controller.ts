import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { EndpointService } from './endpoint.service';
import { CreateEndpointDto } from './dto/create-endpoint.interface';
import { Router, type Request as ExpressRequest } from 'express';
import { getAllRoutes } from 'src/utils';
@Controller('endpoint')
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @Post()
  public async create(@Body() createEndpointDto: CreateEndpointDto) {
    return await this.endpointService.create(createEndpointDto);
  }

  /* 
  This GET method will return
  {
  "routes": [
    "GET /api/swagger-ui-init.js",
    "GET /api/api/swagger-ui-init.js",
    "GET /api",
    "GET /api/index.html",
    "GET /api/LICENSE",
    "GET /api/",
    "GET /api-json",
    "GET /api-yaml",
    "GET /",
    "POST /user",
    "GET /user",
    "GET /user/:id",
    "PATCH /user/:id",
    "DELETE /user/:id",
    "POST /role",
    "GET /role",
    "PATCH /role/:name",
    "DELETE /role/:name",
    "POST /auth/signup",
    "POST /auth/signin",
    "POST /endpoint",
    "GET /endpoint/all"
  ]
}
  */
  @Get('all')
  public async getAllRoutes(@Request() req: ExpressRequest) {
    const router = req.app.router as Router;
    return getAllRoutes(router);
  }
}
