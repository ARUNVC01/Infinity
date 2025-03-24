document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  // Social login buttons
  const googleBtn = document.querySelector('.social-button.google');
  const appleBtn = document.querySelector('.social-button.apple');
  const twitterBtn = document.querySelector('.social-button.twitter');

  // Form submission
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validation
    let isValid = true;
    
    // Name validation
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'Name must be at least 2 characters');
      isValid = false;
    }
    
    // Email validation
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      isValid = false;
    }
    
    // Password validation
    if (passwordInput.value.length < 6) {
      showError(passwordInput, 'Password must be at least 6 characters');
      isValid = false;
    }
    
    // Confirm password
    if (passwordInput.value !== confirmPasswordInput.value) {
      showError(confirmPasswordInput, 'Passwords do not match');
      isValid = false;
    }
    
    // If all validation passes
    if (isValid) {
      registerUser();
    }
  });
  
  // Social signup handlers
  googleBtn.addEventListener('click', function() {
    socialSignup('google');
  });
  
  appleBtn.addEventListener('click', function() {
    socialSignup('apple');
  });
  
  twitterBtn.addEventListener('click', function() {
    socialSignup('twitter');
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
  
  function registerUser() {
    // In a real application, you would send registration data to your server
    console.log('Registration attempt:', { 
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value
    });
    
    // For demo purposes, we'll just redirect to # after a short delay
    const signupButton = document.querySelector('.login-button');
    signupButton.value = 'Creating account...';
    signupButton.disabled = true;
    
    setTimeout(() => {
      window.location.href = '#';
      signupButton.value = 'Sign Up';
      signupButton.disabled = false;
      
      // Display success message
      showSuccessMessage('Account created successfully!');
    }, 1500);
  }
  
  function socialSignup(provider) {
    console.log(`Attempting to sign up with ${provider}`);
    
    // In a real application, you would implement OAuth flow with the provider
    // For demo purposes, we'll just redirect to # after a short delay
    setTimeout(() => {
      window.location.href = '#';
      
      // Display success message
      showSuccessMessage(`${provider} signup successful!`);
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