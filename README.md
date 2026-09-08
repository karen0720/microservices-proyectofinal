# Microservices Project Final

Sistema de microservicios para la gestión de clientes, productos y compras, desarrollado con Node.js, Express, MongoDB y Docker.

## 1. Arquitectura general

El sistema está compuesto por cuatro aplicaciones independientes:

- Gateway: punto de entrada único del sistema y único componente que maneja CORS.
- Customers: registro, autenticación, perfil y direcciones de clientes.
- Products: catálogo público de productos y categorías.
- Shopping: carrito, wishlist y órdenes.

El frontend se comunica únicamente con el Gateway.

### Flujo general

```text
Frontend / Cliente
        |
        v
Gateway :8000
   |      |      |
   v      v      v
Customers Products Shopping
   |         |       |
   v         v       v
 Mongo      Mongo    Mongo

Shopping ---- HTTP ----> Products
```

## 2. Arquitectura por capas

Los microservicios siguen el flujo:

```text
API -> Service -> Repository -> Model
```

### API
Gestiona las solicitudes HTTP, parámetros, body y respuestas.

### Service
Contiene la lógica de negocio.

### Repository
Es la única capa que interactúa directamente con los modelos de persistencia.

### Model
Define las estructuras de MongoDB mediante Mongoose.

No se realizan accesos directos a la base de datos desde la API.
## 3. Dominios

### Customers

Responsabilidades:
- Registro de clientes.
- Inicio de sesión.
- Generación de JWT.
- Perfil.
- Direcciones.

Puerto: 8003

Base de datos: customers-db

### Products

Responsabilidades:
- Consulta del catálogo.
- Consulta de producto por ID.
- Consulta de categorías.

Puerto: 8002

Base de datos: products-db

### Shopping

Responsabilidades:
- Carrito.
- Wishlist.
- Órdenes.
- Persistencia de compras.

Puerto: 8004

Base de datos: shopping-db

Shopping consulta Products mediante HTTP utilizando:

shopping/src/clients/products-client.js

No existe acceso directo de Shopping al repository ni a la base de datos de Products.

## 4. Seguridad

- Customers genera los JWT.
- Las rutas privadas utilizan Bearer Token.
- Shopping verifica el JWT utilizando su propio APP_SECRET.
- Gateway reenvía el header Authorization.
- Las contraseñas se almacenan mediante hashing con bcryptjs.
- Los archivos .env reales no se versionan.
- Cada servicio tiene un .env.example.
- Las variables requeridas se validan al iniciar.

## 5. CORS

CORS está centralizado únicamente en Gateway.

Gateway -> CORS
Customers -> sin CORS
Products -> sin CORS
Shopping -> sin CORS
## 6. Docker

Cada aplicación es autónoma y posee sus propios archivos de configuración y ejecución.

```text
package.json
package-lock.json
Dockerfile
docker-compose.yml
.dockerignore
.env.example
```

Cada dominio utiliza su propia instancia de MongoDB.

La comunicación entre aplicaciones utiliza la red Docker externa:

`microservices`

Las bases de datos no se utilizan como mecanismo de comunicación entre dominios.

## 7. Puertos

| Componente | Puerto |
|---|---:|
| Gateway | 8000 |
| Products | 8002 |
| Customers | 8003 |
| Shopping | 8004 |
| Products MongoDB | 27017 |
| Customers MongoDB | 27018 |
| Shopping MongoDB | 27019 |

## 8. Variables de entorno

### Gateway
```text
PORT
CUSTOMERS_URL
PRODUCTS_URL
SHOPPING_URL
```

### Customers
```text
PORT
DB_URL
APP_SECRET
```

### Products
```text
PORT
DB_URL
```

### Shopping
```text
PORT
DB_URL
PRODUCTS_SERVICE_URL
APP_SECRET
```

Los valores reales deben mantenerse en archivos .env locales y los archivos .env no se versionan.
## 9. Ejecución desde cero

### Requisitos

- Git
- Docker
- Docker Compose
- Node.js 22

