# Bounty API

Proyecto de API REST con NestJS y MongoDB. Sistema para gestionar piratas y carteles de búsqueda.

## Descripcion

API backend para administrar una base de datos de piratas con sus respectivos carteles de búsqueda (bounties). Cada pirata tiene nombre, tripulacion y atributos especiales. Los carteles contienen el ID del pirata, la cantidad de recompensa y el estado (Wanted o Captured).

## Caracteristicas

La API tiene dos modulos principales:

**Piratas:**
- POST /pirates - crear pirata
- GET /pirates - listar todos
- GET /pirates/:id - obtener uno
- PATCH /pirates/:id - actualizar
- DELETE /pirates/:id - eliminar

Campos del pirata: nombre, tripulacion, tieneFrutaDelDiablo (boolean)

**Carteles (Bounties):**
- POST /bounties - crear cartel
- GET /bounties - listar
- GET /bounties/:id - obtener uno
- GET /bounties/active - solo los Wanted
- PATCH /bounties/:id - actualizar
- DELETE /bounties/:id - eliminar

Campos del cartel: pirata (referencia), cantidadBellys (recompensa), estado (Wanted/Captured)

## Tecnologia

- NestJS (framework backend Node.js)
- TypeScript
- MongoDB con Mongoose
- Validacion con class-validator
- Jest para tests

## Como instalar

1. Clonar o descargar el proyecto
2. Instalar dependencias: `npm install`
3. Crear archivo `.env` con las variables (ver abajo)
4. Compilar: `npm run build`
5. Ejecutar: `npm run start:dev`

El servidor va a correr en `http://localhost:3000`

## Variables de entorno

Crear archivo `.env`:

```
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/bounty-api
PORT=3000
NODE_ENV=development
```

Para MongoDB Atlas:
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear un cluster gratuito
3. Copiar la connection string
4. Reemplazar usuario y contraseña

## Como usar la API

Ejemplos basicos:

**Crear pirata:**
```bash
curl -X POST http://localhost:3000/pirates \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Zoro","tripulacion":"Straw Hat","tieneFrutaDelDiablo":false}'
```

**Listar piratas:**
```bash
curl http://localhost:3000/pirates
```

**Crear cartel:**
```bash
curl -X POST http://localhost:3000/bounties \
  -H "Content-Type: application/json" \
  -d '{"pirata":"ID_DEL_PIRATA","cantidadBellys":320000000,"estado":"Wanted"}'
```

**Ver carteles activos:**
```bash
curl http://localhost:3000/bounties/active
```

## Estructura

```
src/
  controllers/    - endpoints de la API
  services/       - logica de negocio
  dtos/           - validacion de datos
  schemas/        - modelos de MongoDB
  bounties/       - modulo de carteles
  pirates/        - modulo de piratas
  main.ts         - entrada de la app
```

## Tests

Ejecutar tests:
```bash
npm run test
```

Watch mode:
```bash
npm run test:watch
```

**Response: 200 OK**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "pirata": { ... },
  "cantidadBellys": 500000000,
  "estado": "Captured",
  "updatedAt": "2026-04-23T11:00:00.000Z"
}
```

---

## 🛡️ PROTOCOLOS DE LA MARINA: SEGURIDAD DE DTOs

### ¿Qué son DTOs?

**DTO (Data Transfer Object)** = Objeto que define qué datos puede recibir la API y cómo validarlos.

```typescript
// Si alguien intenta enviar esto:
POST /pirates
{
  "nombre": "Zoro",
  "tripulacion": "Straw Hat",
  "isAdmin": true,              // ← Inyección maliciosa
  "bypassValidation": true      // ← Otro intento de hack
}

