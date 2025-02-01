// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form validation and submission
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Here you would typically send the form data to a server
    alert('Message sent successfully!');
    contactForm.reset();
});

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate sections on scroll
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.5s ease-out';
    observer.observe(section);
});

// Add this to your existing script.js
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksA = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinksA.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Add active class to navigation links based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight/3)) {
            current = section.getAttribute('id');
        }
    });

    navLinksA.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Update the slider functionality
const projectsGrid = document.querySelector('.projects-grid');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const projectCards = document.querySelectorAll('.project-card');

let currentIndex = 0;
const getCardsPerView = () => window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
let cardsPerView = getCardsPerView();
const updateMaxIndex = () => projectCards.length - cardsPerView;
let maxIndex = updateMaxIndex();

function updateSlider() {
    const cardWidth = 100 / cardsPerView;
    const offset = currentIndex * cardWidth;
    projectsGrid.style.transform = `translateX(-${offset}%)`;
    
    // Update navigation buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
    
    // Update dots
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Create dots for navigation
const dotsContainer = document.querySelector('.project-dots');
dotsContainer.innerHTML = ''; // Clear existing dots
for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
    });
    dotsContainer.appendChild(dot);
}

// Navigation button event listeners
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
        cardsPerView = newCardsPerView;
        maxIndex = updateMaxIndex();
        currentIndex = Math.min(currentIndex, maxIndex);
        updateSlider();
        
        // Update dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        }
    }
});

// Initial setup
updateSlider();

// Authentication form handling
const authSection = document.getElementById('auth');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');
const navLoginBtn = document.querySelector('.nav-login-btn');
const closeButtons = document.querySelectorAll('.close-auth');

// Initially hide the auth section and forms
authSection.style.display = 'none';
loginForm.style.display = 'none';
signupForm.style.display = 'none';

// Login functionality
const loginBtn = document.querySelector('.nav-login-btn');

// Show auth section when login button is clicked
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authSection.style.display = 'flex';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

// Close auth section when close button is clicked
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        authSection.style.display = 'none';
    });
});

// Close auth section when clicking outside the form
authSection.addEventListener('click', (e) => {
    if (e.target === authSection) {
        authSection.style.display = 'none';
    }
});

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const user = await loginUser(email, password);
        if (user) {
            authSection.style.display = 'none';
            updateUIForLoggedInUser(user);
            showAlert('Login successful!', 'success');
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
});

// Show login form when nav login button is clicked
navLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authSection.style.display = 'flex';
    showForm(loginForm);
    hideForm(signupForm);
});

// Function to show a form
function showForm(form) {
    form.style.display = 'block';
    form.classList.add('active');
    form.classList.remove('inactive');
}

// Function to hide a form
function hideForm(form) {
    form.classList.remove('active');
    form.classList.add('inactive');
    setTimeout(() => {
        form.style.display = 'none';
    }, 500); // Match this with CSS animation duration
}

// Switch between login and signup forms
function switchForm(hideFormElement, showFormElement) {
    hideForm(hideFormElement);
    showForm(showFormElement);
}

// Event listeners for form switching
showSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(loginForm, signupForm);
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    switchForm(signupForm, loginForm);
});

// Close form when clicking the close button
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        authSection.style.display = 'none';
        hideForm(loginForm);
        hideForm(signupForm);
    });
});

// Close form when clicking outside
authSection.addEventListener('click', (e) => {
    if (e.target === authSection) {
        authSection.style.display = 'none';
        hideForm(loginForm);
        hideForm(signupForm);
    }
});

// Prevent form closing when clicking inside the form
loginForm.addEventListener('click', (e) => e.stopPropagation());
signupForm.addEventListener('click', (e) => e.stopPropagation());

// Add these variables at the top with other constants
const users = [
    { email: 'somthehit@gmail.com', password: '123456', name: 'Som Thehit' }
];
let currentUser = null;

