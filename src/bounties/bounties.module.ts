import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bounty, BountySchema } from './schemas/bounty.schema';
import { Pirate, PirateSchema } from '../pirates/schemas/pirate.schema';
import { BountiesService } from './services/bounties.service';
import { BountiesController } from '../controllers/bounties.controller';
import { PiratesModule } from '../pirates/pirates.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bounty.name, schema: BountySchema },
      { name: Pirate.name, schema: PirateSchema },
    ]),
    PiratesModule,
  ],
  providers: [BountiesService],
  controllers: [BountiesController],
  exports: [BountiesService],
})
export class BountiesModule {}
