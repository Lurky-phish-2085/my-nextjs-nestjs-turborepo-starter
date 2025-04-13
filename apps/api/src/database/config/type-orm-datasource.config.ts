import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

config();

const configService = new ConfigService();

const TypeOrmDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: [
    __dirname + '/../../../../../packages/api/src/**/*.entity.{js,ts}',
  ],
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
});

export default TypeOrmDataSource;