// Update the login form validation and submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Basic validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    try {
        // Simulate API call
        const user = await loginUser(email, password);
        if (user) {
            currentUser = user;
            updateUIForLoggedInUser(user);
            showAlert('Login successful!', 'success');
            authSection.style.display = 'none';
            hideForm(loginForm);
            document.getElementById('login-form').reset();
        } else {
            showAlert('Invalid email or password', 'error');
        }
    } catch (error) {
        showAlert('Login failed. Please try again.', 'error');
    }
});

// Add these helper functions
function loginUser(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = users.find(u => u.email === email && u.password === password);
            resolve(user || null);
        }, 1000); // Simulate network delay
    });
}

function updateUIForLoggedInUser(user) {
    const navLoginBtn = document.querySelector('.nav-login-btn');
    navLoginBtn.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${user.name}</span>
        <i class="fas fa-chevron-down"></i>
    `;
    
    // Add user menu
    const userMenu = document.createElement('div');
    userMenu.className = 'user-menu';
    userMenu.innerHTML = `
        <div class="user-menu-item">${user.email}</div>
        <div class="user-menu-item" id="logout-btn">Logout</div>
    `;
    navLoginBtn.parentElement.appendChild(userMenu);
    
    // Add logout functionality
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Update button behavior
    navLoginBtn.removeEventListener('click', showLoginForm);
    navLoginBtn.addEventListener('click', toggleUserMenu);
}

function handleLogout() {
    currentUser = null;
    const navLoginBtn = document.querySelector('.nav-login-btn');
    navLoginBtn.innerHTML = `<i class="fas fa-user"></i> Login`;
    
    // Remove user menu
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) userMenu.remove();
    
    // Restore original login button behavior
    navLoginBtn.removeEventListener('click', toggleUserMenu);
    navLoginBtn.addEventListener('click', showLoginForm);
    
    showAlert('Logged out successfully', 'success');
}

function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('show');
}

function showLoginForm(e) {
    e.preventDefault();
    authSection.style.display = 'flex';
    showForm(loginForm);
    hideForm(signupForm);
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Show login form by default
document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth');
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    
    authSection.style.display = 'flex';
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

// Add these styles to your CSS 

// Courses filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const courseCards = document.querySelectorAll('.course-card');
    const coursesGrid = document.querySelector('.courses-grid');

    // Function to filter courses
    function filterCourses(category) {
        // First hide all courses with a fade-out effect
        courseCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
        });

        // Wait for fade-out animation
        setTimeout(() => {
            courseCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    // Trigger fade-in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // Update grid layout
            updateGridLayout();
        }, 300);
    }

    // Function to update grid layout
    function updateGridLayout() {
        const visibleCards = document.querySelectorAll('.course-card[style*="display: block"]');
        const totalCards = visibleCards.length;

        // Add "no courses" message if no courses are found
        const existingMessage = document.querySelector('.no-courses-message');
        if (totalCards === 0) {
            if (!existingMessage) {
                const message = document.createElement('div');
                message.className = 'no-courses-message';
                message.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No courses found in this category.</p>
                `;
                coursesGrid.appendChild(message);
            }
        } else if (existingMessage) {
            existingMessage.remove();
        }
    }

    // Add click event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Get the category from data attribute
            const category = button.dataset.category;
            
            // Update URL with category parameter
            const url = new URL(window.location.href);
            url.searchParams.set('category', category);
            window.history.pushState({}, '', url);

            // Filter the courses
            filterCourses(category);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const url = new URL(window.location.href);
        const category = url.searchParams.get('category') || 'all';
        
        // Update active button
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Filter courses
        filterCourses(category);
    });

    // Check URL parameters on page load
    const url = new URL(window.location.href);
    const initialCategory = url.searchParams.get('category') || 'all';
    if (initialCategory !== 'all') {
        const targetButton = document.querySelector(`.category-btn[data-category="${initialCategory}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}); 