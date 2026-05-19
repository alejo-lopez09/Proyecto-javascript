// ============================================
// UTILS.JS - Funciones Utilitarias
// ============================================

const Utils = {
  // Validar email
  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validar teléfono
  isValidPhone(phone) {
    const regex = /^[0-9+\-\s()]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  },

  // Validar ID
  isValidId(id) {
    return id && id.length >= 5;
  },

  // Validar contraseña
  isValidPassword(password) {
    return password && password.length >= 6;
  },

  // Formatear fecha
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  },

  // Calcular días entre fechas
  daysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Mostrar notificación
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    document.body.appendChild(notification);

    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });

    setTimeout(() => {
      notification.remove();
    }, 4000);
  },

  // Redirigir
  redirect(url) {
    window.location.href = url;
  },

  // Obtener parámetro de URL
  getUrlParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
};
