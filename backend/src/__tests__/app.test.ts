import request from 'supertest';
import express from 'express';
import { WarehouseController } from '../controllers/warehouseController';

// Mock the WarehouseController class
jest.mock('../controllers/warehouseController', () => {
  return {
    WarehouseController: jest.fn().mockImplementation(() => ({
      getPickingList: jest.fn(),
      getPackingList: jest.fn()
    }))
  };
});

describe('App', () => {
  let app: express.Application;
  let mockGetPickingList: jest.Mock;
  let mockGetPackingList: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Get fresh instance of mocked controller
    const controller = new WarehouseController();
    mockGetPickingList = controller.getPickingList as jest.Mock;
    mockGetPackingList = controller.getPackingList as jest.Mock;

    // Re-import app to get fresh instance
    app = require('../app').default;
  });

  describe('Middleware', () => {
    it('should use CORS middleware', async () => {
      mockGetPickingList.mockImplementation((req, res) => res.status(200).json({}));

      const response = await request(app)
        .options('/api/warehouse/picking-list')
        .expect(204);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should parse JSON body', async () => {
      const mockData = { test: 'data' };
      mockGetPickingList.mockImplementation((req, res) => res.json(req.body));

      const response = await request(app)
        .post('/api/warehouse/picking-list')
        .send(mockData)
        .expect(200);

      expect(response.body).toEqual(mockData);
    });

    it('should log requests', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      mockGetPickingList.mockImplementation((req, res) => res.json({}));
      
      await request(app)
        .get('/api/warehouse/picking-list')
        .query({ date: '2024-02-14' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'GET /api/warehouse/picking-list',
        expect.objectContaining({
          query: { date: '2024-02-14' },
          body: {}
        })
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Routes', () => {
    it('should handle picking list requests', async () => {
      const mockPickingList = [{ id: 1, items: [] }];
      mockGetPickingList.mockImplementation((req, res) => {
        res.json(mockPickingList);
      });

      const response = await request(app)
        .get('/api/warehouse/picking-list')
        .query({ date: '2024-02-14' })
        .expect(200);

      expect(response.body).toEqual(mockPickingList);
      expect(mockGetPickingList).toHaveBeenCalled();
    });

    it('should handle packing list requests', async () => {
      const mockPackingList = [{ id: 1, items: [] }];
      mockGetPackingList.mockImplementation((req, res) => {
        res.json(mockPackingList);
      });

      const response = await request(app)
        .get('/api/warehouse/packing-list')
        .query({ date: '2024-02-14' })
        .expect(200);

      expect(response.body).toEqual(mockPackingList);
      expect(mockGetPackingList).toHaveBeenCalled();
    });

    it('should handle missing date parameter', async () => {
      mockGetPickingList.mockImplementation((req, res) => {
        res.status(400).json({ error: 'Date parameter is required' });
      });

      const response = await request(app)
        .get('/api/warehouse/picking-list')
        .expect(400);

      expect(response.body).toEqual({ error: 'Date parameter is required' });
    });
  });

  describe('Error Handling', () => {
    it('should handle errors with error middleware', async () => {
      const error = new Error('Test error');
      mockGetPickingList.mockImplementation(() => {
        throw error;
      });

      const consoleSpy = jest.spyOn(console, 'error');

      const response = await request(app)
        .get('/api/warehouse/picking-list')
        .expect(500);

      expect(response.body).toEqual({ error: 'Test error' });
      expect(consoleSpy).toHaveBeenCalledWith('Error:', error);

      consoleSpy.mockRestore();
    });

    it('should handle errors without message', async () => {
      const error = new Error();
      mockGetPickingList.mockImplementation(() => {
        throw error;
      });

      const response = await request(app)
        .get('/api/warehouse/picking-list')
        .expect(500);

      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });
}); 