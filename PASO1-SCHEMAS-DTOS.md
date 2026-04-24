# 🏴‍☠️ BOUNTY API - Paso 1: Arquitectura de Schemas y DTOs

## Comandante de la Marina ⚓ - Estado Arquitectónico Actual

Estableceremos curso hacia una arquitectura modular y limpia. A continuación, la estructura COMPLETAMENTE FUNCIONAL del **Paso 1**.

---

## 📊 DIAGRAMA DE ARQUITECTURA

```
BOUNTY API - Nuevo Mundo
│
├── 🏴 PIRATES MODULE
│   ├── Pirate Schema
│   │   ├── nombre (unique string, validated)
│   │   ├── tripulacion (string)
│   │   ├── tieneFrutaDelDiablo (boolean, default false)
│   │   └── timestamps (createdAt, updatedAt)
│   │
│   └── DTOs
│       ├── CreatePirateDto (todas las props requeridas)
│       └── UpdatePirateDto (todas las props opcionales)
│
├── 🎯 BOUNTIES MODULE
│   ├── Bounty Schema
│   │   ├── pirata (ObjectId -> Pirate ref)
│   │   ├── cantidadBellys (positive integer)
│   │   ├── estado (enum: 'Wanted' | 'Captured')
│   │   └── timestamps (createdAt, updatedAt)
│   │
│   └── DTOs
│       ├── CreateBountyDto
│       ├── UpdateBountyDto
│       └── BountyStatus (WANTED, CAPTURED)
│
└── VALIDACIÓN GLOBAL
    └── ValidationPipe (whitelist, forbidNonWhitelisted)
```

---

## 🔧 ESTRUCTURA DE ARCHIVOS - PASO 1

```
bounty-api/
│
├── src/
│   ├── pirates/
│   │   ├── schemas/
│   │   │   └── pirate.schema.ts ✅ LISTO
│   │   └── dtos/
│   │       ├── create-pirate.dto.ts ✅ LISTO
│   │       └── update-pirate.dto.ts ✅ LISTO
│   │
│   ├── bounties/
│   │   ├── schemas/
│   │   │   └── bounty.schema.ts ✅ LISTO
│   │   └── dtos/
│   │       ├── create-bounty.dto.ts ✅ LISTO
│   │       └── update-bounty.dto.ts ✅ LISTO
│   │
│   └── [Próximo: Services, Controllers, Modules en Paso 2]
│
└── README-PASO1.md (este archivo)
```

---

## 📋 SCHEMA: PIRATE (Pirata)

### Decorador Base
```typescript
@Schema({ timestamps: true, collection: 'pirates' })
export class Pirate extends Document
```

### Propiedades

| Campo | Tipo | Validaciones | Ejemplo | Notas CP9 |
|-------|------|-------------|---------|-----------|
| **nombre** | `string` | unique, min: 2, max: 100, pattern regex | "Roronoa Zoro" | Registrado en CP9 Database |
| **tripulacion** | `string` | min: 2, max: 100, pattern regex | "Straw Hat Pirates" | Identificación de crew |
| **tieneFrutaDelDiablo** | `boolean` | default: false | true/false | 🌀 Poder sobrenatural |
| **createdAt** | `Date` | auto (timestamps) | 2026-04-23 | Registro en Marina |
| **updatedAt** | `Date` | auto (timestamps) | 2026-04-23 | Última actualización |

### Índices Optimizados
```typescript
PirateSchema.index({ nombre: 1 });           // Búsqueda por nombre
PirateSchema.index({ tripulacion: 1 });      // Búsqueda por tripulación
```

---

## 📋 SCHEMA: BOUNTY (Cartel de Búsqueda)

### Decorador Base
```typescript
@Schema({ timestamps: true, collection: 'bounties' })
export class Bounty extends Document
```

### Propiedades

| Campo | Tipo | Validaciones | Ejemplo | Notas Marina |
|-------|------|-------------|---------|-------------|
| **pirata** | `ObjectId` | ref: 'Pirate', required | "507f1f77bcf86cd799439011" | Foreign Key a Pirates |
| **cantidadBellys** | `number` | positive, integer, min: 1 | 1500000000 | Recompensa en Bellys |
| **estado** | `BountyStatus` | enum: ['Wanted', 'Captured'] | "Wanted" | Estado del cartel |
| **createdAt** | `Date` | auto (timestamps) | 2026-04-23 | Emisión del cartel |
| **updatedAt** | `Date` | auto (timestamps) | 2026-04-23 | Última actualización |

