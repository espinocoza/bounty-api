import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { PiratesService } from './pirates.service';
import { Pirate } from '../schemas/pirate.schema';
import { Types } from 'mongoose';

describe('PiratesService', () => {
  let service: PiratesService;
  let mockPirateModel: any;

  const validPirateId = new Types.ObjectId();

  const mockPirate = {
    _id: validPirateId,
    nombre: 'Roronoa Zoro',
    tripulacion: 'Straw Hat Pirates',
    tieneFrutaDelDiablo: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockPirateModel = jest.fn();
    mockPirateModel.find = jest.fn();
    mockPirateModel.findById = jest.fn();
    mockPirateModel.findByIdAndUpdate = jest.fn();
    mockPirateModel.findByIdAndDelete = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PiratesService,
        {
          provide: getModelToken(Pirate.name),
          useValue: mockPirateModel,
        },
      ],
    }).compile();

    service = module.get<PiratesService>(PiratesService);
  });

  describe('findAll()', () => {
    it('should return array of pirates', async () => {
      const mockPirates = [
        mockPirate,
        {
          _id: new Types.ObjectId(),
          nombre: 'Monkey D. Luffy',
          tripulacion: 'Straw Hat Pirates',
          tieneFrutaDelDiablo: true,
        },
      ];

      mockPirateModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPirates),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].nombre).toBe('Roronoa Zoro');
      expect(mockPirateModel.find).toHaveBeenCalled();
    });

    it('should return empty array if no pirates', async () => {
      mockPirateModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne(id)', () => {
    it('should return pirate if it exists', async () => {
      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPirate),
      });

      const result = await service.findOne(validPirateId.toString());

      expect(result).toBeDefined();
      expect(result.nombre).toBe('Roronoa Zoro');
      expect(mockPirateModel.findById).toHaveBeenCalledWith(validPirateId.toString());
    });

    it('should throw NotFoundException if pirate does not exist', async () => {
      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOne(validPirateId.toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('create(createPirateDto)', () => {
    it('should create new pirate', async () => {
      const createPirateDto = {
        nombre: 'Nami',
        tripulacion: 'Straw Hat Pirates',
        tieneFrutaDelDiablo: false,
      };

      const mockSave = jest.fn().mockResolvedValue({
        _id: validPirateId,
        ...createPirateDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPirateModel.mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await service.create(createPirateDto);

      expect(result.nombre).toBe('Nami');
      expect(result._id).toBeDefined();
    });
  });

  describe('update(id, updatePirateDto)', () => {
    it('should update pirate fields', async () => {
      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPirate),
      });

      mockPirateModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockPirate,
          tieneFrutaDelDiablo: true,
        }),
      });

      const updatePirateDto = {
        tieneFrutaDelDiablo: true,
      };

      const result = await service.update(validPirateId.toString(), updatePirateDto);

      expect(result.tieneFrutaDelDiablo).toBe(true);
      expect(mockPirateModel.findByIdAndUpdate).toHaveBeenCalledWith(
        validPirateId.toString(),
        updatePirateDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if pirate does not exist', async () => {
      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const updatePirateDto = { nombre: 'Nuevo Nombre' };

      await expect(
        service.update(validPirateId.toString(), updatePirateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove(id)', () => {
    it('should delete pirate', async () => {
      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPirate),
      });

      mockPirateModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPirate),
      });

      const result = await service.remove(validPirateId.toString());

      expect(result).toBeDefined();
      expect(mockPirateModel.findByIdAndDelete).toHaveBeenCalledWith(
        validPirateId.toString(),
      );
    });

    it('should throw NotFoundException if pirate does not exist', async () => {
      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.remove(validPirateId.toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