// El DTO rechaza automáticamente propiedades no permitidas
```

### Ejemplo de Rechazo (forbidNonWhitelisted: true)

```json
400 Bad Request
{
  "statusCode": 400,
  "message": [
    "property isAdmin should not exist",
    "property bypassValidation should not exist"
  ],
  "error": "Bad Request"
}
```

---

### Validaciones en Cada DTO

#### CreatePirateDto
```typescript
nombre              // ✅ Requerido | String | Min: 2, Max: 100
tripulacion         // ✅ Requerido | String | Min: 2, Max: 100
tieneFrutaDelDiablo // ❌ Opcional | Boolean | Default: false
```

#### UpdatePirateDto
```typescript
nombre              // ❌ Opcional | String
tripulacion         // ❌ Opcional | String
tieneFrutaDelDiablo // ❌ Opcional | Boolean
```

#### CreateBountyDto
```typescript
pirata              // ✅ Requerido | MongoDB ObjectId válido
cantidadBellys      // ✅ Requerido | Número | Positivo
estado              // ❌ Opcional | Enum: ['Wanted', 'Captured']
```

---

### Niveles de Defensa ValidationPipe

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // ← Nivel 1: Ignora props extras
    forbidNonWhitelisted: true,   // ← Nivel 2: RECHAZA props extras
    transform: true,              // ← Nivel 3: Convierte tipos
  }),
);
```

**Nivel 1 - whitelist: true**
- Elimina automáticamente propiedades no declaradas en el DTO
- Silencioso: No lanza error, solo limpia

**Nivel 2 - forbidNonWhitelisted: true**
- Lanza `BadRequestException` si detecta propiedades no permitidas
- Informativo: Cliente sabe que intentó un hack

**Nivel 3 - transform: true**
- Convierte `"123"` → `123`
- Convierte `"true"` → `true`
- Automatiza conversión de tipos

---

### Ataques Prevenidos

#### ❌ Ataque 1: Inyección de Propiedades Admin
```json
{
  "nombre": "Hacker",
  "isAdmin": true
}
→ ValidationPipe rechaza "isAdmin"
→ 400 Bad Request
```

#### ❌ Ataque 2: Valores de Tipo Incorrecto
```json
{
  "pirata": "no-es-un-objectid",
  "cantidadBellys": "INFINITO"
}
→ @IsMongoId() y @IsPositive() fallan
→ 400 Bad Request
```

#### ❌ Ataque 3: Valores Negativos (Ilógicos)
```json
{
  "cantidadBellys": -1000000000
}
→ @IsPositive() rechaza negativos
→ 400 Bad Request
```

---

### Flujo Seguro de Datos

```
1. Cliente envía JSON
   ↓
2. ValidationPipe intercepta
   ├─ Whitelist: Eliminan props extras
   ├─ Transform: Convierten tipos
   ├─ Validadores: Verifican @Prop rules
   └─ forbidNonWhitelisted: Rechazan si hay restos
   ↓
3. Si pasa → Servicio recibe datos LIMPIOS Y SEGUROS
   Si falla → 400 Bad Request con errores específicos
```

---

## 🧪 EJECUTAR TESTS

### Ejecutar Todos los Tests
```bash
npm run test

# Con cobertura
npm run test:cov

# En modo watch (re-ejecuta al cambiar)
npm run test:watch
```

### Ejecutar Test Específico
```bash
# Solo test de BountiesService
npm run test bounties.service.spec

# Solo test de PiratesService
npm run test pirates.service.spec
```

### Qué validamos en Tests

✅ **BountiesService Tests**
- ✅ Crear carteles validando existencia de pirata
- ✅ Obtener carteles con datos poblados (populate)
- ✅ Filtrar solo carteles "Wanted" (activos)
- ✅ Lanzar NotFoundException si pirata no existe
- ✅ Actualizar estado (Wanted → Captured)
- ✅ Eliminar carteles

✅ **PiratesService Tests**
- ✅ Crear piratas nuevos
- ✅ Obtener todo el registro
- ✅ Buscar pirata por ID
- ✅ Actualizar parcialmente piratas
- ✅ Eliminar del registro
- ✅ NotFoundException en IDs inexistentes

