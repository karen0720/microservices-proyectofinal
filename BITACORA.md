# Bitácora de desarrollo y depuración

## Formato

Cada incidencia se documenta como: síntoma → causa → corrección.

## 1. Comunicación entre contenedores

**Síntoma:** los servicios necesitaban resolverse por nombre dentro de Docker.

**Causa:** los contenedores necesitaban una red compartida para comunicarse.

**Corrección:** se creó la red Docker externa microservices y se conectaron los servicios que requieren comunicación entre dominios.

## 2. Rutas del Gateway

**Síntoma:** algunas rutas del Gateway no coincidían con las rutas internas de Shopping.

**Causa:** el path público y el path interno eran diferentes.

**Corrección:** se agregaron resolvers de ruta específicos en gateway/src/routes.js.

## 3. Separación de dominios

**Síntoma:** Customers todavía contenía carrito, wishlist y órdenes.

**Causa:** la implementación inicial mezclaba responsabilidades entre Customers y Shopping.

**Corrección:** se trasladó la persistencia y lógica de Shopping al microservicio Shopping y se limpió Customers.

## 4. CORS

**Síntoma:** CORS estaba implementado en más de un servicio.

**Causa:** la configuración estaba distribuida entre aplicaciones.

**Corrección:** CORS quedó centralizado únicamente en Gateway.

## 5. Comunicación Shopping → Products

**Síntoma:** Shopping recibía información completa del producto desde la solicitud.

**Causa:** faltaba un cliente dedicado para comunicación entre dominios.

**Corrección:** se creó shopping/src/clients/products-client.js y Shopping consulta Products mediante HTTP.

## 6. Tests de Customers

**Síntoma:** después del refactor algunos tests fallaron por nombres de métodos y respuestas incompatibles con los mocks existentes.

**Causa:** el service había sido cambiado sin mantener el contrato que utilizaban las pruebas.

**Corrección:** se adaptó customer-service.js a las interfaces actuales del repository y de los tests.

**Resultado:** 3 suites y 3 tests aprobados.

## 7. GitHub Actions

**Síntoma:** los tests de integración de Shopping funcionaban localmente pero fallaban en GitHub Actions.

**Causa:** el runner de GitHub no tenía MongoDB disponible para esos tests.

**Corrección:** se agregó MongoDB como service del workflow y se configuró TEST_DB_URL.

**Resultado:** Gateway, Customers, Products y Shopping quedaron en verde en CI.
