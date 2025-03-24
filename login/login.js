document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  // Social login buttons
  const googleBtn = document.querySelector('.social-button.google');
  const appleBtn = document.querySelector('.social-button.apple');
  const twitterBtn = document.querySelector('.social-button.twitter');

  // Form submission
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Basic validation
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      return;
    }
    
    if (passwordInput.value.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters');
      return;
    }
    
    // If validation passes, simulate login
    simulateLogin(emailInput.value, passwordInput.value);
  });
  
  // Social login handlers
  googleBtn.addEventListener('click', function() {
    socialLogin('google');
  });
  
  appleBtn.addEventListener('click', function() {
    socialLogin('apple');
  });
  
  twitterBtn.addEventListener('click', function() {
    socialLogin('twitter');
  });
  
  // Helper functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function showError(inputElement, message) {
    // Remove any existing error message
    const parent = inputElement.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Create new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '12px';
    errorElement.style.marginTop = '5px';
    errorElement.style.marginLeft = '10px';
    
    // Insert error after input
    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    
    // Highlight input
    inputElement.style.borderColor = 'red';
    
    // Clear error after 3 seconds
    setTimeout(() => {
      errorElement.remove();
      inputElement.style.borderColor = '';
    }, 3000);
  }
  
  function simulateLogin(email, password) {
    // In a real application, you would send these credentials to your server
    console.log('Login attempt:', { email, password });
    
    // For demo purposes, we'll just redirect to # after a short delay
    const loginButton = document.querySelector('.login-button');
    loginButton.value = 'Signing in...';
    loginButton.disabled = true;
    
    setTimeout(() => {
      window.location.href = '#';
      loginButton.value = 'Sign In';
      loginButton.disabled = false;
      
      // Display success message
      showSuccessMessage('Login successful!');
    }, 1500);
  }
  
  function socialLogin(provider) {
    console.log(`Attempting to login with ${provider}`);
    
    // In a real application, you would implement OAuth flow with the provider
    // For demo purposes, we'll just redirect to # after a short delay
    setTimeout(() => {
      window.location.href = '#';
      
      // Display success message
      showSuccessMessage(`${provider} login successful!`);
    }, 1500);
  }
  
  function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.backgroundColor = '#4CAF50';
    successDiv.style.color = 'white';
    successDiv.style.padding = '10px';
    successDiv.style.borderRadius = '4px';
    successDiv.style.textAlign = 'center';
    successDiv.style.position = 'fixed';
    successDiv.style.top = '20px';
    successDiv.style.left = '50%';
    successDiv.style.transform = 'translateX(-50%)';
    successDiv.style.zIndex = '1000';
    
    // Add to body
    document.body.appendChild(successDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }
}); 