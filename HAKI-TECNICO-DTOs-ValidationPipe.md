# 🏴‍☠️ HAKI TÉCNICO: El Arte de la Defensa en DTOs y Validación

**Explicación Experta: Por qué `PartialType` + `ValidationPipe` = Fortaleza Impenetrable**

---

## 📚 TABLA DE CONTENIDOS

1. [¿Qué es `PartialType` y por qué lo usamos?](#partialtype)
2. [Diferencia entre `CreateBountyDto` y `UpdateBountyDto`](#diferencias)
3. [El `ValidationPipe` Global: Guardián de la Integridad](#validationpipe)
4. [Ataques que EVITAMOS con esta arquitectura](#ataques-evitados)
5. [Flujo completo de validación](#flujo-validacion)

---

## <a name="partialtype"></a>1. ¿QUÉ ES `PartialType` Y POR QUÉ LO USAMOS?

### 📋 Concepto Base

`PartialType` es una utilidad de NestJS que **convierte TODAS las propiedades obligatorias en OPCIONALES**.

```typescript
// Sin PartialType
export class CreateBountyDto {
  @IsNotEmpty()
  @IsMongoId()
  pirata: string;              // ✅ REQUERIDO
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidadBellys: number;      // ✅ REQUERIDO
}

// Con PartialType (UpdateBountyDto)
export class UpdateBountyDto extends PartialType(CreateBountyDto) {
  // Automáticamente:
  // @IsOptional()
  // @IsMongoId()
  // pirata?: string;           // ❌ OPCIONAL

  // @IsOptional()
  // @IsNumber()
  // @IsPositive()
  // cantidadBellys?: number;   // ❌ OPCIONAL
}
```

### ¿Por qué `PartialType` y no copiar propiedades manualmente?

| Aspecto | Copiar Manual | PartialType |
|--------|---------------|------------|
| **Repetición de código** | ❌ 3x más lineas | ✅ Una línea |
| **Sincronización** | ❌ Si cambias CreateBountyDto, UpdateBountyDto se desincroniza | ✅ Cambios automáticos |
| **Mantenibilidad** | ❌ Bug-prone | ✅ Single source of truth |
| **Ejemplo** | 50 líneas de DTOs | 10 líneas |

**Analogía One Piece:**
- `CreateBountyDto` = Plan inicial de la Marina para emitir cartel
- `UpdateBountyDto` = Actualización parcial del cartel (puede cambiar solo estado, o solo Bellys)
- `PartialType` = El Haki del Almirante que ve ambos casos sin escribir dos veces la lógica

---

## <a name="diferencias"></a>2. DIFERENCIA ENTRE `CreateBountyDto` Y `UpdateBountyDto`

### Tabla Comparativa

```typescript
// ========================================
// CREATE-BOUNTY-DTO - Crear nuevo cartel
// ========================================
export class CreateBountyDto {
  @IsNotEmpty()
  @IsMongoId()
  pirata: string;                    // ✔️ REQUERIDO - Necesitamos saber a quién buscar

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidadBellys: number;            // ✔️ REQUERIDO - Monto de recompensa obligatorio

  @IsOptional()
  @IsEnum(BountyStatus)
  estado?: BountyStatus =            // ❌ OPCIONAL - Default 'Wanted'
    BountyStatus.WANTED;
}

// POST /bounties
// {
//   "pirata": "507f...",           ✅ DEBE estar
//   "cantidadBellys": 320000000,   ✅ DEBE estar
//   "estado": "Wanted"             ❌ Opcional, se asigna automáticamente
// }
```

```typescript
// ========================================
// UPDATE-BOUNTY-DTO - Actualizar cartel
// ========================================
export class UpdateBountyDto {
  @IsOptional()
  @IsMongoId()
  pirata?: string;                   // ❌ OPCIONAL - Transferir cartel (caso raro)

  @IsOptional()
  @IsNumber()
  @IsPositive()
  cantidadBellys?: number;           // ❌ OPCIONAL - Aumentar recompensa

  @IsOptional()
  @IsEnum(BountyStatus)
  estado?: BountyStatus;             // ❌ OPCIONAL - Cambiar a 'Captured'
}

// PATCH /bounties/:id
// Validado payload 1:
// {
//   "estado": "Captured"           ✅ VÁLIDO - Solo modifica estado
// }

// Validado payload 2:
// {
//   "cantidadBellys": 500000000    ✅ VÁLIDO - Solo modifica monto
// }

// Validado payload 3:
// {
//   "cantidadBellys": 1000000000,
//   "estado": "Captured"           ✅ VÁLIDO - Modifica ambos
// }
```

### Casos de Uso Reales

**Caso 1: Crear Bounty - POST /bounties**
```json
✅ VÁLIDO
{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": 1500000000
}

❌ INVÁLIDO - Falta pirata
{
  "cantidadBellys": 1500000000
}

❌ INVÁLIDO - Falta cantidadBellys
{
  "pirata": "507f1f77bcf86cd799439011"
}
```

**Caso 2: Actualizar Bounty - PATCH /bounties/:id**
```json
✅ VÁLIDO - Solo cambiar estado
{
  "estado": "Captured"
}

✅ VÁLIDO - Solo aumentar recompensa
{
  "cantidadBellys": 2000000000
}

✅ VÁLIDO - Ambos cambios
{
  "cantidadBellys": 2000000000,
  "estado": "Captured"
}

✅ VÁLIDO - Payload vacío (nada que actualizar)
{}

❌ INVÁLIDO - Propiedad no permitida (forbidNonWhitelisted: true)
{
  "cantidadBellys": 2000000000,
  "cantidadTriplettes": 5000    // ← ATAQUE: Campo falso inyectado
}
```

---

## <a name="validationpipe"></a>3. EL `ValidationPipe` GLOBAL: GUARDIÁN DE LA INTEGRIDAD

### 🛡️ Configuración en `main.ts`

```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⚔️ CONFIGURACIÓN CRÍTICA - Validación Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // 🛡️ NIVEL 1: Ignora propiedades extras
      forbidNonWhitelisted: true,   // 🛡️ NIVEL 2: RECHAZA propiedades extras
      transform: true,              // 🛡️ NIVEL 3: Transforma tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(3000);
}

bootstrap();
```

### 🔐 Explicación de Cada Setting

| Setting | Propósito | Ejemplo |
|---------|-----------|---------|
| **whitelist: true** | Ignora silenciosamente props no declaradas | `{ nombre: "Zoro", edad: 99 }` → `{ nombre: "Zoro" }` |
| **forbidNonWhitelisted: true** | LANZA ERROR si hay props no declaradas | `{ nombre: "Zoro", edad: 99 }` → ❌ BadRequestException |
| **transform: true** | Convierte string a número, boolean, etc. | `"123"` → `123` |
| **enableImplicitConversion** | Conversión implícita automática | `"true"` → `true` |

### 📊 Niveles de Defensa

```
┌─────────────────────────────────────────────────────────────┐
│  ATAQUE: Cliente envía { cantidadBellys: 500000000, edad: 99 }
└─────────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────────┐
│ NIVEL 1 - whitelist: true
│ ✅ Acepta cantidadBellys (está en DTO)
│ ⚠️ Ignora edad (no está en DTO)
│ → { cantidadBellys: 500000000 }
└─────────────────────────────────────────────────────────────┘
                            ⬇️
✅ SI forbidNonWhitelisted: false
│ → Continúa validación, edad siendo ignorada
│
❌ SI forbidNonWhitelisted: true
│ → BadRequestException: "property edad should not exist"
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo Real de Ataque Bloqueado

**Escenario:** Espía del ejército revolucionario intenta inyectar `isAdmin: true`

```typescript
// ❌ ATAQUE INTENTADO
POST /bounties
{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": 320000000,
  "isAdmin": true,              // ← INYECCIÓN MALICIOSA
  "bypass": true                // ← MÁS INTENTOS DE INYECCIÓN
}

// ✅ ValidationPipe RECHAZA
{
  "statusCode": 400,
  "message": [
    "property isAdmin should not exist",
    "property bypass should not exist"
  ],
  "error": "Bad Request"
}

// Resultado: El servicio NUNCA recibe isAdmin ni bypass
// La integridad de datos está garantizada
```

---

## <a name="ataques-evitados"></a>4. ATAQUES QUE EVITAMOS CON ESTA ARQUITECTURA

### 🚨 Ataque #1: Inyección de Propiedades No Autorizadas

```typescript
// ❌ INTENTO DE ATAQUE
{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": 320000000,
  "isAdmin": true,              // Intenta volverse administrador
  "actualizadoPor": "Hacker"   // Falsifica auditoría
}

// ✅ RESULTADO CON whitelist + forbidNonWhitelisted
// 400 Bad Request - "property isAdmin should not exist"
// El payload es RECHAZADO, NO se procesa
```

### 🚨 Ataque #2: Datos de Tipo Incorrecto

```typescript
// ❌ INTENTO DE ATAQUE
{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": "INFINITO",    // String en lugar de número
  "estado": 123                     // Número en lugar de string
}

// ✅ RESULTADO CON transform: true
// Intenta convertir "INFINITO" a número
// La validación @IsPositive() FALLA
// 400 Bad Request - "cantidadBellys must be a positive number"
```

### 🚨 Ataque #3: Inyección SQL (en contexto de Mongoose)

```typescript
// ❌ INTENTO DE ATAQUE (Common SQL Injection)
{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": { "$gt": 0 }   // MongoDB injection attempt
}

// ✅ RESULTADO CON @IsPositive()
// @IsPositive() valida que sea número
// { "$gt": 0 } no es número positivo válido
// 400 Bad Request - "cantidadBellys must be a positive number"
```

### 🚨 Ataque #4: ObjectId Falsificado

```typescript
// ❌ INTENTO DE ATAQUE
{
  "pirata": "no-es-un-objectid-valido",
  "cantidadBellys": 320000000
}

// ✅ RESULTADO CON @IsMongoId()
// @IsMongoId() valida formato MongoDB ObjectId
// "no-es-un-objectid-valido" no pasa validación
// 400 Bad Request - "pirata must be a MongoDB id"
```

### 🚨 Ataque #5: Valores Negativos o Cero

```typescript
// ❌ INTENTO DE ATAQUE - Recompensa negativa (ilógica)
{
  "pirata": "507f1f77bcf86cd799439011",
  "cantidadBellys": -1000000000   // Negativo = "devolver dinero"
}

// ✅ RESULTADO CON @IsPositive()
// @IsPositive() solo acepta números > 0
// -1000000000 no pasa validación
// 400 Bad Request - "cantidadBellys must be a positive number"
```

---

## <a name="flujo-validacion"></a>5. FLUJO COMPLETO DE VALIDACIÓN

### 🔄 Flujo de un Payload CreateBountyDto

```
1️⃣ CLIENTE ENVÍA REQUEST
   ├─ Payload JSON recibido
   └─ Ejemplo: { "pirata": "507f...", "cantidadBellys": 320000000, "edad": 25 }

2️⃣ PIPES DE VALIDACIÓN (ValidationPipe global)
   ├─ Transform: Convertir strings a tipos correctos
   │  └─ "123" → 123
   ├─ Whitelist: Preparar para validación
   │  └─ Identifica "edad" como no-whitelisted
   ├─ Validadores clase-validator (@IsMongoId, @IsPositive, etc.)
   │  └─ Valida cada @Prop decorador
   └─ forbidNonWhitelisted: ¿Rechazar si hay props no permitidas?
      └─ ✅ SÍ → 400 Bad Request

3️⃣ SI FALLA VALIDACIÓN
   └─ BadRequestException zurra al cliente con lista de errores
      {
        "statusCode": 400,
        "message": [
          "pirata must be a MongoDB id",
          "cantidadBellys must be a positive number",
          "property edad should not exist"
        ],
        "error": "Bad Request"
      }

4️⃣ SI PASA VALIDACIÓN
   └─ Datos LIMPIOS y SEGUROS llegan al servicio
      {
        "pirata": "507f1f77bcf86cd799439011",
        "cantidadBellys": 320000000
        // "edad" y "estado" no llegan (whitelist)
        // "estado" default = "Wanted" (asignado en DTO)
      }

5️⃣ SERVICIO PROCESA DATOS SEGUROS
   └─ BountiesService.create() recibe datos ya validados
      ├─ Verifica que pirata existe en DB
      ├─ Crea documento bounty
      └─ Retorna bounty populated con datos del pirata

6️⃣ CLIENTE RECIBE RESPUESTA
   └─ 201 Created
      {
        "_id": "507f1f77bcf86cd799439012",
        "pirata": { ... datos del pirata populated ... },
        "cantidadBellys": 320000000,
        "estado": "Wanted",
        "createdAt": "2026-04-23T...",
        "updatedAt": "2026-04-23T..."
      }
```

### 📊 Puntos Clave del Flujo

| Paso | Responsable | Validación |
|------|------------|-----------|
| **1. Cliente** | Envía JSON | N/A (cliente puede enviar cualquier cosa) |
| **2. ValidationPipe** | NestJS | Whitelist, Transform, class-validator |
| **3. Decoradores DTO** | @IsMongoId, @IsPositive, etc. | Tipo y rango |
| **4. Servicio** | BountiesService | Lógica de negocio, verificar existencia DB |
| **5. Respuesta** | API | Datos seguros, auditados |

---

## 🎯 RESUMEN: POR QUÉ ESTA ARQUITECTURA ES IMPENETRABLE

### ✅ Protecciones Implementadas

1. **PartialType:**
   - ✅ Evita código repetido
   - ✅ Sincronización automática entre Create y Update
   - ✅ Mantenibilidad garantizada

2. **whitelist: true:**
   - ✅ Ignora propiedades no declaradas silenciosamente
   - ✅ Limpia el payload automaticamente

3. **forbidNonWhitelisted: true:**
   - ✅ RECHAZA payloads con propiedades inyectadas
   - ✅ Informa al cliente que intentó hack

4. **Validadores class-validator:**
   - ✅ @IsMongoId - Evita ObjectIds falsos
   - ✅ @IsPositive - Evita valores negativos
   - ✅ @IsEnum - Evita estados inválidos
   - ✅ @Matches(regex) - Patrón de caracteres válidos

5. **Tipado TypeScript:**
   - ✅ Compile-time safety
   - ✅ IntelliSense en IDEs
   - ✅ Documentación código

### 📈 Impacto en Seguridad

```
SIN ValidationPipe + DTOs
├─ 🚨 Cualquiera puede enviar datos arbitrarios
├─ 🚨 isAdmin, bypass, __proto__ pollution
└─ 💥 Vulnerabilidades críticas

CON ValidationPipe + DTOs (ACTUAL)
├─ ✅ Solo propiedades declaradas
├─ ✅ Tipos validados
├─ ✅ Errores bien formados
└─ 🛡️ Seguridad robusta
```

---

## 🏴‍☠️ ANALOGÍA ONE PIECE FINAL

**Escenario:** El Ejército Revolucionario intenta infiltrar un espía en la Marina

```
SIN DEFENSA (whitelist: false, forbidNonWhitelisted: false)
│
├─ Espía: "Soy un Oficial de la Marina"
├─ Guardia: ✅ "OK, entra"
├─ Espía: "Además, yo soy el Almirante"
├─ Guardia: ✅ "OK, aceptado"
└─ 💥 DESASTRE: El espía está en la Marina

CON DEFENSA (whitelist: true, forbidNonWhitelisted: true)
│
├─ Espía: "Soy un Oficial de la Marina + Almirante + Admin"
├─ Guardia: 🛡️ "ValidationPipe checking..."
│  ├─ ✅ "Oficial de la Marina" - Permitido en DTO
│  ├─ ❌ "Almirante" - NO está en DTO, elimina (whitelist)
│  ├─ ❌ "Admin" - NO está en DTO, RECHAZA (forbidNonWhitelisted)
└─ ❌ RECHAZADO: 400 Bad Request - "Intento de inyección detectado"
```

**Conclusión:** El `ValidationPipe` es como el **Haki del Almirante** - detecta y rechaza cualquier intento de engaño.

---

**Fin del Haki Técnico** ⚓

*"La defensa en capas es la estrategia naval más efectiva"* - Almirante Kuzan
