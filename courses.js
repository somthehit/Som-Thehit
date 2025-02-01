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
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const category = button.dataset.category;
            filterCourses(category);
        });
    });

    // Initial load - show all courses
    filterCourses('all');
}); 