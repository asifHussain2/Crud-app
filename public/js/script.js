// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submissions
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', handleRegisterSubmit);
    }
  
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLoginSubmit);
    }
  });
  
  function handleRegisterSubmit(event) {
    event.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        showError(data.error);
      } else {
        showSuccess(data.message);
        resetForm(event.target);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError('An error occurred. Please try again later.');
    });
  }
  
  function handleLoginSubmit(event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('token', data.token); // Example: Save token to localStorage
      window.location.href = '/dashboard'; // Redirect to dashboard or profile page
    })
    .catch(error => {
      console.error('Error:', error);
      showError('Invalid credentials');
    });
  }
  
  function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
  
  function showSuccess(message) {
    const successElement = document.getElementById('success-message');
    successElement.textContent = message;
    successElement.style.display = 'block';
  }
  
  function resetForm(form) {
    form.reset();
    const errorElement = document.getElementById('error-message');
    errorElement.style.display = 'none';
    const successElement = document.getElementById('success-message');
    successElement.style.display = 'none';
  }
  