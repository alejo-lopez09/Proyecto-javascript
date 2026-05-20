document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      if (!Utils.isValidEmail(email)) {
        Utils.showNotification('Email inválido', 'error');
        return;
      }

      const result = Auth.login(email, password);
      if (result.success) {
        Utils.showNotification(result.message, 'success');
        setTimeout(() => {
          if (Auth.isAdmin()) {
            Utils.redirect('admin.html');
          } else {
            Utils.redirect('reservas.html');
          }
        }, 1000);
      } else {
        Utils.showNotification(result.message, 'error');
      }
    });
  }
});

