export async function initInventarioModule() {
  console.log("🔹 Módulo Inventario inicializado correctamente");

  const API_URL = 'http://localhost:5000/api/productos';
  const form = document.getElementById('productoForm');
  const tablaBody = document.querySelector('#tablaProductos tbody');
  let editando = false;
  let productoId = null;

  // 📥 Obtener todos los productos
  async function cargarProductos() {
    try {
      const res = await fetch(API_URL);
      const productos = await res.json();

      tablaBody.innerHTML = productos.map(prod => `
        <tr>
          <td>${prod.nombre}</td>
          <td>${prod.descripcion || '-'}</td>
          <td>S/ ${prod.precio.toFixed(2)}</td>
          <td>${prod.stock}</td>
          <td>${new Date(prod.fechaRegistro).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" data-id="${prod._id}"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm btn-danger" data-id="${prod._id}"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `).join('');

      agregarEventos();
    } catch (err) {
      console.error('❌ Error al cargar productos:', err);
    }
  }

  function agregarEventos() {
    // Editar
    tablaBody.querySelectorAll(".btn-warning").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const res = await fetch(`${API_URL}/${id}`);
        const prod = await res.json();
        document.getElementById('nombre').value = prod.nombre;
        document.getElementById('descripcion').value = prod.descripcion || '';
        document.getElementById('precio').value = prod.precio;
        document.getElementById('stock').value = prod.stock;
        productoId = id;
        editando = true;
      });
    });

    // Eliminar
    tablaBody.querySelectorAll(".btn-danger").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await cargarProductos();
      });
    });
  }

  // Guardar o editar
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nuevoProducto = {
      nombre: document.getElementById('nombre').value,
      descripcion: document.getElementById('descripcion').value,
      precio: parseFloat(document.getElementById('precio').value),
      stock: parseInt(document.getElementById('stock').value)
    };
    const url = editando ? `${API_URL}/${productoId}` : API_URL;
    const method = editando ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    });
    if (!res.ok) throw new Error('Error al guardar producto');
    form.reset();
    editando = false;
    productoId = null;
    await cargarProductos();
  });

  // Cargar tabla
  await cargarProductos();
}
