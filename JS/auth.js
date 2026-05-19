// ============================================
// AUTH.JS - Gestión de Autenticación
// ============================================

const Auth = {
  currentUser: null,

  init() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
    this.renderNavAuth();
  },

  login(email, password) {
    const user = Storage.getUserByEmail(email);
    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Contraseña incorrecta' };
    }
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.renderNavAuth();
    return { success: true, message: 'Sesión iniciada correctamente' };
  },

  register(userData) {
    if (Storage.getUserByEmail(userData.email)) {
      return { success: false, message: 'El email ya está registrado' };
    }
    Storage.addUser(userData);
    return { success: true, message: 'Registro exitoso. Por favor inicia sesión' };
  },

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.renderNavAuth();
    Utils.redirect('index.html');
  },

  isLoggedIn() {
    return this.currentUser !== null;
  },

  isAdmin() {
    return this.currentUser && this.currentUser.role === 'admin';
  },

  getCurrentUser() {
    return this.currentUser;
  },

  renderNavAuth() {
    const navAuth = document.getElementById('navAuth');
    if (!navAuth) return;

    if (this.isLoggedIn()) {
      navAuth.innerHTML = `
        <div class="nav-user">
          <span>${this.currentUser.name}</span>
          <div class="nav-dropdown">
            ${this.isAdmin() ? '<a href="admin.html">Panel Admin</a>' : ''}
            <a href="reservas.html">Mis Reservas</a>
            <a href="#" onclick="Auth.logout(); return false;">Cerrar Sesión</a>
          </div>
        </div>
      `;
    } else {
      navAuth.innerHTML = `
        <div class="nav-auth">
          <a href="login.html" class="btn-outline">Iniciar Sesión</a>
          <a href="registro.html" class="btn-primary">Registrarse</a>
        </div>
      `;
    }
  },

  checkAdminAccess() {
    if (!this.isAdmin()) {
      Utils.showNotification('Acceso denegado. Solo administradores', 'error');
      Utils.redirect('index.html');
      return false;
    }
    return true;
  }
};

// Inicializar auth al cargar
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
