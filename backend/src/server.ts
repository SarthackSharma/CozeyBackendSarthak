import app from './app';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const port = process.env.PORT || 3001;

// Verify data files exist
const dataDir = path.join(__dirname, '..', 'data');
const productsFile = path.join(dataDir, 'products.json');
const ordersFile = path.join(dataDir, 'orders.json');

console.log('Starting server with configuration:', {
  port,
  dataDir,
  productsFile,
  ordersFile,
  productsExists: fs.existsSync(productsFile),
  ordersExists: fs.existsSync(ordersFile)
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 