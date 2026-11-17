# ShipNow API · Pre-entrega Módulo 1

**Programación Backend III: Testing y Escalabilidad · Coderhouse**

Refactorización de la API ShipNow a una **arquitectura por capas** (Router → Controller → Service → Repository → Model), con **configuración de entorno validada al arranque** y **constantes del dominio** sin strings mágicos.

Proyecto base: `shipnow-v2`, compartido por el profesor en la clase 1. Sobre esa base se agregó la entidad **Products** y se ajustaron la configuración y las constantes a lo que pide la consigna.

---

## Requisitos

- Node.js 20 o superior
- MongoDB, local o Atlas

## Cómo correrlo localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno a partir del ejemplo
cp .env.example .env

# 3. Completar los valores en .env, por ejemplo:
#    PORT=8080
#    MONGODB_URI=mongodb://localhost:27017/shipnow
#    NODE_ENV=development
#    JWT_SECRET=un_secreto_largo

# 4. Levantar en modo desarrollo (se reinicia al guardar cambios)
npm run dev

# o en modo normal
npm start
```

Si todo está bien, la consola muestra:

```
MongoDB conectado
ShipNow escuchando en el puerto 8080 (development)
```

### Variables de entorno

| Variable      | Obligatoria | Descripción                                          |
|---------------|-------------|------------------------------------------------------|
| `PORT`        | Sí          | Puerto HTTP. Debe ser un entero positivo.            |
| `MONGODB_URI` | Sí          | Cadena de conexión a MongoDB.                        |
| `NODE_ENV`    | Sí          | `development`, `test` o `production`.                |
| `JWT_SECRET`  | Sí          | Secreto para firmar tokens (se usa en módulos siguientes). |

### Prueba de robustez

Borrá `MONGODB_URI` del `.env` y corré `npm start`. La app **no arranca** y muestra:

```
❌ No se pudo iniciar ShipNow: Faltan variables de entorno obligatorias: MONGODB_URI. Revisá tu archivo .env (usá .env.example como guía).
```

También falla con un mensaje claro si `PORT` no es un número o si `NODE_ENV` tiene un valor no permitido.

---

## Estructura

```
src/
├── server.js              # Arranque: valida config, conecta a Mongo y abre el puerto
├── app.js                 # Arma Express y lo exporta (sin listen, listo para Supertest)
├── config/
│   ├── env.config.js      # ÚNICO archivo que lee process.env. Valida y congela la config
│   ├── index.js           # Reexporta la config
│   └── db.config.js       # Conexión a MongoDB
├── constants/index.js     # Roles, estados, códigos HTTP y errores con Object.freeze
├── models/                # Esquemas de Mongoose (solo forma del documento)
├── repositories/          # ÚNICOS que conocen Mongoose
├── services/              # Reglas de negocio (sin req/res)
├── controllers/           # Traducen HTTP <-> service
├── routes/                # Solo conectan path con método del controller
├── middlewares/           # 404 y manejo de errores (provisorio hasta el Módulo 3)
└── utils/                 # AppError, paginación, envelope de respuesta
```

### Reglas que cumple el código

- Ningún controller importa Mongoose ni un modelo.
- Ningún service recibe `req` ni `res`.
- `process.env` aparece solamente en `src/config/env.config.js`.
- Roles, estados y códigos HTTP salen de `src/constants/index.js` (no hay strings sueltos).
- Los routers tienen una línea por endpoint.

> **Sobre las rutas de archivos:** la consigna menciona `src/config/index.js` y `src/utils/constants.js`, y el briefing `src/config/env.config.js` y `src/constants/index.js`. Para cumplir ambas sin duplicar lógica, la configuración vive en `env.config.js` y las constantes en `constants/index.js`. `config/index.js` y `utils/constants.js` solo las reexportan.

---

## ¿Por qué separé así la lógica entre Service y Repository?

La regla que seguí: **el Repository sabe CÓMO se guardan y buscan los datos; el Service sabe QUÉ dice el negocio.**

**Lo que está en el Repository (reglas de acceso a datos):**

- **Filtro por defecto de borrado lógico.** Los productos no se borran físicamente: se marca `deletedAt`. El repository agrega `{ deletedAt: null }` a todas las consultas, así ninguna capa superior puede "olvidarse" de excluir los borrados. Es un detalle de cómo se almacenan los datos, no una regla del negocio.
- **Proyecciones.** Nunca devuelve campos internos (`__v`, `deletedAt`).
- **Paginación** con `skip`/`limit` y conteo total en paralelo.
- Usa `.lean()` para devolver objetos planos y no documentos de Mongoose, así el resto de la app no depende de Mongoose.

**Lo que está en el Service (reglas de negocio):**

- **Qué productos ve el cliente.** El catálogo (`GET /api/products`) solo muestra productos disponibles. El Service *decide* esa regla y le pasa el filtro al Repository (`{ status: AVAILABLE }`). El Repository solo ejecuta la consulta sin saber por qué. El filtrado ocurre en MongoDB, no en memoria: si hubiera 50.000 productos y solo 10 disponibles, viajan 10 y no 50.000.
- **El estado del producto se deriva del stock.** `status` y `stock` dicen casi lo mismo y podrían contradecirse (stock 0 pero "disponible"). Para evitarlo, el cliente **no puede enviar `status`**: el Service lo calcula con `resolveProductStatus(stock)` cada vez que se crea o se modifica el stock.
- **Validaciones de negocio:** campos obligatorios, precios no negativos, stock entero, rol válido, email único, pedido con al menos un item.
- **Cálculo del total de un pedido** (`calculateOrderTotal`). Es una función pura, testeable sin base de datos.

Si mañana cambia la regla de "disponible" (por ejemplo, que además el producto esté activo), se modifica el Service. Si mañana se cambia MongoDB por otra base, se modifican los repositories. Cada capa tiene una sola razón para cambiar.

---

## Endpoints

Base URL: `http://localhost:8080/api`

