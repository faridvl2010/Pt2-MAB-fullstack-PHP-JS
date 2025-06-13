function decodificarToken(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadDecoded = atob(payloadBase64);
    return JSON.parse(payloadDecoded);
  } catch (e) {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('No estás autenticado.');
    window.location.href = 'index.html';
    return;
  }

  const payload = decodificarToken(token);
  const nombreUsuario = payload?.username || 'Usuario';

  // Mostrar saludo
  const saludoEl = document.getElementById('saludoUsuario');
  if (saludoEl) saludoEl.textContent = `Bienvenido, ${nombreUsuario}`;

  document.getElementById('cerrarSesionBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  });

  document.getElementById('paisSelect').addEventListener('change', async (e) => {
    const pais = e.target.value.trim();
    if (!pais) return;

    document.getElementById('filtroContainer').style.display = 'block';

    const res = await fetch(`http://universities.hipolabs.com/search?country=${pais}`);
    const universidades = await res.json();

    window.universidadesOriginal = universidades;
    window.universidades = universidades;

    renderizarTabla(universidades);
  });

  document.getElementById('filtroNombre').addEventListener('input', e => {
    const filtro = e.target.value.toLowerCase();
    const resultado = window.universidadesOriginal.filter(u =>
      u.name.toLowerCase().includes(filtro)
    );
    window.universidades = resultado;
    renderizarTabla(resultado);
  });

  document.getElementById('descargarBtn').addEventListener('click', async () => {
    const paisSeleccionado = document.getElementById('paisSelect').value.trim();

    if (!window.universidades || !window.universidades.length || paisSeleccionado === '') {
      alert("Selecciona un país primero.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const fecha = new Date();

    doc.setFont('helvetica', 'bold');
    doc.text(`Universidades en ${paisSeleccionado}`, 10, 10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado por: ${nombreUsuario} - ${fecha.toLocaleString()}`, 10, 18);

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
    formData.append('pais', paisSeleccionado);

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

  function renderizarTabla(universidades) {
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
  }
});