### 1. Clonar el repositorio

```bash
git clone https://github.com/karen0720/microservices-proyectofinal.git
cd microservices-proyectofinal
```

### 2. Crear la red Docker

```bash
sudo docker network create microservices
```

Si la red ya existe, no es necesario crearla nuevamente.

### 3. Levantar Customers

```bash
sudo docker compose -f customers/docker-compose.yml up -d --build
```

### 4. Levantar Products

```bash
sudo docker compose -f products/docker-compose.yml up -d --build
```

### 5. Levantar Shopping

```bash
sudo docker compose -f shopping/docker-compose.yml up -d --build
```

### 6. Levantar Gateway

```bash
sudo docker compose -f gateway/docker-compose.yml up -d --build
```

### 7. Comprobar contenedores

```bash
sudo docker ps
```

Se esperan Gateway, Customers, Products, Shopping y sus respectivas bases de datos MongoDB.

## 10. Endpoints principales

### Gateway

```text
GET  /health
GET  /products
GET  /products/:id
POST /customer/signup
POST /customer/login
GET  /customer/profile
GET  /customer/shopping-details
GET  /customer/wishlist
GET  /customer/cart
POST /customer/order
```

### Customers

```text
POST /customer/signup
POST /customer/login
POST /customer/address
GET  /customer/profile
```

### Products

```text
GET /products
GET /products/:id
```

### Shopping

```text
GET    /cart
POST   /cart
DELETE /cart/:productId

GET    /wishlist
POST   /wishlist
DELETE /wishlist/:productId

GET  /shopping-details
GET  /orders
POST /shopping/order
```

Las rutas privadas utilizan el header `Authorization: Bearer <JWT>`.

## 11. Tests

Todos los componentes con pruebas utilizan Jest.

Para ejecutar los tests de cada aplicación:

```bash
cd gateway && npm test
cd ../customers && npm test
cd ../products && npm test
cd ../shopping && npm test
```

Shopping incluye pruebas unitarias de la capa de servicio y pruebas de integración contra MongoDB.

## 12. Integración continua

GitHub Actions se encuentra en `.github/workflows/ci.yml` y ejecuta las pruebas de Gateway, Customers, Products y Shopping.

El workflow proporciona MongoDB para las pruebas de integración de Shopping.
## 13. Degradación

El sistema contempla degradación cuando una dependencia externa no está disponible.

Durante las pruebas realizadas, Products fue detenido mientras Customers, Shopping y Gateway permanecían activos.

La solicitud GET /customer/profile continuó respondiendo y el sistema devolvió carrito y wishlist vacíos.

El objetivo es evitar que la caída de una dependencia secundaria provoque la caída completa del Gateway.

## 14. Estructura del proyecto

```text
microservices-proyectofinal/
|-- gateway/
|   |-- src/
|   |-- tests/
|   |-- Dockerfile
|   |-- docker-compose.yml
|   |-- .dockerignore
|   `-- .env.example
|-- customers/
|   |-- src/
|   |-- tests/
|   |-- Dockerfile
|   |-- docker-compose.yml
|   |-- .dockerignore
|   `-- .env.example
|-- products/
|   |-- src/
|   |-- tests/
|   |-- Dockerfile
|   |-- docker-compose.yml
|   |-- .dockerignore
|   `-- .env.example
|-- shopping/
|   |-- src/
|   |-- tests/
|   |-- Dockerfile
|   |-- docker-compose.yml
|   |-- .dockerignore
|   `-- .env.example
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- README.md
`-- BITACORA.md
```

## 15. Historial de commits

El desarrollo se mantiene en la rama main utilizando mensajes de Conventional Commits.

Ejemplos utilizados durante el desarrollo:

- feat: agregar persistencia de shopping
- refactor: separar shopping de customers
- refactor: conectar shopping con products service
- refactor: centralize cors in gateway
- test: add shopping unit and integration tests
- ci: run tests for all services
- ci: provide mongodb for integration tests
