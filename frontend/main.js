document.getElementById('paisSelect').addEventListener('change', async (e) => {
  const pais = e.target.value;
  if (!pais) return;

  const res = await fetch(`http://universities.hipolabs.com/search?country=${pais}`);
  const universidades = await res.json();

  const lista = document.getElementById('listaUniversidades');
  lista.innerHTML = '';
  universidades.forEach(u => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${u.name} - ${u.domains[0]} - ${u.web_pages[0]}`;
    lista.appendChild(li);
  });

  // Guardar en variables globales para el PDF
  window.universidades = universidades;
  window.paisSeleccionado = pais;
});

document.getElementById('descargarBtn').addEventListener('click', async () => {
  if (!window.universidades || !window.paisSeleccionado) {
    alert("Selecciona un país primero.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const fecha = new Date();

  // Títulos
  doc.setFont('helvetica', 'bold');
  doc.text(`Universidades en ${window.paisSeleccionado}`, 10, 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${fecha.toLocaleString()}`, 10, 18);

  // Inicio de contenido
  let y = 30;
  let contador = 1;
  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.height;

 const marginX = 10;
const maxWidth = doc.internal.pageSize.width - marginX * 2;
y = 30;
contador = 1;

window.universidades.forEach((u, i) => {
  const lineaLarga = `${contador++}. ${u.name} - ${u.domains[0]} - ${u.web_pages[0]}`;
  const lineas = doc.splitTextToSize(lineaLarga, maxWidth);

  if (y + lineas.length * lineHeight > pageHeight - 20) {
    doc.addPage();
    y = 20;
  }

  lineas.forEach(linea => {
    doc.text(linea, marginX, y);
    y += lineHeight;
  });
});


  // Crear Blob, enviar al backend
  const pdfBlob = doc.output('blob');
  const formData = new FormData();
  formData.append('pdf', pdfBlob, 'universidades.pdf');
  formData.append('pais', window.paisSeleccionado);

  const token = localStorage.getItem('token');
  if (!token) {
    alert("No estás autenticado.");
    return;
  }

  const res = await fetch('/Pt2-MAB-fullstack-PHP-JS/api/pdfs/save.php', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    alert('PDF guardado correctamente en el servidor');
  } else {
    alert(data.error || 'Error al guardar PDF');
  }
});

