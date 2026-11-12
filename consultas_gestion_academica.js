/**
 * UNAD | Big Data - Tarea 4 | Fase 2: MongoDB
 * Caso: Sistema de seguimiento del rendimiento academico
 * Autora: Yuri Alejandra Molina Garcia
 * Base de datos: gestion_academica
 * Datos 100 % ficticios, generados exclusivamente para una actividad academica.
 *
 * Ejecutar en mongosh: load("C:/ruta/consultas_gestion_academica.js")
 * IMPORTANTE: Este archivo incluye la preparacion de datos y consultas de prueba.
 * No se deben interpretar las notas simuladas como informacion de una institucion real.
 */

const bd = db.getSiblingDB("gestion_academica");
print("=== TAREA 4: GESTION ACADEMICA EN MONGODB ===");

// 1. CREACION DE COLECCIONES Y DATOS FICTICIOS
// Si la coleccion ya tiene datos, no los duplica ni los reemplaza.
for (const nombre of ["estudiantes", "asignaturas", "calificaciones"]) {
  if (!bd.getCollectionNames().includes(nombre)) {
    bd.createCollection(nombre);
  }
}

if (bd.estudiantes.countDocuments({}) === 0) {
  const estudiantes = [];
  for (let i = 1; i <= 40; i++) {
    estudiantes.push({
      _id: i,
      nombre: "Estudiante " + String(i).padStart(3, "0"),
      grado: 6 + ((i - 1) % 6),
      edad: 11 + ((i - 1) % 6),
      jornada: i % 2 === 0 ? "Manana" : "Tarde",
      estado: "Activo"
    });
  }
  print("Insercion estudiantes: " + bd.estudiantes.insertMany(estudiantes).acknowledged);
}

if (bd.asignaturas.countDocuments({}) === 0) {
  const asignaturas = [
    { _id: 1, nombre: "Matematicas", area: "Matematicas", intensidadHoraria: 5 },
    { _id: 2, nombre: "Lengua Castellana", area: "Humanidades", intensidadHoraria: 5 },
    { _id: 3, nombre: "Ciencias Naturales", area: "Ciencias Naturales", intensidadHoraria: 4 },
    { _id: 4, nombre: "Ciencias Sociales", area: "Ciencias Sociales", intensidadHoraria: 4 },
    { _id: 5, nombre: "Ingles", area: "Humanidades", intensidadHoraria: 3 },
    { _id: 6, nombre: "Tecnologia e Informatica", area: "Tecnologia", intensidadHoraria: 2 },
    { _id: 7, nombre: "Educacion Fisica", area: "Educacion Fisica", intensidadHoraria: 2 },
    { _id: 8, nombre: "Etica y Valores", area: "Etica", intensidadHoraria: 1 },
    { _id: 9, nombre: "Educacion Artistica", area: "Artistica", intensidadHoraria: 2 },
    { _id: 10, nombre: "Fisica", area: "Ciencias Naturales", intensidadHoraria: 3 }
  ];
  print("Insercion asignaturas: " + bd.asignaturas.insertMany(asignaturas).acknowledged);
}

if (bd.calificaciones.countDocuments({}) === 0) {
  const calificaciones = [];
  for (let i = 1; i <= 150; i++) {
    const estudianteId = ((i - 1) % 40) + 1;
    const asignaturaId = ((i - 1) % 10) + 1;
    const periodo = (Math.floor((i - 1) / 40) % 4) + 1;
    const nota = Number((1 + ((i * 7) % 41) / 10).toFixed(1));
    calificaciones.push({
      _id: i, estudianteId, asignaturaId, periodo, nota,
      fecha: new Date(2026, periodo * 2, 15)
    });
  }
  print("Insercion calificaciones: " + bd.calificaciones.insertMany(calificaciones).acknowledged);
}

function mostrar(titulo, datos) {
  print("\n=== " + titulo + " ===");
  print(EJSON.stringify(datos, null, 2));
}

mostrar("Conteo de documentos", {
  estudiantes: bd.estudiantes.countDocuments({}),
  asignaturas: bd.asignaturas.countDocuments({}),
  calificaciones: bd.calificaciones.countDocuments({})
});

// 2. OPERACIONES CRUD CON UN REGISTRO TEMPORAL
// La ID 9999 se usa para no alterar los 40 estudiantes de la actividad.
print("\n=== CRUD (registro temporal 9999) ===");
if (bd.estudiantes.findOne({ _id: 9999 }) !== null) {
  throw new Error("Ya existe el estudiante 9999. No se modifica para evitar sobrescribir datos.");
}
mostrar("CREATE", bd.estudiantes.insertOne({
  _id: 9999, nombre: "Estudiante de prueba CRUD", grado: 10,
  edad: 16, jornada: "Manana", estado: "Activo"
}));
mostrar("READ", bd.estudiantes.findOne({ _id: 9999 }));
mostrar("UPDATE", bd.estudiantes.updateOne({ _id: 9999 }, { $set: { estado: "Retirado" } }));
mostrar("Verificacion UPDATE", bd.estudiantes.findOne({ _id: 9999 }));
mostrar("DELETE", bd.estudiantes.deleteOne({ _id: 9999 }));
mostrar("Verificacion DELETE", bd.estudiantes.findOne({ _id: 9999 }));

