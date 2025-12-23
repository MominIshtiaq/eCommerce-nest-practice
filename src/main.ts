import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { getAllRoutes } from './utils';
import { Endpoint } from './endpoint/entities/endpoint.entity';
import { HttpEndpointEnum } from './endpoint/types';
import { Role } from './role/entities/role.entity';
import { Permission } from './permission/entities/permission.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ECommerce Nest Practice')
    .setDescription('The eCommerce Nestjs Practice API endpoints')
    .setVersion('1.0')
    .addTag('eCommerce')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3002);

  // Get all current endpoints
  const server = app.getHttpServer(); // OR const server = app.getHttpAdapter().getInstance();
  const router = server._events.request.router; // OR const router = server.router;
  const { routes } = getAllRoutes(router);

  const dataSource = app.get(DataSource); // get the DataSource from TypeORM
  const queryRunner = dataSource.createQueryRunner();
  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // Delete all endpoint & permission (TRUNCATE)
    await queryRunner.query('TRUNCATE endpoint RESTART IDENTITY CASCADE'); // to run the PostgreSQL query.
    await queryRunner.query('TRUNCATE permission RESTART IDENTITY CASCADE'); // to run the Postgres query
    console.log('Truncate successfully!!!');

    // Add all routes to the Endpoint Table
    for (const route of routes) {
      if (!route) continue;
      const [method, url] = route.split(' ');

      await queryRunner.manager // manager is similar to DataSource this allows us to Create Query Builder
        .createQueryBuilder()
        .insert()
        .into(Endpoint)
        .values({ url, method: method as HttpEndpointEnum })
        .execute();
    }

    const roles = await queryRunner.manager
      .getRepository(Role)
      .createQueryBuilder('role')
      .getMany();

    const endpoints = await queryRunner.manager
      .getRepository(Endpoint)
      .createQueryBuilder('endpoint')
      .getMany();

    for (const role of roles) {
      for (const endpoint of endpoints) {
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(Permission)
          .values({
            endpointId: endpoint.id,
            roleName: role.name,
            isAllow: role.name === 'Admin' ? true : false,
          })
          .execute();
      }
    }

    await queryRunner.commitTransaction();
    console.log('Inserted into the DB');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.log('Failed to truncate table', error);
  } finally {
    // We need to release queryRunner which is manually created
    await queryRunner.release();
  }
}
bootstrap();