### Enum: BountyStatus
```typescript
enum BountyStatus {
  WANTED = 'Wanted',      // Búsqueda activa
  CAPTURED = 'Captured',  // Capturado (histórico)
}
```

### Índices Optimizados
```typescript
BountySchema.index({ pirata: 1 });                // Búsqueda por pirata
BountySchema.index({ estado: 1 });               // Filtro por estado
BountySchema.index({ cantidadBellys: -1 });      // Top bounties
BountySchema.index({ pirata: 1, estado: 1 });    // Query compuesta frecuente
```

---

## 📝 DTO: CREATE-PIRATE-DTO

### Propósito
Validar datos de ENTRADA para crear nuevos piratas.

### Propiedades (REQUERIDAS)

```typescript
export class CreatePirateDto {
  
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-\.]+$/)
  nombre: string;           // ✅ REQUERIDO

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-\.]+$/)
  tripulacion: string;      // ✅ REQUERIDO

  @IsBoolean()
  tieneFrutaDelDiablo?: boolean = false;  // ❌ OPCIONAL (default: false)
}
```

### Validaciones Aplicadas
- ✅ `@IsNotEmpty()` - No puede estar vacío
- ✅ `@IsString()` - Debe ser texto
- ✅ `@MinLength(2)` - Mínimo 2 caracteres
- ✅ `@MaxLength(100)` - Máximo 100 caracteres
- ✅ `@Matches(regex)` - Solo letras, números, espacios, guiones

### Ejemplo de Payload Válido
```json
{
  "nombre": "Roronoa Zoro",
  "tripulacion": "Straw Hat Pirates",
  "tieneFrutaDelDiablo": false
}
```

### Ejemplo de Payload INVÁLIDO
```json
{
  "nombre": "Z",                    // ❌ Menos de 2 caracteres
  "tripulacion": "Straw Hat Pirates"
}

{
  "nombre": "Roronoa Zoro",
  "tripulacion": "Straw Hat Pirates",
  "edad": 21                        // ❌ Propiedad NO PERMITIDA (forbidNonWhitelisted)
}
```

---

## 📝 DTO: UPDATE-PIRATE-DTO

### Propósito
Validar actualización PARCIAL de piratas existentes.

### Propiedades (TODAS OPCIONALES)

```typescript
export class UpdatePirateDto {
  
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-\.]+$/)
  nombre?: string;          // ❌ OPCIONAL

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-\.]+$/)
  tripulacion?: string;     // ❌ OPCIONAL

  @IsOptional()
  @IsBoolean()
  tieneFrutaDelDiablo?: boolean;  // ❌ OPCIONAL
}
```

### Diferencia Crítica con CreatePirateDto
| Aspecto | CreatePirateDto | UpdatePirateDto |
|--------|-----------------|-----------------|
| Nombres requeridos | ✅ SÍ | ❌ NO |
| Tripulación requerida | ✅ SÍ | ❌ NO |
| Puede actualizar parcialmente | ❌ NO | ✅ SÍ |
| Caso de uso | POST /pirates | PATCH /pirates/:id |

### Ejemplo de UPDATE Válido
```json
{
  "tieneFrutaDelDiablo": true
}
```
Solo actualiza si tiene Fruta del Diablo, deja nombre y tripulación intactos.

---

## 📝 DTO: CREATE-BOUNTY-DTO

### Propósito
Validar datos de ENTRADA para crear nuevos carteles de búsqueda.

### Propiedades

```typescript
export class CreateBountyDto {
  
  @IsNotEmpty()
  @IsMongoId()
  pirata: string;           // ✅ REQUERIDO - ObjectId válido

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidadBellys: number;   // ✅ REQUERIDO - Positivo, entero

  @IsOptional()
  @IsEnum(BountyStatus)
  estado?: BountyStatus = BountyStatus.WANTED;  // ❌ OPCIONAL (default: 'Wanted')
}
```

### Validaciones Aplicadas
- ✅ `@IsNotEmpty()` - No puede estar vacío
- ✅ `@IsMongoId()` - ObjectId válido de MongoDB
- ✅ `@IsNumber()` - Debe ser número válido (no NaN)
- ✅ `@IsPositive()` - Mínimo 1 Belly
- ✅ `@IsEnum()` - Solo 'Wanted' o 'Captured'

### Ejemplo de Payload Válido
```json
{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": 1500000000,
  "estado": "Wanted"
}
```

