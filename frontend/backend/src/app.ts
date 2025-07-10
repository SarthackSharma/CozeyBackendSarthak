import express from 'express';
import cors from 'cors';
import { WarehouseController } from './controllers/warehouseController';

const app = express();
const warehouseController = new WarehouseController();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body
  });
  next();
});

// Routes
app.get('/api/warehouse/picking-list', warehouseController.getPickingList);
app.get('/api/warehouse/packing-list', warehouseController.getPackingList);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app; 