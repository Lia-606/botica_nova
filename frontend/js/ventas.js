export function initVentasModule() {
  const ventaForm = document.getElementById('ventaForm');
  const tablaVentas = document.getElementById('tablaVentas').querySelector('tbody');
  const productoInput = document.getElementById('producto');
  const productosList = document.getElementById('productosList');

  let productosMap = {};

  // Cargar productos
  const cargarProductos = async () => {
    try {
      const res = await fetch('/api/productos', {
        credentials: 'include' // <-- enviar cookies
      });
      if (!res.ok) throw new Error('Error al cargar productos');
      const productos = await res.json();

      productosList.innerHTML = '';
      productosMap = {};

      productos.forEach(p => {
        if (p.stock > 0) {
          const option = document.createElement('option');
          option.value = p.nombre;
          productosList.appendChild(option);
          productosMap[p.nombre] = { id: p._id, stock: p.stock };
        }
      });
    } catch (err) {
      console.error('Error al cargar productos:', err);
      alert('No se pudieron cargar los productos');
    }
  };

  // Cargar ventas
  const cargarVentas = async () => {
    try {
      const res = await fetch('/api/ventas', {
        credentials: 'include' // <-- enviar cookies
      });
      if (!res.ok) throw new Error('Error al cargar ventas');
      const ventas = await res.json();
      tablaVentas.innerHTML = '';
      ventas.forEach(v => {
        tablaVentas.innerHTML += `
          <tr>
            <td>${v.cliente}</td>
            <td>${v.producto.nombre}</td>
            <td>${v.cantidad}</td>
            <td>${v.total.toFixed(2)}</td>
            <td>${new Date(v.fechaVenta).toLocaleString()}</td>
            <td>${v.vendedor.nombre}</td>
          </tr>
        `;
      });
    } catch (err) {
      console.error('Error al cargar ventas:', err);
      alert('No se pudieron cargar las ventas');
    }
  };

  // Registrar venta
  ventaForm.addEventListener('submit', async e => {
    e.preventDefault();

    const nombreProducto = productoInput.value.trim();
    const productoData = productosMap[nombreProducto];

    if (!productoData) return alert('Producto no válido');

    const cantidad = Number(document.getElementById('cantidad').value);
    if (!cantidad || cantidad <= 0) return alert('Cantidad inválida');
    if (cantidad > productoData.stock) return alert('No hay suficiente stock');

    const data = {
      cliente: document.getElementById('cliente').value.trim(),
      producto: productoData.id,
      cantidad
    };

    try {
      const res = await fetch('/api/ventas', {
        method: 'POST',
        credentials: 'include', // <-- enviar cookies
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const error = await res.json();
        return alert(error.msg || 'Error al registrar la venta');
      }

      ventaForm.reset();
      await cargarProductos();
      await cargarVentas();
      alert('Venta registrada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al registrar la venta');
    }
  });

  // Inicialización
  (async () => {
    await cargarProductos();
    await cargarVentas();
  })();
}