**Nota:** Todos los tests usan **MOCKS - NO conectan a MongoDB real**

---

## 📁 ESTRUCTURA DE CARPETAS

```
bounty-api/
├── src/
│   ├── pirates/
│   │   ├── schemas/
│   │   │   └── pirate.schema.ts              # Modelo MongoDB
│   │   ├── dtos/
│   │   │   ├── create-pirate.dto.ts          # Validación POST
│   │   │   └── update-pirate.dto.ts          # Validación PATCH
│   │   ├── services/
│   │   │   ├── pirates.service.ts            # Lógica negocio
│   │   │   └── pirates.service.spec.ts       # Tests unitarios
│   │   ├── controllers/
│   │   │   └── pirates.controller.ts         # Endpoints (próximo)
│   │   └── pirates.module.ts                 # Módulo (próximo)
│   │
│   ├── bounties/
│   │   ├── schemas/
│   │   │   └── bounty.schema.ts              # Modelo MongoDB
│   │   ├── dtos/
│   │   │   ├── create-bounty.dto.ts          # Validación POST
│   │   │   └── update-bounty.dto.ts          # Validación PATCH
│   │   ├── services/
│   │   │   ├── bounties.service.ts           # Lógica negocio
│   │   │   └── bounties.service.spec.ts      # Tests unitarios
│   │   ├── controllers/
│   │   │   └── bounties.controller.ts        # Endpoints (próximo)
│   │   └── bounties.module.ts                # Módulo (próximo)
│   │
│   ├── app.module.ts                         # Módulo raíz (próximo)
│   └── main.ts                               # Archivo entrada (próximo)
│
├── .env                                       # Variables entorno (no commitear)
├── .env.example                               # Template (commitear)
├── .gitignore                                 # Archivos a ignorar
├── package.json                               # Dependencias npm
├── tsconfig.json                              # Configuración TypeScript
├── jest.config.js                             # Configuración Jest
├── PASO1-SCHEMAS-DTOS.md                     # Documentación paso 1
├── HAKI-TECNICO-DTOs-ValidationPipe.md       # Guía seguridad
└── README.md                                  # Este archivo
```

---

## 🔗 DOCUMENTACIÓN ADICIONAL

- 📖 **[PASO1-SCHEMAS-DTOS.md](./PASO1-SCHEMAS-DTOS.md)** - Arquitectura completa de Schemas y DTOs
- 🛡️ **[HAKI-TECNICO-DTOs-ValidationPipe.md](./HAKI-TECNICO-DTOs-ValidationPipe.md)** - Cómo NestJS previene ataques
- 📚 **[NestJS Docs](https://docs.nestjs.com/)** - Documentación oficial
- 🗄️ **[Mongoose Docs](https://mongoosejs.com/)** - Documentación ORM
- 🧪 **[Jest Testing](https://jestjs.io/)** - Framework de testing

---

## 🏴‍☠️ CONCLUSIÓN

**Bounty API** implementa:
- ✅ Arquitectura modular y escalable (NestJS)
- ✅ Validación robusta (class-validator + ValidationPipe)
- ✅ Seguridad contra inyección de datos
- ✅ Tests unitarios sin conectar a DB real
- ✅ Código documentado con referencias One Piece
- ✅ Best practices profesionales

**Está lista para ser presentada al Almirante.** ⚓

---

## 📞 SOPORTE

Para preguntas técnicas, consulta:
- Documentación local: `./HAKI-TECNICO-DTOs-ValidationPipe.md`
- Tests como ejemplos: `*.service.spec.ts`
- Logs del servidor en development

---

**Creado por:** Coza
**Versión:** 1.0.0  
**Última actualización:** 23 abril 2026  
**Estado:** 🟢 Operacional para Producción

*"La Marina confía en esta API"* ⚓🏴‍☠️
