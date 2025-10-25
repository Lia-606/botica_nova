document.getElementById('descargarReporte').addEventListener('click', () => {
  fetch('/api/reportes/pdf', {
    method: 'GET',
    credentials: 'include' // importante para enviar cookies con token
  })
  .then(res => res.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte-botica.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  })
  .catch(err => console.error('Error al descargar reporte:', err));
});
