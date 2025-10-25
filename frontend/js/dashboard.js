// dashboard.js — versión integrada con carga dinámica de módulos
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 🧩 Verificar sesión activa
    const res = await fetch("http://localhost:5000/api/usuarios/verificar", {
      credentials: "include"
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();

    if (!data.usuario || !data.usuario.rol) throw new Error("Datos inválidos");

    const usuario = data.usuario;
    const rol = usuario.rol.toLowerCase();
    window.rolUsuario = rol;

    // Mostrar nombre
    document.getElementById("nombreUsuario").textContent = `Bienvenido, ${usuario.nombre}`;

    // Mostrar/Ocultar módulos según rol
    const menuUsuarios = document.querySelector('[data-page="usuarios"]');
    const menuReportes = document.querySelector('[data-page="reportes"]');

    if (rol === "admin") {
      if (menuUsuarios) menuUsuarios.style.display = "";
      if (menuReportes) menuReportes.style.display = "";
    } else {
      if (menuUsuarios) menuUsuarios.style.display = "none";
      if (menuReportes) menuReportes.style.display = "none";
    }

    // Cerrar sesión
    document.getElementById("cerrarSesion").addEventListener("click", async () => {
      await fetch("http://localhost:5000/api/usuarios/logout", {
        method: "POST",
        credentials: "include"
      });
      window.location.href = "index.html";
    });

  } catch (err) {
    console.error("Error al verificar sesión:", err);
    window.location.href = "index.html";
  }
});

//  Navegación entre módulos
const navLinks = document.querySelectorAll('.nav-link');
const vistaActiva = document.getElementById('vistaActiva');

navLinks.forEach(link => {
  link.addEventListener('click', async e => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const modulo = link.getAttribute('data-page');
    await cargarModulo(modulo);
  });
});

async function actualizarContadorAlertas() {
  try {
    const res = await fetch("http://localhost:5000/api/alertas", {
      credentials: "include"
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const alertas = await res.json();

    const contador = document.getElementById("contadorAlertas");
    const cantidad = alertas.length;

    if (cantidad > 0) {
      contador.textContent = cantidad;
      contador.style.display = "inline-block"; // Mostrar
    } else {
      contador.style.display = "none"; // Ocultar si 0
    }
  } catch (err) {
    console.error("Error al actualizar contador de alertas:", err);
  }
}

// Llamar al cargar dashboard
document.addEventListener("DOMContentLoaded", async () => {
  // ... tu código existente de sesión
  await actualizarContadorAlertas();
});


async function cargarModulo(modulo) {
  try {
    const vistaActiva = document.getElementById("vistaActiva");
    const rol = (window.rolUsuario || "").toLowerCase();

    const modulosPermitidosVendedor = ["inicio", "inventario", "ventas", "alertas"];

    //  Control de acceso
    if (rol === "vendedor" && !modulosPermitidosVendedor.includes(modulo)) {
      vistaActiva.innerHTML = `
        <div class="alert alert-danger text-center mt-3" role="alert">
          Acceso denegado: No tienes permisos para acceder a este módulo.
        </div>`;
      return;
    }

    //  Cargar el HTML del módulo
    const rutaHTML = `${modulo}.html`;
    const res = await fetch(rutaHTML);
    if (!res.ok) throw new Error(`No se encontró el módulo "${modulo}"`);
    const html = await res.text();
    vistaActiva.innerHTML = html;

    //  Cargar el JS del módulo si existe
const rutaJS = `/js/${modulo}.js`;

try {
  const moduloJS = await import(rutaJS);

  if (modulo === "usuarios" && moduloJS.initUsuariosModule) {
    moduloJS.initUsuariosModule();
  } else if (modulo === "inventario" && moduloJS.initInventarioModule) {
    moduloJS.initInventarioModule();
  } else if (modulo === "ventas" && moduloJS.initVentasModule) {
    moduloJS.initVentasModule();
  } else if (modulo === "alertas" && moduloJS.initAlertasModule) {
    moduloJS.initAlertasModule();
  } else if (modulo === "reportes" && moduloJS.initReportesModule) {
    moduloJS.initReportesModule();
  } else if (modulo === "inicio" && moduloJS.initInicioModule) {
    moduloJS.initInicioModule(); // ✅ AÑADIDO AQUÍ
  } else if (moduloJS.initModule) {
    moduloJS.initModule();
  }
} catch (err) {
      console.warn(`No se pudo importar módulo JS "${modulo}":`, err.message);

      // Si no es un módulo ES, intenta cargarlo como script tradicional
      fetch(rutaJS)
        .then(r => {
          if (!r.ok) throw new Error("No encontrado");
          const script = document.createElement("script");
          script.src = rutaJS;
          document.body.appendChild(script);
        })
        .catch(() => {
          console.warn(`No existe JS para el módulo "${modulo}"`);
        });
    }

  } catch (err) {
    vistaActiva.innerHTML = `<p class="text-danger">Error al cargar módulo: ${err.message}</p>`;
    console.error("Error al cargar módulo:", err);
  }
}
