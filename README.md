# Cozey Warehouse Management System

A warehouse management system for handling gift box orders and their component products. This system helps warehouse staff manage picking and packing operations efficiently.

## Features

- **Picking List Generation**: Automatically generates a consolidated list of all products that need to be picked for a specific date's orders.
- **Packing List Generation**: Creates detailed packing lists showing order information and the components needed for each gift box.
- **Date-based Filtering**: View picking and packing lists for specific dates.
- **Mock Data Integration**: Includes sample order and product data for demonstration.

## Project Structure

```
.
├── backend/           # Node.js/Express backend
│   ├── src/          # Source code
│   ├── dist/         # Compiled TypeScript
│   └── tests/        # Test files
├── frontend/         # React frontend
│   ├── src/         # Source code
│   └── public/      # Static files
└── data/            # Mock data files
    ├── orders.json  # Sample orders
    └── products.json # Product definitions
```

## Prerequisites

- Node.js >= 14
- npm >= 6

## Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd cozey-warehouse
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server (from the backend directory):
```bash
npm run dev
```

2. Start the frontend development server (from the frontend directory):
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## API Endpoints

- `GET /api/picking-list?date=YYYY-MM-DD` - Get the picking list for a specific date
- `GET /api/packing-list?date=YYYY-MM-DD` - Get the packing list for a specific date

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Technical Decisions

1. **TypeScript**: Used for both frontend and backend to ensure type safety and better developer experience.
2. **Material-UI**: Chosen for the frontend to provide a clean, professional UI with minimal custom styling needed.
3. **Express**: Used for the backend due to its simplicity and wide adoption in the Node.js ecosystem.
4. **Jest**: Used for testing both frontend and backend code.

## Limitations and Future Improvements

1. **Data Persistence**: Currently using mock JSON files. Could be improved by adding a proper database.
2. **Authentication**: No authentication system in place. Should add user authentication for production use.
3. **Error Handling**: Basic error handling implemented. Could be enhanced with more detailed error messages and recovery strategies.
4. **Caching**: No caching implemented. Could add Redis or similar for frequently accessed data.
5. **Validation**: Basic validation only. Could add more comprehensive input validation and sanitization.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 