import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { CommonModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { days } from '@nestjs/throttler';
import { UploadthingService } from '@app/common/services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
    ]),
    CommonModule.register(),
    ClientsModule.registerAsync([
      {
        name: 'USER_EMAIL_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get('USER_EMAIL_QUEUE_NAME'),
            queueOptions: {
              durable: true,
              arguments: {
                'x-message-ttl': days(
                  configService.get('USER_EMAIL_QUEUE_TTL'),
                ),
              },
            },
          },
        }),
      },
      {
        name: 'PAYMENT_RENTAL_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('RENT_SERVICE_HOST'),
            port: configService.get('RENT_SERVICE_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService, UploadthingService],
})
export class UserServiceModule {}
