import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { BountiesService } from './bounties.service';
import { Bounty, BountyStatus } from '../schemas/bounty.schema';
import { Pirate } from '../../pirates/schemas/pirate.schema';
import { Types } from 'mongoose';

describe('BountiesService', () => {
  let service: BountiesService;
  let mockBountyModel: any;
  let mockPirateModel: any;

  const validPirateId = new Types.ObjectId();
  const validBountyId = new Types.ObjectId();
  const invalidPirateId = new Types.ObjectId();

  const mockPirate = {
    _id: validPirateId,
    nombre: 'Roronoa Zoro',
    tripulacion: 'Straw Hat Pirates',
    tieneFrutaDelDiablo: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBounty = {
    _id: validBountyId,
    pirata: validPirateId,
    cantidadBellys: 320000000,
    estado: BountyStatus.WANTED,
    createdAt: new Date(),
    updatedAt: new Date(),
    populate: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue({
      _id: validBountyId,
      pirata: mockPirate,
      cantidadBellys: 320000000,
      estado: BountyStatus.WANTED,
    }),
  };

  beforeEach(async () => {
    mockBountyModel = jest.fn();
    mockBountyModel.find = jest.fn();
    mockBountyModel.findById = jest.fn();
    mockBountyModel.findByIdAndUpdate = jest.fn();
    mockBountyModel.findByIdAndDelete = jest.fn();

    mockPirateModel = jest.fn();
    mockPirateModel.findById = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BountiesService,
        {
          provide: getModelToken(Bounty.name),
          useValue: mockBountyModel,
        },
        {
          provide: getModelToken(Pirate.name),
          useValue: mockPirateModel,
        },
      ],
    }).compile();

    service = module.get<BountiesService>(BountiesService);
  });

  describe('findAll()', () => {
    it('should return array of bounties with populated pirates', async () => {
      const mockBounties = [
        {
          _id: new Types.ObjectId(),
          pirata: mockPirate,
          cantidadBellys: 320000000,
          estado: BountyStatus.WANTED,
        },
        {
          _id: new Types.ObjectId(),
          pirata: mockPirate,
          cantidadBellys: 500000000,
          estado: BountyStatus.WANTED,
        },
      ];

      mockBountyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBounties),
      });

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].cantidadBellys).toBe(320000000);
      expect(mockBountyModel.find).toHaveBeenCalledWith();
    });

    it('should return empty array if no bounties exist', async () => {
      mockBountyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne(id)', () => {
    it('should return bounty if it exists', async () => {
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBounty.exec()),
      });

      const result = await service.findOne(validBountyId.toString());

      expect(result).toBeDefined();
      expect(result.cantidadBellys).toBe(320000000);
      expect(mockBountyModel.findById).toHaveBeenCalledWith(validBountyId.toString());
    });

    it('should throw NotFoundException if bounty does not exist', async () => {
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOne(validBountyId.toString()),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.findOne(validBountyId.toString()),
      ).rejects.toThrow(/Cartel de búsqueda con ID .* no encontrado/);
    });
  });

  describe('findActive()', () => {
    it('should return only bounties with WANTED status', async () => {
      const activeBounties = [
        {
          _id: new Types.ObjectId(),
          pirata: mockPirate,
          cantidadBellys: 3000000000,
          estado: BountyStatus.WANTED,
        },
        {
          _id: new Types.ObjectId(),
          pirata: mockPirate,
          cantidadBellys: 320000000,
          estado: BountyStatus.WANTED,
        },
      ];

      mockBountyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(activeBounties),
      });

      const result = await service.findActive();

      expect(result).toHaveLength(2);
      expect(result.every((b) => b.estado === BountyStatus.WANTED)).toBe(true);
      expect(mockBountyModel.find).toHaveBeenCalledWith({
        estado: BountyStatus.WANTED,
      });
    });

    it('should return bounties sorted by cantidadBellys descending', async () => {
      const sortedBounties = [
        {
          _id: new Types.ObjectId(),
          pirata: mockPirate,
          cantidadBellys: 3000000000,
          estado: BountyStatus.WANTED,
        },
        {
          _id: new Types.ObjectId(),
          pirata: mockPirate,
          cantidadBellys: 320000000,
          estado: BountyStatus.WANTED,
        },
      ];

      mockBountyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(sortedBounties),
      });

      const result = await service.findActive();

      expect(result[0].cantidadBellys).toBeGreaterThan(result[1].cantidadBellys);
    });

    it('should return empty array if no active bounties exist', async () => {
      mockBountyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.findActive();

      expect(result).toEqual([]);
    });
  });

  describe('create(createBountyDto)', () => {
    it('should create bounty if pirate exists', async () => {
      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockPirate),
      });

      const createBountyDto = {
        pirata: validPirateId.toString(),
        cantidadBellys: 320000000,
        estado: BountyStatus.WANTED,
      };

      const mockSave = jest.fn().mockResolvedValue({
        _id: validBountyId,
        ...createBountyDto,
        populate: jest.fn().mockResolvedValue(mockBounty.exec()),
      });

      mockBountyModel.mockImplementation(() => ({
        save: mockSave,
        populate: jest.fn().mockResolvedValue(mockBounty.exec()),
      }));

      await service.create(createBountyDto);

      expect(mockPirateModel.findById).toHaveBeenCalledWith(
        new Types.ObjectId(validPirateId.toString()),
      );
    });

    it('should throw NotFoundException if pirate does not exist', async () => {
      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const createBountyDto = {
        pirata: invalidPirateId.toString(),
        cantidadBellys: 500000000,
        estado: BountyStatus.WANTED,
      };

      await expect(service.create(createBountyDto)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.create(createBountyDto)).rejects.toThrow(
        /El pirata con ID .* no existe/,
      );
    });
  });

  describe('update(id, updateBountyDto)', () => {
    it('should update bounty if it exists', async () => {
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBounty.exec()),
      });

      mockBountyModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: validBountyId,
          pirata: mockPirate,
          cantidadBellys: 2000000000,
          estado: BountyStatus.CAPTURED,
        }),
      });

      const updateBountyDto = {
        estado: BountyStatus.CAPTURED,
        cantidadBellys: 2000000000,
      };

      const result = await service.update(validBountyId.toString(), updateBountyDto);

      expect(result.estado).toBe(BountyStatus.CAPTURED);
      expect(result.cantidadBellys).toBe(2000000000);
      expect(mockBountyModel.findByIdAndUpdate).toHaveBeenCalledWith(
        validBountyId.toString(),
        updateBountyDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if bounty does not exist', async () => {
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update(validBountyId.toString(), {
          estado: BountyStatus.CAPTURED,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if referenced pirate does not exist', async () => {
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBounty.exec()),
      });

      mockPirateModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const updateBountyDto = {
        pirata: invalidPirateId.toString(),
      };

      await expect(
        service.update(validBountyId.toString(), updateBountyDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove(id)', () => {
    it('should delete bounty if it exists', async () => {
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockBounty.exec()),
      });

      mockBountyModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBounty.exec()),
      });

      const result = await service.remove(validBountyId.toString());

      expect(result).toBeDefined();
      expect(mockBountyModel.findByIdAndDelete).toHaveBeenCalledWith(
        validBountyId.toString(),
      );
    });

    it('should throw NotFoundException if bounty does not exist', async () => {
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.remove(validBountyId.toString()),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

