import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pirate } from '../schemas/pirate.schema';
import { CreatePirateDto } from '../dtos/create-pirate.dto';
import { UpdatePirateDto } from '../dtos/update-pirate.dto';

@Injectable()
export class PiratesService {
  constructor(
    @InjectModel(Pirate.name) private pirateModel: Model<Pirate>,
  ) {}

  async create(createPirateDto: CreatePirateDto): Promise<Pirate> {
    const createdPirate = new this.pirateModel(createPirateDto);
    return createdPirate.save();
  }

  async findAll(): Promise<Pirate[]> {
    return this.pirateModel.find().exec();
  }

  async findOne(id: string): Promise<Pirate> {
    const pirate = await this.pirateModel.findById(id).exec();

    if (!pirate) {
      throw new NotFoundException(`Pirata con ID ${id} no encontrado.`);
    }

    return pirate;
  }

  async update(id: string, updatePirateDto: UpdatePirateDto): Promise<Pirate> {
    await this.findOne(id);

    return (await this.pirateModel
      .findByIdAndUpdate(id, updatePirateDto, { new: true })
      .exec())!;
  }

  async remove(id: string): Promise<Pirate> {
    await this.findOne(id);

    return (await this.pirateModel.findByIdAndDelete(id).exec())!;
  }
}

