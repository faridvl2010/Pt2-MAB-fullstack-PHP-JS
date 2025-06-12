document.getElementById('paisSelect').addEventListener('change', async (e) => {
  const pais = e.target.value;
  if (!pais) return;

  const res = await fetch(`http://universities.hipolabs.com/search?country=${pais}`);
  const universidades = await res.json();

  const tbody = document.getElementById('tablaUniversidades');
    tbody.innerHTML = '';
universidades.forEach((u, i) => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${i + 1}</td>
    <td>${u.name}</td>
    <td>${u.domains[0]}</td>
    <td><a href="${u.web_pages[0]}" target="_blank">${u.web_pages[0]}</a></td>
  `;
  tbody.appendChild(tr);
});


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

  doc.setFont('helvetica', 'bold');
  doc.text(`Universidades en ${window.paisSeleccionado}`, 10, 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado: ${fecha.toLocaleString()}`, 10, 18);

  const data = window.universidades.map((u, i) => [
    i + 1,
    u.name,
    u.domains[0],
    u.web_pages[0]
  ]);

  doc.autoTable({
    head: [['#', 'Nombre', 'Dominio', 'Web']],
    body: data,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 160, 133] },
    margin: { top: 25, left: 10, right: 10 }
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

  const dataRes = await res.json();
  if (res.ok) {
    alert('PDF guardado correctamente en el servidor');
  } else {
    alert(dataRes.error || 'Error al guardar PDF');
  }
});
