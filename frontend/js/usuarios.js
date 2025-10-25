//  usuarios.js
export async function initUsuariosModule() {
  console.log("🔹 Módulo Usuarios inicializado correctamente");

  const usuarioForm = document.getElementById("usuarioForm");
  const tablaUsuarios = document.querySelector("#tablaUsuarios tbody");
  const usuarioIdInput = document.getElementById("usuarioId");

  if (!usuarioForm || !tablaUsuarios) {
    console.warn("⚠️ No se encontró el formulario o la tabla en usuarios.html");
    return;
  }

  let usuarios = [];

  //  Listar usuarios
  const listarUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/usuarios/listar", { credentials: "include" });
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      usuarios = data.usuarios || [];

      tablaUsuarios.innerHTML = "";
      usuarios.forEach(u => {
        tablaUsuarios.innerHTML += `
          <tr>
            <td>${u.nombre}</td>
            <td>${u.correo}</td>
            <td>${u.rol}</td>
            <td>${u.estado}</td>
            <td>${new Date(u.fechaRegistro).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-sm btn-warning btn-edit me-1" data-id="${u._id}">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-sm btn-secondary btn-toggle" data-id="${u._id}">
                ${u.estado === "activo" ? "Desactivar" : "Activar"}
              </button>
            </td>
          </tr>`;
      });
      agregarEventos();
    } catch (err) {
      console.error(" Error al listar usuarios:", err);
    }
  };

  const agregarEventos = () => {
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", () => {
        const usuario = usuarios.find(u => u._id === btn.dataset.id);
        if (!usuario) return;
        usuarioIdInput.value = usuario._id;
        document.getElementById("nombre").value = usuario.nombre;
        document.getElementById("correo").value = usuario.correo;
        document.getElementById("rol").value = usuario.rol;
        document.getElementById("estado").value = usuario.estado;
      });
    });

    document.querySelectorAll(".btn-toggle").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const usuario = usuarios.find(u => u._id === id);
        if (!usuario) return;
        const nuevoEstado = usuario.estado === "activo" ? "inactivo" : "activo";
        await fetch(`http://localhost:5000/api/usuarios/estado/${id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado })
        });
        listarUsuarios();
      });
    });
  };

  usuarioForm.addEventListener("submit", async e => {
    e.preventDefault();
    const id = usuarioIdInput.value;
    const usuarioData = {
      nombre: document.getElementById("nombre").value,
      correo: document.getElementById("correo").value,
      password: document.getElementById("password").value,
      rol: document.getElementById("rol").value,
      estado: document.getElementById("estado").value
    };

    try {
      const url = id
        ? `http://localhost:5000/api/usuarios/editar/${id}`
        : "http://localhost:5000/api/usuarios/registrar";
      const method = id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioData)
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Error al guardar usuario");
        return;
      }

      usuarioForm.reset();
      usuarioIdInput.value = "";
      listarUsuarios();
    } catch (err) {
      console.error(" Error al guardar usuario:", err);
    }
  });

  listarUsuarios();
}
