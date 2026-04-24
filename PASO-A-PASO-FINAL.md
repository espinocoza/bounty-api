# Para ejecutar el proyecto

Estos son los pasos básicos:

## 1. Crea los directorios

```powershell
cd "c:\Users\Coza\Desktop\trabajo final OP\bounty-api"

mkdir src\schemas -Force
mkdir src\dtos -Force
mkdir src\services -Force
mkdir src\controllers -Force
mkdir src\pirates -Force
mkdir src\bounties -Force
```

## 2. Verifica que tengas los archivos anteriores

En src/:
- schemas/ con pirate.schema.ts y bounty.schema.ts
- dtos/ con los 4 DTOs
- services/ con los 2 servicios y sus tests

Si alguno falta, búscalo de la sesión anterior.

## 3. Crea el .env

```powershell
copy .env.example .env
```

Edítalo y pon:

```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/bounty-api-dev
```

Si usas MongoDB Atlas, obtén la connection string de https://cloud.mongodb.com y úsala en MONGO_URI.

## 4. npm install

```powershell
npm install
```

Tarda 2-3 minutos.

## 5. Inicia el servidor

```powershell
npm run start:dev
```

## 6. En otra terminal, ejecuta los tests

```powershell
npm test
```

Debe pasar 70+ tests.

## 7. Prueba que funcione

```powershell
curl http://localhost:3000/health
```

O importa collection.postman.json en Postman.

## 8. Listo

Si todo funciona, entreg la carpeta completa.

---

## Si algo falla

**"Cannot find module 'mongoose'"** → npm install

**ValidationPipe not working** → Verifica main.ts tenga app.useGlobalPipes(new ValidationPipe({...}))

**Tests fallan** → Verifica que bounties.module.ts importe MongooseModule.forFeature

**ECONNREFUSED** → npm test -- --forceExit

**Cannot POST** → Verifica que el servidor esté corriendo y uses la URL correcta
