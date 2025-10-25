const BASE_URL = "http://localhost:5000/api";

export async function initInicioModule() {
  try {
    // Total productos
    const respProd = await fetch(`${BASE_URL}/productos`, { credentials: 'include' });
    const productos = await respProd.json();
    document.getElementById('totalProductos').textContent = productos.length;

    // Ventas recientes
    const respVentas = await fetch(`${BASE_URL}/ventas`, { credentials: 'include' });
    const ventas = await respVentas.json();
    const tablaVentas = document.getElementById('tablaVentasRecientes');
    tablaVentas.innerHTML = '';
    ventas.slice(-5).reverse().forEach(v => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${v.producto?.nombre || 'Producto eliminado'}</td>
        <td>${v.cantidad || 0}</td>
        <td>S/. ${v.total?.toFixed(2) || '0.00'}</td>
      `;
      tablaVentas.appendChild(fila);
    });

    // Total ventas del día
    const hoy = new Date();
    const ventasHoy = ventas.filter(v => {
      const fechaVenta = new Date(v.fechaVenta); // <-- tu campo correcto
      return fechaVenta.toDateString() === hoy.toDateString();
    });
    const totalVentasHoy = ventasHoy.reduce((acc, v) => acc + (v.total || 0), 0);
    document.getElementById('totalVentas').textContent = `S/. ${totalVentasHoy.toFixed(2)}`;

    // Alertas
    const respAlertas = await fetch(`${BASE_URL}/alertas`, { credentials: 'include' });
    const alertas = await respAlertas.json();
    document.getElementById('totalAlertas').textContent = alertas.length;

  } catch (err) {
    console.error('Error cargando inicio:', err);
    // Poner 0 en los elementos en caso de error
    document.getElementById('totalProductos').textContent = '0';
    document.getElementById('totalVentas').textContent = 'S/. 0.00';
    document.getElementById('totalAlertas').textContent = '0';
  }
}
