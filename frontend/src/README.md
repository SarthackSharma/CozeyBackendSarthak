# Frontend Architecture

Following Clean Architecture and Screaming Architecture principles, the frontend is organized into the following structure:

```
src/
├── domain/                     # Enterprise Business Rules
│   ├── orders/                # Order Domain
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── value-objects/
│   ├── products/              # Product Domain
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── value-objects/
│   ├── warehouse/             # Warehouse Domain
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── value-objects/
│   └── shared/                # Shared Domain Logic
│       ├── entities/
│       └── value-objects/
│
├── application/               # Application Business Rules
│   ├── orders/               # Order Use Cases
│   │   ├── hooks/
│   │   └── services/
│   ├── products/             # Product Use Cases
│   │   ├── hooks/
│   │   └── services/
│   └── warehouse/            # Warehouse Use Cases
│       ├── hooks/
│       └── services/
│
├── infrastructure/           # Frameworks & Drivers
│   ├── api/                 # API Integration
│   │   ├── orders/
│   │   ├── products/
│   │   └── warehouse/
│   ├── storage/             # Local Storage
│   └── services/            # External Services
│
├── interface/               # Interface Adapters
│   ├── components/          # Reusable UI Components
│   │   ├── common/         # Shared Components
│   │   ├── orders/         # Order-related Components
│   │   ├── products/       # Product-related Components
│   │   └── warehouse/      # Warehouse-related Components
│   ├── pages/              # Page Components
│   │   ├── orders/
│   │   ├── products/
│   │   └── warehouse/
│   └── layouts/            # Layout Components
│
└── presentation/           # UI Layer
    ├── orders/            # Order Features
    │   ├── components/
    │   ├── hooks/
    │   └── store/
    ├── products/          # Product Features
    │   ├── components/
    │   ├── hooks/
    │   └── store/
    └── warehouse/         # Warehouse Features
        ├── components/
        ├── hooks/
        └── store/
```

## Key Principles

1. **Domain Layer**
   - Contains business entities and interfaces
   - Framework-agnostic business logic
   - Pure TypeScript/JavaScript

2. **Application Layer**
   - Contains application-specific logic
   - Custom hooks and services
   - Business use cases

3. **Infrastructure Layer**
   - Handles external communication
   - API integration
   - Local storage

4. **Interface Layer**
   - Reusable UI components
   - Layout components
   - Page components

5. **Presentation Layer**
   - Feature-specific components
   - State management
   - UI logic

## Benefits

1. **Business-First**: Structure reflects business domains
2. **Component Reusability**: Clear separation of reusable components
3. **State Management**: Organized by feature
4. **Testability**: Easy to test business logic
5. **Maintainability**: Clear boundaries between layers 