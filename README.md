# Sistema de seguimiento del rendimiento académico con MongoDB

**Universidad Nacional Abierta y a Distancia – UNAD**  
**Programa:** Ingeniería de Sistemas  
**Curso:** Big Data  
**Actividad:** Tarea 4 – Almacenamiento y consultas de datos en Big Data  
**Estudiante:** Yuri Alejandra Molina García  
**Grupo:** 202016911_114

## Descripción del proyecto

Este proyecto presenta la implementación de una base de datos NoSQL en MongoDB para gestionar y analizar información académica de estudiantes mediante datos ficticios.

## Estructura de la base de datos

La base de datos `gestion_academica` contiene tres colecciones:

- `estudiantes`: 40 documentos.
- `asignaturas`: 10 documentos.
- `calificaciones`: 150 documentos.

**Total: 200 documentos.**

## Operaciones implementadas

- Creación de colecciones e inserción de documentos.
- Operaciones CRUD.
- Consultas con filtros y operadores lógicos.
- Uniones entre colecciones mediante `$lookup`.
- Agregaciones estadísticas con `$group`, `$sum` y `$avg`.

## Resultados

Se logró implementar un sistema demostrativo de almacenamiento y consulta de datos académicos. Las agregaciones permitieron contar registros, calcular sumas y obtener promedios por asignatura y estudiante.

Los resultados corresponden a información simulada con fines exclusivamente académicos.

## Tecnología utilizada

- MongoDB Community Server.
- MongoDB Compass.
- MongoDB Shell (`mongosh`).
- JavaScript.
- GitHub.

## Código fuente

El archivo principal del proyecto es `consultas_gestion_academica.js`.

## Referencias

MongoDB, Inc. (s. f.). *MongoDB manual*. https://www.mongodb.com/docs/manual/

MongoDB, Inc. (s. f.). *Aggregation operations*. https://www.mongodb.com/docs/manual/aggregation/
