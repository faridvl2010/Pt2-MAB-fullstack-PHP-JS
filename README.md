# Plataforma Educativa - Reto Técnico

Este proyecto es una aplicación **Fullstack PHP + JavaScript vanilla** diseñada para mostrar universidades por país, permitir iniciar sesión, generar un PDF con los resultados y almacenarlo en el servidor, todo bajo una arquitectura RESTful clara.

---

## 📁 Estructura del Proyecto

```
universidades_app/
├── public/                    # Archivos visibles para el navegador
│   ├── index.html             # Página de inicio de sesión
│   ├── dashboard.html         # Interfaz principal del usuario
│   └── js/
│       └── main.js            # Lógica del frontend
├── api/                       # Endpoints RESTful
│   ├── auth/
│   │   └── login.php          # POST /api/auth/login
│   └── pdfs/
│       └── save.php           # POST /api/pdfs/save
├── config/
│   └── db.php                 # Conexión a base de datos (PDO)
├── pdfs/                      # Carpeta donde se guardan los archivos PDF
├── sql/
│   └── schema.sql             # Script SQL para crear las tablas necesarias
```

---

## 🔐 Autenticación

### `POST /api/auth/login`

**Parámetros (x-www-form-urlencoded):**
- `username`
- `password`

**Respuesta:**
- `200 OK`: `{ "success": true }`
- `401 Unauthorized`: `{ "error": "Credenciales inválidas" }`

---

## 📄 Guardar PDF

### `POST /api/pdfs/save`

**Encabezados:**
- `Content-Type: multipart/form-data`
- **Requiere sesión activa**

**Parámetros:**
- `pdf`: archivo PDF generado desde el frontend.
- `pais`: nombre del país seleccionado.

**Respuesta:**
- `200 OK`: `{ "success": true }`
- `403 Forbidden`: `{ "error": "No autenticado" }`
- `400 Bad Request`: `{ "error": "Archivo no recibido" }`

---

## 🧪 Base de Datos

Script de creación disponible en `sql/schema.sql`.

Tablas:
- `usuarios`: para login.
- `descargas_pdf`: registro de descargas de PDF.

---

## 📌 Tecnologías Usadas

- PHP 8+
- JavaScript Vanilla
- jsPDF para generación de PDF
- Bootstrap 5 para estilos
- MySQL o MariaDB

---

## 🚀 Cómo ejecutar

1. Clona o descomprime este repositorio.
2. Configura la base de datos usando `sql/schema.sql`.
3. Modifica `config/db.php` con tus credenciales.
4. Coloca el proyecto en tu servidor local (XAMPP, Laragon, etc.).
5. Abre `index.html` desde `public/`.

---

## 🏗️ Arquitectura RESTful

Este proyecto sigue una **arquitectura RESTful simple y clara**, separando autenticación, lógica de negocio y vistas, lo que permite escalabilidad y orden.

