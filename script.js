// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all links that have a hash (#) in their href
    const links = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each link
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Get the target element
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Product catalog view toggle functionality
    const priceViewBtn = document.getElementById('price-view');
    const trendViewBtn = document.getElementById('trend-view');
    
    if (priceViewBtn && trendViewBtn) {
        priceViewBtn.addEventListener('click', function() {
            priceViewBtn.classList.add('active');
            trendViewBtn.classList.remove('active');
            // Sort products by price logic would go here
            sortProductsByPrice();
        });
        
        trendViewBtn.addEventListener('click', function() {
            trendViewBtn.classList.add('active');
            priceViewBtn.classList.remove('active');
            // Sort products by trend logic would go here
            sortProductsByTrend();
        });
    }
    
    // Filter section toggle functionality
    const filterHeaders = document.querySelectorAll('.filter-section h3');
    
    filterHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const filterOptions = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (filterOptions.style.display === 'none') {
                filterOptions.style.display = 'flex';
                icon.className = 'fas fa-chevron-down';
            } else {
                filterOptions.style.display = 'none';
                icon.className = 'fas fa-chevron-right';
            }
        });
    });
    
    // Mobile menu toggle functionality (for responsive design)
    const mobileMenuToggle = document.createElement('div');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('header .container');
    const nav = document.querySelector('nav');
    
    // Only add mobile menu functionality if we're on a small screen
    if (window.innerWidth <= 768) {
        header.insertBefore(mobileMenuToggle, nav);
        nav.style.display = 'none';
        
        mobileMenuToggle.addEventListener('click', function() {
            if (nav.style.display === 'none') {
                nav.style.display = 'block';
                mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                nav.style.display = 'none';
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Simple testimonial slider functionality
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    // Only implement auto-scrolling if there are multiple testimonials
    if (testimonialCards.length > 1) {
        // Auto-scroll testimonials every 5 seconds
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            const slider = document.querySelector('.testimonial-slider');
            if (slider) {
                slider.scrollTo({
                    left: testimonialCards[currentTestimonial].offsetLeft,
                    behavior: 'smooth'
                });
            }
        }, 5000);
    }
    
    // Add hover effects to domain cards
    const domainCards = document.querySelectorAll('.domain-card');
    domainCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-10px)';
        });
    });

    const categoryLink = document.querySelector('.category-link');
    if (categoryLink) {
        const domain = document.querySelector('body').classList.contains('skincare') ? 'skincare' : 'cosmetics';
        if (domain === 'skincare') {
            categoryLink.setAttribute('href', 'category-selection-skincare.html');
        } else {
            categoryLink.setAttribute('href', 'category-selection-cosmetics.html');
        }
    }
});

// Function to sort products by price
function sortProductsByPrice() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    // Sort product cards by price (low to high)
    productCards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
        const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
        return priceA - priceB;
    });
    
    // Remove all current cards
    productCards.forEach(card => card.remove());
    
    // Add sorted cards back to the grid
    productCards.forEach(card => productsGrid.appendChild(card));
}

// Function to sort products by trend (rating)
function sortProductsByTrend() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
    
    // Sort product cards by rating (high to low)
    productCards.sort((a, b) => {
        // Extract rating count from the format (128), (94), etc.
        const ratingCountA = parseInt(a.querySelector('.product-rating span').textContent.replace(/[()]/g, ''));
        const ratingCountB = parseInt(b.querySelector('.product-rating span').textContent.replace(/[()]/g, ''));
        return ratingCountB - ratingCountA; // Higher rating count first
    });
    
    // Remove all current cards
    productCards.forEach(card => card.remove());
    
    // Add sorted cards back to the grid
    productCards.forEach(card => productsGrid.appendChild(card));
}