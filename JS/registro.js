document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const idNumber = document.getElementById('registerId').value;
      const nationality = document.getElementById('registerNationality').value;
      const email = document.getElementById('registerEmail').value;
      const phone = document.getElementById('registerPhone').value;
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('registerConfirmPassword').value;

      if (!name || !idNumber || !nationality || !email || !phone || !password) {
        Utils.showNotification('Completa todos los campos', 'error');
        return;
      }

      if (!Utils.isValidEmail(email)) {
        Utils.showNotification('Email inválido', 'error');
        return;
      }

      if (!Utils.isValidId(idNumber)) {
        Utils.showNotification('ID debe tener al menos 5 caracteres', 'error');
        return;
      }

      if (!Utils.isValidPhone(phone)) {
        Utils.showNotification('Teléfono inválido', 'error');
        return;
      }

      if (!Utils.isValidPassword(password)) {
        Utils.showNotification('Contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }

      if (password !== confirmPassword) {
        Utils.showNotification('Las contraseñas no coinciden', 'error');
        return;
      }

      const result = Auth.register({
        email,
        password,
        name,
        idNumber,
        nationality,
        phone,
        role: 'user'
      });

      if (result.success) {
        Utils.showNotification(result.message, 'success');
        setTimeout(() => Utils.redirect('login.html'), 1500);
      } else {
        Utils.showNotification(result.message, 'error');
      }
    });
  }
});
