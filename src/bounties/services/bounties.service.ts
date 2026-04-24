import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bounty, BountyStatus } from '../schemas/bounty.schema';
import { Pirate } from '../../pirates/schemas/pirate.schema';
import { CreateBountyDto } from '../dtos/create-bounty.dto';
import { UpdateBountyDto } from '../dtos/update-bounty.dto';

@Injectable()
export class BountiesService {
  constructor(
    @InjectModel(Bounty.name) private bountyModel: Model<Bounty>,
    @InjectModel(Pirate.name) private pirateModel: Model<Pirate>,
  ) {}

  async create(createBountyDto: CreateBountyDto): Promise<Bounty> {
    const pirateId = new Types.ObjectId(createBountyDto.pirata);

    const pirate = await this.pirateModel.findById(pirateId).exec();
    if (!pirate) {
      throw new NotFoundException(
        `El pirata con ID ${createBountyDto.pirata} no existe.`,
      );
    }

    const createdBounty = new this.bountyModel({
      ...createBountyDto,
      pirata: pirateId,
    });

    const saved = await createdBounty.save();
    return saved.populate('pirata');
  }

  async findAll(): Promise<Bounty[]> {
    return this.bountyModel.find().populate('pirata').exec();
  }

  async findOne(id: string): Promise<Bounty> {
    const bounty = await this.bountyModel
      .findById(id)
      .populate('pirata')
      .exec();

    if (!bounty) {
      throw new NotFoundException(
        `Cartel de búsqueda con ID ${id} no encontrado.`,
      );
    }

    return bounty;
  }

  async findActive(): Promise<Bounty[]> {
    return this.bountyModel
      .find({ estado: BountyStatus.WANTED })
      .populate('pirata')
      .sort({ cantidadBellys: -1 })
      .exec();
  }

  async update(id: string, updateBountyDto: UpdateBountyDto): Promise<Bounty> {
    await this.findOne(id);

    if (updateBountyDto.pirata) {
      const pirateId = new Types.ObjectId(updateBountyDto.pirata);
      const pirate = await this.pirateModel.findById(pirateId).exec();
      if (!pirate) {
        throw new NotFoundException(
          `El pirata con ID ${updateBountyDto.pirata} no existe.`,
        );
      }
    }

    return (await this.bountyModel
      .findByIdAndUpdate(id, updateBountyDto, { new: true })
      .populate('pirata')
      .exec())!;
  }

  async remove(id: string): Promise<Bounty> {
    await this.findOne(id);

    return (await this.bountyModel.findByIdAndDelete(id).exec())!;
  }
}