### Ejemplo de Payload INVÁLIDO
```json
{
  "pirata": "invalid-id",           // ❌ No es ObjectId válido
  "cantidadBellys": 1500000000
}

{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": -100,           // ❌ Número negativo (no es positivo)
  "estado": "Wanted"
}

{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": 1500000000.50,  // ❌ Decimal (debe ser entero)
  "estado": "Imprisoned"            // ❌ Estado no válido
}
```

---

## 📝 DTO: UPDATE-BOUNTY-DTO

### Propósito
Validar actualización PARCIAL de carteles de búsqueda.

### Propiedades (TODAS OPCIONALES)

```typescript
export class UpdateBountyDto {
  
  @IsOptional()
  @IsMongoId()
  pirata?: string;          // ❌ OPCIONAL

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cantidadBellys?: number;  // ❌ OPCIONAL

  @IsOptional()
  @IsEnum(BountyStatus)
  estado?: BountyStatus;    // ❌ OPCIONAL
}
```

### Casos de Uso

| Caso | Payload | Resultado |
|------|---------|-----------|
| Cambiar estado a capturado | `{ "estado": "Captured" }` | ✅ Solo actualiza estado |
| Aumentar recompensa | `{ "cantidadBellys": 3000000000 }` | ✅ Solo actualiza Bellys |
| Capturar y aumentar | `{ "estado": "Captured", "cantidadBellys": 2000000000 }` | ✅ Ambos campos |

---

## ⚙️ VALIDACIÓN GLOBAL - main.ts (PRÓXIMO PASO)

La configuración de ValidationPipe global será:

```typescript
// main.ts (Próximo Paso)
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Ignora propiedades no declaradas
    forbidNonWhitelisted: true,   // Lanza error si hay props no permitidas
    transform: true,              // Transforma a tipos correctos
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

**Impacto:**
- ❌ Rechaza `{ "edad": 25 }` si no está en el DTO
- ✅ Acepta solo propiedades definidas en CreatePirateDto, UpdatePirateDto, etc.

---

## 🔐 RELACIONES Y REFERENCIAS

### Relación: Pirate ↔ Bounty

```
Pirate (1) ──────────────── (N) Bounty
│                                │
├─ nombre: "Roronoa Zoro"       ├─ cantidadBellys: 320,000,000
├─ tripulacion: "SHP"          ├─ estado: "Wanted"
└─ tieneFrutaDelDiablo: false  └─ pirata: ObjectId(pirate._id)
```

### Población de Referencias (Población Strategy)

En servicios de Bounty, cuando hagamos queries:

```typescript
// ❌ SIN populate - solo ObjectId
const bounties = await this.bountyModel.find();
// Resultado:
// { pirata: ObjectId(...), cantidadBellys: 320000000 }

// ✅ CON populate - datos completos del pirata
const bounties = await this.bountyModel
  .find()
  .populate('pirata');
// Resultado:
// { 
//   pirata: { 
//     _id: ObjectId(...),
//     nombre: "Roronoa Zoro",
//     tripulacion: "SHP",
//     tieneFrutaDelDiablo: false
//   },
//   cantidadBellys: 320000000 
// }
```

---

## 📌 RESUMEN - PASO 1 COMPLETADO

✅ **Schemas creados con decoradores @Schema() y @Prop()**
- Pirate.schema.ts - Base de datos de la Marina
- Bounty.schema.ts - Carteles de búsqueda

✅ **DTOs validados con class-validator**
- CreatePirateDto - Crear new pirata (required)
- UpdatePirateDto - Actualizar pirata (optional)
- CreateBountyDto - Crear nuevo cartel (required)
- UpdateBountyDto - Actualizar cartel (optional)

✅ **Enums y tipos definidos**
- BountyStatus (WANTED, CAPTURED)

✅ **Índices de optimización**
- Búsquedas rápidas por nombre, tripulación, estado

✅ **Arquitectura de validación preparada**
- whitelist: true
- forbidNonWhitelisted: true

---

## 🚀 PRÓXIMOS PASOS (Paso 2, 3, 4...)

- [ ] **Paso 2**: Servicios (PiratesService, BountiesService)
- [ ] **Paso 3**: Controladores (PiratesController, BountiesController)
- [ ] **Paso 4**: Módulos (PiratesModule, BountiesModule, AppModule)
- [ ] **Paso 5**: Endpoint especial GET /bounties/active
- [ ] **Paso 6**: Configuración main.ts + ValidationPipe global
- [ ] **Paso 7**: Tests con Jest
- [ ] **Paso 8**: Conectar a MongoDB Atlas

---

**Capitán del Proyecto** ⚓
*Arquitectura establecida. Esperando órdenes para el Paso 2...*
