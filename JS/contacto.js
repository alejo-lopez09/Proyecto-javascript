document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const phone = document.getElementById('contactPhone').value;
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value;

      if (!Utils.isValidEmail(email)) {
        Utils.showNotification('Email inválido', 'error');
        return;
      }

      if (!Utils.isValidPhone(phone)) {
        Utils.showNotification('Teléfono inválido', 'error');
        return;
      }

      Storage.addMessage({ name, email, phone, subject, message });
      Utils.showNotification('Mensaje enviado correctamente', 'success');
      form.reset();
    });
  }
});
