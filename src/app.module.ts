import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PiratesModule } from './pirates/pirates.module';
import { BountiesModule } from './bounties/bounties.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb://localhost:27017/bounty-api-dev',
    ),
    PiratesModule,
    BountiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
