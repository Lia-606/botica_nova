// ✅ dashboard.js — versión integrada con carga dinámica de módulos
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

// 📦 Navegación entre módulos
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

async function cargarModulo(modulo) {
  try {
    const vistaActiva = document.getElementById("vistaActiva");
    const rol = (window.rolUsuario || "").toLowerCase();

    const modulosPermitidosVendedor = ["inicio", "inventario", "ventas", "alertas"];

    // 🔒 Control de acceso
    if (rol === "vendedor" && !modulosPermitidosVendedor.includes(modulo)) {
      vistaActiva.innerHTML = `
        <div class="alert alert-danger text-center mt-3" role="alert">
          🚫 Acceso denegado: No tienes permisos para acceder a este módulo.
        </div>`;
      return;
    }

    // 📥 Cargar el HTML del módulo
    const rutaHTML = `${modulo}.html`;
    const res = await fetch(rutaHTML);
    if (!res.ok) throw new Error(`No se encontró el módulo "${modulo}"`);
    const html = await res.text();
    vistaActiva.innerHTML = html;

    // 🧩 Cargar el JS del módulo si existe
    const rutaJS = `/js/${modulo}.js`;

    if (modulo === "usuarios") {
      // 🔹 Import dinámico del módulo ES
      try {
        const moduloUsuarios = await import(rutaJS);
        if (moduloUsuarios.initUsuariosModule) {
          moduloUsuarios.initUsuariosModule();
        }
      } catch (err) {
        console.warn(`No se pudo cargar el módulo JS "${modulo}":`, err.message);
      }
    } else {
      // 🔹 Scripts no módulo ES
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
