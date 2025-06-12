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

  doc.text(`Universidades en ${window.paisSeleccionado}`, 10, 10);
  doc.text(`Generado: ${fecha.toLocaleString()}`, 10, 20);

  window.universidades.forEach((u, i) => {
    doc.text(`${i + 1}. ${u.name} - ${u.domains[0]} - ${u.web_pages[0]}`, 10, 30 + i * 10);
  });

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
