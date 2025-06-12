CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50),
  password_hash VARCHAR(255)
);

CREATE TABLE descargas_pdf (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  pais VARCHAR(100),
  ruta_archivo VARCHAR(255),
  fecha DATETIME,
  FOREIGN KEY (user_id) REFERENCES usuarios(id)
);
