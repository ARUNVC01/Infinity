document.addEventListener('DOMContentLoaded', function() {
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const emailInput = document.getElementById('email');
  
  forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Email validation
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address');
      return;
    }
    
    // If validation passes, simulate password reset request
    sendResetLink(emailInput.value);
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
  
  function sendResetLink(email) {
    // In a real application, you would send this request to your server
    console.log('Reset password request for:', email);
    
    // Change button state
    const resetButton = document.querySelector('.login-button');
    resetButton.value = 'Sending...';
    resetButton.disabled = true;
    
    // Simulate server response
    setTimeout(() => {
      // Create a success message
      const container = document.querySelector('.container');
      const form = document.querySelector('.form');
      
      // Hide the form
      form.style.display = 'none';
      
      // Create success message
      const successDiv = document.createElement('div');
      successDiv.className = 'success-message';
      successDiv.innerHTML = `
        <p style="text-align: center; color: #12B1D1; margin-bottom: 20px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </p>
        <p style="text-align: center; font-size: 14px; color: #333; margin-bottom: 20px;">
          Password reset link has been sent to <strong>${email}</strong>. Please check your email.
        </p>
        <button class="login-button" onclick="window.location.href='login.html'" style="width: 100%; cursor: pointer;">
          Return to Login
        </button>
      `;
      
      // Add the success message to the container
      container.appendChild(successDiv);
    }, 1500);
  }
}); 