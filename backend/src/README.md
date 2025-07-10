# Backend Architecture

Following Clean Architecture and Screaming Architecture principles, the backend is organized into the following structure:

```
src/
├── domain/                     # Enterprise Business Rules
│   ├── orders/                # Order Domain
│   │   ├── entities/         
│   │   ├── repositories/     
│   │   ├── services/        
│   │   └── value-objects/    
│   ├── products/              # Product Domain
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── value-objects/
│   ├── warehouse/             # Warehouse Domain
│   │   ├── entities/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── value-objects/
│   └── shared/                # Shared Domain Logic
│       ├── entities/
│       └── value-objects/
│
├── application/               # Application Business Rules
│   ├── orders/               # Order Use Cases
│   │   ├── create-order/
│   │   ├── update-order/
│   │   └── find-orders/
│   ├── products/             # Product Use Cases
│   │   ├── create-product/
│   │   ├── update-product/
│   │   └── find-products/
│   └── warehouse/            # Warehouse Use Cases
│       ├── generate-picking-list/
│       └── generate-packing-list/
│
├── infrastructure/           # Frameworks & Drivers
│   ├── persistence/         # Data Storage
│   │   ├── json/           # JSON File Storage
│   │   └── database/       # Future Database Implementation
│   ├── api/                # API Layer
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middlewares/
│   └── services/           # External Services
│
└── interface/              # Interface Adapters
    ├── controllers/        # Controller Implementations
    ├── presenters/        # Response Formatters
    └── validators/        # Request Validators
```

## Key Principles

1. **Domain Layer**
   - Contains enterprise business rules
   - No dependencies on outer layers
   - Pure business logic

2. **Application Layer**
   - Contains application-specific business rules
   - Orchestrates domain objects
   - Implements use cases

3. **Infrastructure Layer**
   - Contains frameworks and tools
   - Implements interfaces defined in inner layers
   - Handles external concerns

4. **Interface Layer**
   - Converts data between layers
   - Handles HTTP/API specific logic
   - Implements controllers and presenters

## Benefits

1. **Business-First**: Folder structure reflects business domains
2. **Independence**: Each layer can be changed without affecting others
3. **Testability**: Business logic can be tested without infrastructure
4. **Maintainability**: Clear separation of concerns
5. **Scalability**: Easy to add new features in respective domains 