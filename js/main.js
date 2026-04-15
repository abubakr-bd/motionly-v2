// main.js

document.addEventListener('DOMContentLoaded', () => {

  // Mobile Navigation Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Smooth Scroll and Navbar Style changes on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.padding = '1rem 5%';
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
    } else {
      navbar.style.padding = '1.5rem 5%';
      navbar.style.boxShadow = 'none';
    }
  });

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  const watchElements = document.querySelectorAll('.animate-on-scroll');
  watchElements.forEach(el => observer.observe(el));

  // Init Before/After Sliders
  const baContainers = document.querySelectorAll('.ba-container');
  baContainers.forEach(container => {
    const afterImg = container.querySelector('.ba-after');
    const sliderHandle = container.querySelector('.ba-slider-handle');

    let isDragging = false;

    // Mouse events
    sliderHandle.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    
    // Touch events
    sliderHandle.addEventListener('touchstart', () => { isDragging = true; });
    window.addEventListener('touchend', () => { isDragging = false; });

    const moveSlider = (x) => {
      if (!isDragging) return;
      const rect = container.getBoundingClientRect();
      let pos = x - rect.left;
      
      // Clamp values
      if (pos < 0) pos = 0;
      if (pos > rect.width) pos = rect.width;
      
      const percentage = (pos / rect.width) * 100;
      
      afterImg.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
      sliderHandle.style.left = `${percentage}%`;
    };

    window.addEventListener('mousemove', (e) => moveSlider(e.clientX));
    window.addEventListener('touchmove', (e) => {
      if(isDragging) {
        moveSlider(e.touches[0].clientX);
      }
    }, { passive: false });
  });

  // FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-question');
  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const answer = item.nextElementSibling;
      const svg = item.querySelector('svg');
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
        svg.style.transform = 'rotate(0deg)';
      } else {
        answer.style.display = 'block';
        svg.style.transform = 'rotate(180deg)';
        svg.style.transition = 'transform 0.3s';
      }
    });
  });

  // Portfolio Filters
  const pills = document.querySelectorAll('.pill');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Manage active pill styling
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterType = pill.getAttribute('data-filter');

      // Filter the grid items
      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterType === 'all' || filterType === category) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // Wait for transition before removing from flow
        }
      });
    });
  });

  // Goodbye Section Infinite Carousel Engine
  const originalGbItems = Array.from(document.querySelectorAll('.gb-item'));
  if(originalGbItems.length > 0) {
    const listWrapper = document.querySelector('.goodbye-list');

    // Remove any previous scroll listeners related to it (if we were dynamically adding them, but here we just replace the block)
    
    // Clone for infinite scroll without adding the SVG stroke
    originalGbItems.forEach(item => {
        listWrapper.appendChild(item.cloneNode(true));
    });

    const allItems = document.querySelectorAll('.gb-item');
    let currentIndex = 0;
    const totalOriginal = originalGbItems.length;

    // Start with the first item active
    allItems[0].classList.add('active');

    // Read the exact gap step height based on DOM offsets
    setTimeout(() => {
        const stepHeight = allItems[1].offsetTop - allItems[0].offsetTop;
        const initialOffset = -(allItems[0].offsetHeight / 2);

        // Pre-apply initial state to fix any -50% CSS jitter
        listWrapper.style.transform = `translateY(${initialOffset}px)`;

        setInterval(() => {
            currentIndex++;
            listWrapper.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            
            let shiftY = -(currentIndex * stepHeight);
            listWrapper.style.transform = `translateY(${initialOffset + shiftY}px)`;

            // Apply active class to the current center item
            allItems.forEach((it, idx) => {
                if(idx === currentIndex) {
                    it.classList.add('active');
                } else {
                    it.classList.remove('active');
                }
            });

            // Seamless infinite loop reset
            if (currentIndex === totalOriginal) {
                setTimeout(() => {
                    listWrapper.style.transition = 'none';
                    currentIndex = 0;
                    listWrapper.style.transform = `translateY(${initialOffset}px)`;
                    
                    allItems.forEach(it => it.classList.remove('active'));
                    allItems[0].classList.add('active');
                }, 400); // Match transiton time
            }
        }, 1200); // Reduced interval for much faster animation
    }, 100);
  }

  // Global Cursor Blob Physics Tracking
  const cursorBlob = document.getElementById('cursor-blob');
  if(cursorBlob) {
    // Only animate on non-touch devices for performance
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener('mousemove', (e) => {
        // Use requestAnimationFrame for buttery smooth performance
        requestAnimationFrame(() => {
          // Keep it centered on the cursor
          cursorBlob.style.left = `${e.clientX}px`;
          cursorBlob.style.top = `${e.clientY}px`;
        });
      });

      // Interactive squish effect when clicking
      window.addEventListener('mousedown', () => {
        cursorBlob.style.transform = 'translate(-50%, -50%) scale(0.8)';
      });
      window.addEventListener('mouseup', () => {
        cursorBlob.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    } else {
        // Hide on mobile or touch environments
        cursorBlob.style.display = 'none';
    }
  }

  // V/S Section Reactive Scroll Animation
  const vsContainer = document.querySelector('.vs-container');
  const animLeft = document.querySelector('.vs-anim-left');
  const animRight = document.querySelector('.vs-anim-right');
  const animBadge = document.querySelector('.vs-anim-badge');
  const animLine = document.querySelector('.vs-anim-line');

  if (vsContainer && animLeft && animRight) {
      window.addEventListener('scroll', () => {
          const rect = vsContainer.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Start animation when section is 40% visible (top = 60% of windowHeight)
          // Complete animation when section top hits 15% of windowHeight
          let startP = windowHeight * 0.7;
          let endP = windowHeight * 0.15;
          
          // Calculate progress 0 -> 1
          let progress = (startP - rect.top) / (startP - endP);
          
          // Clamp progress
          if (progress < 0) progress = 0;
          if (progress > 1) progress = 1;

          // Apply a Quartic Ease-Out curve so the motion heavily decelerates into its final position for maximum smoothness
          const easedProgress = 1 - Math.pow(1 - progress, 4);

          // progress = 0: Fully rotated and pushed away
          // progress = 1: Perfectly assembled
          const invProgress = 1 - easedProgress;

          // Left Card: Rotates -30deg, moves left and down
          const rotateLeft = -30 * invProgress;
          const xLeft = -250 * invProgress;
          const yLeft = 150 * invProgress;

          // Right Card: Rotates +30deg, moves right and down
          const rotateRight = 30 * invProgress;
          const xRight = 250 * invProgress;
          const yRight = 150 * invProgress;

          // Opacity fade in
          let opacity = progress * 1.5;
          if (opacity > 1) opacity = 1;

          // Map transforms
          animLeft.style.transform = `translate(${xLeft}px, ${yLeft}px) rotate(${rotateLeft}deg)`;
          animLeft.style.opacity = opacity;

          animRight.style.transform = `translate(${xRight}px, ${yRight}px) rotate(${rotateRight}deg)`;
          animRight.style.opacity = opacity;

          // Badge and Line pop in slightly late
          const badgeProgress = Math.max(0, (progress - 0.5) * 2);
          if (animBadge && animLine) {
              animBadge.style.transform = `scale(${badgeProgress})`;
              animLine.style.opacity = badgeProgress;
          }
      });
      // Fire on load
      window.dispatchEvent(new Event('scroll'));
  }

});
