## ✨ Características principales

- ✅ Autenticación de usuarios usando **JSON Web Tokens (JWT)** personalizados en PHP (sin Composer).
- ✅ Consumo de API pública: [`http://universities.hipolabs.com`](http://universities.hipolabs.com).
- ✅ Generación de **PDF en frontend** usando `jsPDF` y `autoTable`.
- ✅ Envío y almacenamiento del PDF en el servidor.
- ✅ Registro de cada descarga en la base de datos: usuario, país, fecha y archivo.

---

## 🏗️ Arquitectura del proyecto

El proyecto sigue una arquitectura **RESTful simple**:

- **Frontend** (`/frontend`):  
  HTML + JS que consume APIs del backend, maneja el login y genera los PDFs.

- **Backend** (`/api`):  
  Endpoints PHP para autenticación (`login.php`, `register.php`) y para guardar PDFs (`save.php`).  
  Manejo de sesiones con tokens JWT.

- **Lib** (`/lib`):  
  Implementación personalizada del estándar JWT (firmado y verificado en el backend).

- **Base de datos** (`/sql/schema.sql`):  
  Tablas: `usuarios`, `descargas_pdf`.
