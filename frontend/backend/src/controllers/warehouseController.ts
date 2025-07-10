import { Request, Response } from 'express';
import { WarehouseService } from '../services/warehouseService';

export class WarehouseController {
  private warehouseService: WarehouseService;

  constructor() {
    this.warehouseService = new WarehouseService();
  }

  getPickingList = async (req: Request, res: Response): Promise<void> => {
    try {
      const date = req.query.date as string;
      if (!date) {
        res.status(400).json({ error: 'Date parameter is required' });
        return;
      }

      const pickingList = await this.warehouseService.generatePickingList(date);
      res.json(pickingList);
    } catch (error) {
      throw error;
    }
  };

  getPackingList = async (req: Request, res: Response): Promise<void> => {
    try {
      const date = req.query.date as string;
      if (!date) {
        res.status(400).json({ error: 'Date parameter is required' });
        return;
      }

      const packingList = await this.warehouseService.generatePackingList(date);
      res.json(packingList);
    } catch (error) {
      throw error;
    }
  };
} 