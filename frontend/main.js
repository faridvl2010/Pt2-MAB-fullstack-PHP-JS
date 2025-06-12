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
  window.universidades = universidades;
  window.paisSeleccionado = pais;
});

document.getElementById('descargarBtn').addEventListener('click', async () => {
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
  const res = await fetch('/backend/api/save-pdf.php', {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  if (res.ok) {
    alert('PDF guardado correctamente');
  } else {
    alert('Error al guardar PDF');
  }
});