### Products

| Método | Ruta                  | Descripción |
|--------|-----------------------|-------------|
| GET    | `/products`           | Catálogo: **solo productos disponibles**. Query: `page`, `limit`, `category` |
| GET    | `/products/inventory` | Inventario completo. Query: `page`, `limit`, `status` (`available` / `out_of_stock`) |
| GET    | `/products/:pid`      | Producto por id |
| POST   | `/products`           | Crear producto. Body: `title`*, `price`*, `stock`, `description`, `category` |
| PUT    | `/products/:pid`      | Actualizar campos. El `status` se recalcula si cambia el `stock` |
| DELETE | `/products/:pid`      | Borrado lógico (responde 204) |

### Users

| Método | Ruta                | Descripción |
|--------|---------------------|-------------|
| GET    | `/users`            | Listado paginado. Query: `page`, `limit`, `role` |
| GET    | `/users/:uid`       | Usuario por id |
| POST   | `/users`            | Crear usuario. Body: `name`*, `email`*, `role` (por defecto `user`) |
| PATCH  | `/users/:uid/role`  | Cambiar rol. Body: `{ "role": "admin" }` |

Roles válidos: `admin`, `user`, `driver`, `store`.

### Stores y Orders (heredados del proyecto base)

| Método | Ruta                    | Descripción |
|--------|-------------------------|-------------|
| GET    | `/stores`               | Listar comercios |
| POST   | `/stores`               | Crear comercio. Body: `name`*, `address` |
| GET    | `/orders`               | Listar pedidos |
| GET    | `/orders/:oid`          | Pedido por id |
| POST   | `/orders`               | Crear pedido. Body: `userId`*, `storeId`*, `address`*, `items`* |
| PATCH  | `/orders/:oid/deliver`  | Marcar como entregado (409 si ya lo estaba) |

### Ejemplos rápidos

```bash
# Crear un producto (el status se calcula solo: stock 10 -> available)
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Caja mediana","price":1500,"stock":10,"category":"embalaje"}'

# Catálogo (solo disponibles)
curl http://localhost:8080/api/products

# Crear un usuario (rol por defecto: user)
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@mail.com"}'
```

---

## Formato de respuestas

Todas las respuestas usan el mismo envelope.

**Éxito** (200, 201):

```json
{ "status": "success", "payload": { } }
```

**Error** (4xx, 5xx):

```json
{
  "status": "error",
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "El producto solicitado no existe"
  }
}
```

| Situación                          | HTTP | `code`                    |
|------------------------------------|------|---------------------------|
| Datos inválidos o JSON mal formado | 400  | `VALIDATION_ERROR`        |
| Id con formato inválido            | 400  | `INVALID_ID`              |
| Rol inexistente                    | 400  | `INVALID_USER_ROLE`       |
| Recurso no encontrado              | 404  | `PRODUCT_NOT_FOUND`, `USER_NOT_FOUND`, … |
| Ruta inexistente                   | 404  | `ROUTE_NOT_FOUND`         |
| Email ya registrado                | 409  | `EMAIL_ALREADY_EXISTS`    |
| Pedido ya entregado                | 409  | `ORDER_ALREADY_DELIVERED` |
| Error inesperado                   | 500  | `INTERNAL_ERROR`          |

El manejo de errores es provisorio: en el Módulo 3 se reemplaza por la capa centralizada de custom errors.
