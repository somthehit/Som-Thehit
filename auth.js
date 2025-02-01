document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const container = document.querySelector('.container');
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    // Test user data (replace with backend integration)
    const users = [
        { email: 'somthehit@gmail.com', password: '123456', name: 'Som Thehit' }
    ];

    // Event Listeners
    if (signUpButton) {
        signUpButton.addEventListener('click', () => {
            container.classList.add('right-panel-active');
        });
    }

    if (signInButton) {
        signInButton.addEventListener('click', () => {
            container.classList.remove('right-panel-active');
        });
    }

    // Login Form Handler
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!validateLoginInput(email, password)) return;

        try {
            const user = await loginUser(email, password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showAlert('Invalid email or password', 'error');
            }
        } catch (error) {
            showAlert('Login failed. Please try again.', 'error');
        }
    });

    // Signup Form Handler
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;

        if (!validateSignupInput(name, email, password, confirm)) return;

        // Simulate signup success (replace with actual signup logic)
        showAlert('Sign up successful! Please login.', 'success');
        setTimeout(() => {
            container.classList.remove('right-panel-active');
            signupForm.reset();
        }, 1500);
    });

    // Validation Functions
    function validateLoginInput(email, password) {
        resetErrors();
        let isValid = true;

        if (!email) {
            showInputError('login-email-error', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showInputError('login-email-error', 'Please enter a valid email');
            isValid = false;
        }

        if (!password) {
            showInputError('login-password-error', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    function validateSignupInput(name, email, password, confirm) {
        if (!name || !email || !password || !confirm) {
            showAlert('Please fill in all fields', 'error');
            return false;
        }
        if (!isValidEmail(email)) {
            showAlert('Please enter a valid email address', 'error');
            return false;
        }
        if (password !== confirm) {
            showAlert('Passwords do not match', 'error');
            return false;
        }
        if (password.length < 6) {
            showAlert('Password must be at least 6 characters long', 'error');
            return false;
        }
        return true;
    }

    // Helper Functions
    function loginUser(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = users.find(u => u.email === email && u.password === password);
                resolve(user || null);
            }, 1000);
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showInputError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function resetErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => alertDiv.classList.add('show'), 10);
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }
}); 