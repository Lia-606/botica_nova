export async function initAlertasModule() {
  const tablaBody = document.querySelector("#tablaAlertas tbody");
  const tarjetasResumen = document.getElementById("tarjetasResumen");

  try {
    const res = await fetch("http://localhost:5000/api/alertas", {
      credentials: "include"
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);
    const productos = await res.json();

    let totalCritico = 0;
    let totalBajo = 0;

    tablaBody.innerHTML = "";
    tarjetasResumen.innerHTML = "";

    productos.forEach(prod => {
      const stock = Number(prod.stock); // Aseguramos que sea número
      let colorStock = "";
      let mostrar = false;

      if (stock >= 0 && stock <= 10) { 
        colorStock = "danger"; 
        totalCritico++;
        mostrar = true;
      } else if (stock >= 11 && stock <= 20) { 
        colorStock = "warning"; 
        totalBajo++;
        mostrar = true;
      }

      if (mostrar) { // Solo agregamos filas de stock crítico o bajo
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${prod.nombre}</td>
          <td>${prod.descripcion}</td>
          <td class="text-${colorStock} fw-bold">${stock}</td>
          <td>
            <button class="btn btn-success btn-sm me-2">Atendido</button>
            <button class="btn btn-primary btn-sm">Llamar Proveedor</button>
          </td>
        `;
        tablaBody.appendChild(row);
      }
    });

    // Tarjetas resumen
    const tarjetasHTML = `
      <div class="col-md-6 mb-3">
        <div class="card text-white bg-danger shadow-sm">
          <div class="card-body text-center">
            <h5 class="card-title">Stock Crítico</h5>
            <p class="card-text display-6">${totalCritico}</p>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card text-dark bg-warning shadow-sm">
          <div class="card-body text-center">
            <h5 class="card-title">Stock Bajo</h5>
            <p class="card-text display-6">${totalBajo}</p>
          </div>
        </div>
      </div>
    `;
    tarjetasResumen.innerHTML = tarjetasHTML;

    // Actualizar contador de alertas
    actualizarContadorAlertas(totalCritico + totalBajo);

  } catch (err) {
    console.error("Error al cargar alertas:", err);
    tablaBody.innerHTML = `<tr><td colspan="4" class="text-danger">No se pudieron cargar las alertas</td></tr>`;
  }
}

function actualizarContadorAlertas(cantidad) {
  const contador = document.getElementById("contadorAlertas");
  if (!contador) return;

  if (cantidad > 0) {
    contador.textContent = cantidad;
    contador.style.display = "inline-block";
  } else {
    contador.style.display = "none";
  }
}

// Inicializar automáticamente si se carga el módulo
if (document.readyState !== 'loading') {
  initAlertasModule();
} else {
  document.addEventListener('DOMContentLoaded', initAlertasModule);
}
