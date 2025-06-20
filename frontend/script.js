document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('nav .nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('header');

    let headerHeight = header ? header.offsetHeight : 70; // Default if header not found

    // Mobile menu toggle
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('open');
            menuToggle.classList.toggle('open');
            const isExpanded = navList.classList.contains('open');
            menuToggle.setAttribute('aria-expanded', String(isExpanded));
        });
    }

    // Update header height dynamically (e.g., on resize) and set CSS variable
    function updateHeaderHeight() {
        if (header) {
            headerHeight = header.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        }
    }

    updateHeaderHeight(); // Initial call
    window.addEventListener('resize', updateHeaderHeight);


    // Active link highlighting based on current page URL
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        // Remove active class from all links first
        link.classList.remove('active');

        // Determine if the link's href matches the current path
        // Normalize paths: treat "" as "index.html" for root
        const linkPath = link.getAttribute('href');
        const normalizedLinkPath = linkPath === '/' || linkPath === '/index.html' ? '/index.html' : linkPath;
        const normalizedCurrentPath = currentPath === '/' || currentPath === '/index.html' ? '/index.html' : currentPath;

        // Check if the current path starts with the link path
        // This handles cases like /articles/some-article matching /articles.html
        // Ensure we don't match /articles.html with /articles-other.html unintentionally
        const linkPathSegment = normalizedLinkPath.endsWith('.html') ? normalizedLinkPath.slice(0, -5) : normalizedLinkPath;
        const currentPathSegment = normalizedCurrentPath.endsWith('.html') ? normalizedCurrentPath.slice(0, -5) : normalizedCurrentPath;

        if (currentPathSegment === linkPathSegment || (currentPathSegment === '/index' && linkPathSegment === '/')) {
            link.classList.add('active');
        } else if (currentPathSegment.startsWith(linkPathSegment + '/')) {
            link.classList.add('active');
        }


        // Close mobile menu when a link is clicked (only necessary for mobile view)
         if (link.tagName === 'A') {
            link.addEventListener('click', () => {
                if (navList && navList.classList.contains('open')) {
                    navList.classList.remove('open');
                    if (menuToggle) {
                        menuToggle.classList.remove('open');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            });
         }
    });


    // --- Slideshow Functionality ---
    const slideshowWrapper = document.querySelector('.slides-wrapper');
    const slides = document.querySelectorAll('.article-miniature');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const dotsContainer = document.querySelector('.pagination-dots');

    if (slideshowWrapper && slides.length > 0 && prevButton && nextButton && dotsContainer) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoSlideInterval = null; // Variable to hold the interval timer

        // Create pagination dots
        dotsContainer.innerHTML = ''; // Clear existing dots before creating new ones
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('data-index', i);
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.dot');

        // Function to update slide display
        function updateSlideshow() {
            const offset = -currentIndex * 100; // Shift by 100% for each slide
            slideshowWrapper.style.transform = `translateX(${offset}%)`;

            // Update active dot
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                 dots[currentIndex].classList.add('active');
            }
        }

        // Function to advance to the next slide
        function goToNextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlideshow();
        }

        // Function to start the auto slideshow
        function startAutoSlide() {
            // Clear any existing interval first
            stopAutoSlide();
            autoSlideInterval = setInterval(goToNextSlide, 10000); // 10000 milliseconds = 10 seconds
        }

        // Function to stop the auto slideshow
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }

        // Function to stop the slideshow and restart it after a delay (e.g., after user interaction)
        function resetAutoSlide() {
             stopAutoSlide();
             // Wait a moment before restarting in case of rapid clicks
             setTimeout(startAutoSlide, 500); // Wait 0.5 seconds
        }

        // Add event listeners to buttons
        nextButton.addEventListener('click', () => {
            goToNextSlide();
            resetAutoSlide(); // Reset timer on user interaction
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Go to previous slide
            updateSlideshow(); // Update display
            resetAutoSlide(); // Reset timer on user interaction
        });

        // Add event listeners to dots
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (!isNaN(index) && index !== currentIndex) { // Only update if it's a different dot
                    currentIndex = index;
                    updateSlideshow();
                    resetAutoSlide(); // Reset timer on user interaction
                } else if (index === currentIndex) {
                    // If clicking the active dot, still reset the timer
                    resetAutoSlide();
                }
            });
        });

        // Initial display
        updateSlideshow();
        // Start auto slideshow on page load
        startAutoSlide();

        // Stop auto-slide when mouse is over the slideshow area
        slideshowWrapper.parentElement.addEventListener('mouseenter', stopAutoSlide);
        slideshowWrapper.parentElement.addEventListener('mouseleave', startAutoSlide);
    }
   document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".article-slider");
  const cards = document.querySelectorAll(".article-miniature");

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      slider.classList.add("hovering");
    });

    slider.addEventListener("mouseleave", () => {
      slider.classList.remove("hovering");
    });
  });
});


});