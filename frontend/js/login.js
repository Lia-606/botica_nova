document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!correo || !password) {
    alert('⚠️ Por favor, complete todos los campos.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Necesario para que se guarde la cookie del token
      body: JSON.stringify({ correo, password })
    });

    const data = await response.json();

    if (response.ok && data.message === 'Inicio de sesión exitoso') {
      alert('Inicio de sesión exitoso');
      // 🔒 Redirige al dashboard
      window.location.href = 'dashboard.html';
    } else {
      alert(` ${data.message || 'Credenciales inválidas'}`);
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error de conexión con el servidor');
  }
});
