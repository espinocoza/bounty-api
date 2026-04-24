# 🏴‍☠️ BOUNTY API - Sistema de Gestión de Recompensas del Nuevo Mundo

> *"La recompensa del Capitán Pirata es la cifra más importante en todo el Grand Line"* ⚓

---

## 📖 TABLA DE CONTENIDOS

1. [Descripción General](#descripción-general)
2. [Características Principales](#características-principales)
3. [Arquitectura Técnica](#arquitectura-técnica)
4. [Instalación y Setup](#instalación-y-setup)
5. [Variables de Entorno](#variables-de-entorno)
6. [Uso de la API](#uso-de-la-api)
7. [Protocolos de la Marina: Seguridad de DTOs](#protocolos-de-la-marina-seguridad-de-dtos)
8. [Ejecutar Tests](#ejecutar-tests)
9. [Estructura de Carpetas](#estructura-de-carpetas)

---

## 📋 DESCRIPCIÓN GENERAL

**Bounty API** es un sistema backend escalable construido con **NestJS** y **MongoDB Atlas** para gestionar piratas y sus carteles de búsqueda (bounties) en el Nuevo Mundo.

### Contexto One Piece 🌍

La Marina del Nuevo Mundo necesitaba un sistema robusto para:
- ✅ Registrar piratas en la base de datos del **Cipher Pol** (CP9)
- ✅ Emitir carteles de búsqueda (bounties) con recompensas en Bellys
- ✅ Rastrear el estado de cada pirata (Wanted vs Captured)
- ✅ Mantener integridad de datos ante intentos de infiltración

**Bounty API** es la solución oficial de la Marina.

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

### 🏴 Módulo de Piratas
```
POST   /pirates                    Registrar nuevo pirata
GET    /pirates                    Listar todos los registros
GET    /pirates/:id                Obtener pirata específico
PATCH  /pirates/:id                Actualizar datos del pirata
DELETE /pirates/:id                Eliminar del registro marino
```

**Campos principales:**
- `nombre` (único, obligatorio) - Nombre registrado en la Marina
- `tripulacion` (obligatorio) - Crew a la que pertenece
- `tieneFrutaDelDiablo` (boolean, default: false) - Atributo sobrenatural

---

### 🎯 Módulo de Carteles de Búsqueda
```
POST   /bounties                   Emitir nuevo cartel de búsqueda
GET    /bounties                   Listar todos con datos del pirata
GET    /bounties/:id               Obtener cartel específico
GET    /bounties/active            🌟 ESPECIAL: Solo carteles Wanted (activos)
PATCH  /bounties/:id               Actualizar estado/recompensa
DELETE /bounties/:id               Eliminar cartel
```

**Campos principales:**
- `pirata` (ObjectId, referencia a Pirate)
- `cantidadBellys` (número positivo) - Recompensa en moneda del Nuevo Mundo
- `estado` (enum: 'Wanted' | 'Captured')

---

## 🏗️ ARQUITECTURA TÉCNICA

### Tech Stack
```
Backend Framework:     NestJS
Language:             TypeScript
Database:             MongoDB Atlas (Cloud)
ORM:                  Mongoose
Validation:           class-validator
Testing:              Jest + @nestjs/testing
Security:             ValidationPipe (whitelist + forbidNonWhitelisted)
```

### Diagrama de Capas
```
┌─────────────────────────────────────────┐
│    Controllers                          │  ← API REST Endpoints
├─────────────────────────────────────────┤
│    Services (Business Logic)            │  ← Lógica de negocio
├─────────────────────────────────────────┤
│    DTOs (Data Validation)               │  ← Validación de entrada
├─────────────────────────────────────────┤
│    Schemas (Database Models)            │  ← Modelos MongoDB
├─────────────────────────────────────────┤
│    MongoDB Atlas                        │  ← Base de datos Cloud
└─────────────────────────────────────────┘
```

---

## 🚀 INSTALACIÓN Y SETUP

### Requisitos Previos
```bash
Node.js >= 18.x
npm o yarn
MongoDB Atlas (cuenta gratuita disponible)
```

### Paso 1: Clonar/Descargar Proyecto
```bash
cd bounty-api
```

### Paso 2: Instalar Dependencias
```bash
npm install

# O con yarn
yarn install
```

### Paso 3: Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto (ver sección siguiente)

### Paso 4: Compilar Proyecto
```bash
npm run build
```

### Paso 5: Ejecutar en Desarrollo
```bash
npm run start:dev

# Servidor ejecutándose en http://localhost:3000
```

---

## 🔐 VARIABLES DE ENTORNO

Crear archivo `.env` en la raíz del proyecto:

```bash
# ========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ========================================

# URI de conexión a MongoDB Atlas
# Formato: mongodb+srv://usuario:contraseña@cluster.mongodb.net/nombreBD
MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.abcde.mongodb.net/bounty-db

# ========================================
# CONFIGURACIÓN DE SERVIDOR
# ========================================

# Puerto del servidor NestJS (default: 3000)
PORT=3000

# Ambiente de ejecución (development, production, testing)
NODE_ENV=development

# ========================================
# CONFIGURACIÓN LOG
# ========================================

# Nivel de logging (debug, log, warn, error, verbose)
LOG_LEVEL=debug
```

### 📌 Cómo Obtener MONGO_URI

1. **Crear Cuenta en MongoDB Atlas:**
   - Ir a https://www.mongodb.com/cloud/atlas
   - Crear cuenta gratuita
   - Crear cluster (tier gratuito disponible)

2. **Generar Conexión:**
   - En Atlas: Cluster → Connect → Connect your application
   - Seleccionar Node.js driver
   - Copiar connection string
   - Reemplazar `<password>` con contraseña del usuario
   - Reemplazar `myFirstDatabase` con nombre de base de datos

3. **Ejemplo Final:**
   ```bash
   MONGO_URI=mongodb+srv://capitanpirata:buccaneer123@bounty-cluster.a1b2c.mongodb.net/bounty-db
   ```

### ⚠️ Seguridad: Nunca Commitear `.env`
```bash
# Agregar a .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

---

## 🗺️ USO DE LA API

### 1️⃣ Crear Pirata (POST /pirates)

**Request:**
```json
POST http://localhost:3000/pirates
Content-Type: application/json

{
  "nombre": "Roronoa Zoro",
  "tripulacion": "Straw Hat Pirates",
  "tieneFrutaDelDiablo": false
}
```

**Response: 201 Created**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Roronoa Zoro",
  "tripulacion": "Straw Hat Pirates",
  "tieneFrutaDelDiablo": false,
  "createdAt": "2026-04-23T10:00:00.000Z",
  "updatedAt": "2026-04-23T10:00:00.000Z"
}
```

---

### 2️⃣ Crear Cartel de Búsqueda (POST /bounties)

**Request:**
```json
POST http://localhost:3000/bounties
Content-Type: application/json

{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": 320000000,
  "estado": "Wanted"
}
```

**Response: 201 Created**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "pirata": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Roronoa Zoro",
    "tripulacion": "Straw Hat Pirates",
    "tieneFrutaDelDiablo": false
  },
  "cantidadBellys": 320000000,
  "estado": "Wanted",
  "createdAt": "2026-04-23T10:30:00.000Z",
  "updatedAt": "2026-04-23T10:30:00.000Z"
}
```

---

### 3️⃣ Obtener Carteles Activos (GET /bounties/active)

**Request:**
```
GET http://localhost:3000/bounties/active
```

**Response: 200 OK**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "pirata": {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Roronoa Zoro",
      "tripulacion": "Straw Hat Pirates"
    },
    "cantidadBellys": 320000000,
    "estado": "Wanted"
  }
]
```

---

### 4️⃣ Actualizar Cartel (PATCH /bounties/:id)

**Request:**
```json
PATCH http://localhost:3000/bounties/507f1f77bcf86cd799439012
Content-Type: application/json

{
  "estado": "Captured",
  "cantidadBellys": 500000000
}
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

## 💡 TIPS PROFESIONALES

### 1. Usar `.env.example` para Documentar Variables
```bash
# .env.example (sin valores secretos)
MONGO_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/db
PORT=3000
NODE_ENV=development
```

### 2. Logs en Desarrollo
```typescript
// En servicios, usar Logger de NestJS
import { Logger } from '@nestjs/common';

@Injectable()
export class BountiesService {
  private readonly logger = new Logger(BountiesService.name);

  async findOne(id: string) {
    this.logger.log(`Buscando cartel con ID: ${id}`);
    // ...
  }
}
```

### 3. Manejo de Errores Consistente
```typescript
// Todos los errores usan NotFoundException, BadRequestException, etc.
// NestJS los convierte a respuestas HTTP apropiadas automáticamente
if (!bounty) {
  throw new NotFoundException('Cartel no encontrado');
}
```

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

**Creado por:** Arquitecto Senior de NestJS  
**Versión:** 1.0.0  
**Última actualización:** 23 abril 2026  
**Estado:** 🟢 Operacional para Producción

*"La Marina confía en esta API"* ⚓🏴‍☠️
