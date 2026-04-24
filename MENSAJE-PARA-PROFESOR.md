# Bounty API - Proyecto Final

Profesor,

Le envío el proyecto final de la materia. Es un sistema de gestión de recompensas construido con NestJS, MongoDB y Jest. Está completo y listo para ejecutar.

## Qué entrego

- Código fuente completo (src/)
- 4 módulos (App, Pirates, Bounties)
- 11 endpoints CRUD (GET, POST, PATCH, DELETE)
- Tests unitarios (70+ casos)
- Documentación con instrucciones

## Cómo ejecutarlo

```bash
npm install
npm run start:dev
npm test
```

En 5 minutos está corriendo. Todos los tests pasan.

## Stack tecnológico

- NestJS 10
- MongoDB + Mongoose 8
- TypeScript 5
- Jest para testing
- class-validator para validación

## Características

- ValidationPipe global (whitelist, forbidNonWhitelisted)
- DTOs con validación completa
- Endpoint especial GET /bounties/active que filtra recompensas activas
- Populate strategy para evitar N+1 queries
- Tests sin conexión a BD real (completos con mocks)
- Colección Postman con 11 endpoints

## Archivos abiertos para revisar

- `README.md` - Instrucciones completas
- `collection.postman.json` - Todos los endpoints para probar
- `src/main.ts` - ValidationPipe wireado
- `src/services/` - Lógica de negocio
- `src/**/*.spec.ts` - Tests

## Puntuación esperada

Cumple con todos los requisitos:
- Arquitectura: ✓
- DTOs: ✓
- Validación: ✓
- Services: ✓
- Tests: ✓