// 3. CONSULTAS CON FILTROS Y OPERADORES
mostrar("Estudiantes de grado 10", bd.estudiantes.find({ grado: 10 }).toArray());
mostrar("Notas >= 4.0", bd.calificaciones.find({ nota: { $gte: 4.0 } }).limit(10).toArray());
mostrar("Notas < 3.0", bd.calificaciones.find({ nota: { $lt: 3.0 } }).limit(10).toArray());
mostrar("Grado 10 y estado Activo", bd.estudiantes.find({
  $and: [{ grado: 10 }, { estado: "Activo" }]
}).toArray());
mostrar("Periodos 1 y 2", bd.calificaciones.find({ periodo: { $in: [1, 2] } }).limit(10).toArray());

// 4. RELACIONES ENTRE COLECCIONES MEDIANTE $lookup
mostrar("Lookup: calificaciones + estudiantes", bd.calificaciones.aggregate([
  { $lookup: { from: "estudiantes", localField: "estudianteId", foreignField: "_id", as: "estudiante" } },
  { $unwind: "$estudiante" },
  { $project: { _id: 0, estudiante: "$estudiante.nombre", grado: "$estudiante.grado", nota: 1, periodo: 1 } },
  { $limit: 5 }
]).toArray());

mostrar("Lookup: calificaciones + asignaturas", bd.calificaciones.aggregate([
  { $lookup: { from: "asignaturas", localField: "asignaturaId", foreignField: "_id", as: "asignatura" } },
  { $unwind: "$asignatura" },
  { $project: { _id: 0, asignatura: "$asignatura.nombre", nota: 1, periodo: 1 } },
  { $limit: 5 }
]).toArray());

mostrar("Lookup: relacion de tres colecciones", bd.calificaciones.aggregate([
  { $lookup: { from: "estudiantes", localField: "estudianteId", foreignField: "_id", as: "estudiante" } },
  { $unwind: "$estudiante" },
  { $lookup: { from: "asignaturas", localField: "asignaturaId", foreignField: "_id", as: "asignatura" } },
  { $unwind: "$asignatura" },
  { $project: { _id: 0, estudiante: "$estudiante.nombre", grado: "$estudiante.grado", asignatura: "$asignatura.nombre", periodo: 1, nota: 1 } },
  { $limit: 10 }
]).toArray());

// 5. AGREGACIONES ESTADISTICAS ($group, $sum, $avg, $round)
mostrar("Estudiantes por grado", bd.estudiantes.aggregate([
  { $group: { _id: "$grado", totalEstudiantes: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).toArray());

mostrar("Cantidad de calificaciones por asignatura", bd.calificaciones.aggregate([
  { $group: { _id: "$asignaturaId", totalCalificaciones: { $sum: 1 } } },
  { $lookup: { from: "asignaturas", localField: "_id", foreignField: "_id", as: "asignatura" } },
  { $unwind: "$asignatura" },
  { $project: { _id: 0, asignatura: "$asignatura.nombre", totalCalificaciones: 1 } },
  { $sort: { asignatura: 1 } }
]).toArray());

mostrar("Suma total de calificaciones", bd.calificaciones.aggregate([
  { $group: { _id: null, cantidad: { $sum: 1 }, sumaCalificaciones: { $sum: "$nota" } } }
]).toArray());

mostrar("Promedio por asignatura", bd.calificaciones.aggregate([
  { $group: { _id: "$asignaturaId", promedio: { $avg: "$nota" }, cantidad: { $sum: 1 } } },
  { $lookup: { from: "asignaturas", localField: "_id", foreignField: "_id", as: "asignatura" } },
  { $unwind: "$asignatura" },
  { $project: { _id: 0, asignatura: "$asignatura.nombre", cantidad: 1, promedio: { $round: ["$promedio", 2] } } },
  { $sort: { asignatura: 1 } }
]).toArray());

mostrar("Diez promedios mas altos por estudiante", bd.calificaciones.aggregate([
  { $group: { _id: "$estudianteId", promedio: { $avg: "$nota" }, cantidadNotas: { $sum: 1 } } },
  { $lookup: { from: "estudiantes", localField: "_id", foreignField: "_id", as: "estudiante" } },
  { $unwind: "$estudiante" },
  { $project: { _id: 0, estudiante: "$estudiante.nombre", grado: "$estudiante.grado", promedio: { $round: ["$promedio", 2] }, cantidadNotas: 1 } },
  { $sort: { promedio: -1 } },
  { $limit: 10 }
]).toArray());

print("\nFIN: Archivo de consultas de la Tarea 4 completado.");
