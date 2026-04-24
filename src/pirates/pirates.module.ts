import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pirate, PirateSchema } from './schemas/pirate.schema';
import { PiratesService } from './services/pirates.service';
import { PiratesController } from '../controllers/pirates.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pirate.name, schema: PirateSchema }]),
  ],
  providers: [PiratesService],
  controllers: [PiratesController],
  exports: [PiratesService],
})
export class PiratesModule {}
