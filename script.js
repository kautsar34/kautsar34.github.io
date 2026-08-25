/**
 * PORTFOLIO JAVASCRIPT - Kautsar Putra Ramadhan
 * Comprehensive interactive script handling theme, navigation, modals,
 * filters, carousels, and micro-interactions.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. THEME SWITCHER (Dark / Light Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;
    const htmlElement = document.documentElement;

    // Check saved theme in localStorage or system preference
    const savedTheme = localStorage.getItem("portfolio-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
        htmlElement.setAttribute("data-theme", savedTheme);
        updateThemeIcon(savedTheme);
    } else if (systemPrefersDark) {
        htmlElement.setAttribute("data-theme", "dark");
        updateThemeIcon("dark");
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = htmlElement.getAttribute("data-theme") || "light";
            const newTheme = currentTheme === "light" ? "dark" : "light";
            
            htmlElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("portfolio-theme", newTheme);
            updateThemeIcon(newTheme);
            showToast(`Mode ${newTheme === "dark" ? "Gelap (Dark)" : "Terang (Light)"} aktif!`);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === "dark") {
            themeIcon.className = "fa-solid fa-sun";
            themeIcon.style.color = "#F59E0B";
        } else {
            themeIcon.className = "fa-solid fa-moon";
            themeIcon.style.color = "";
        }
    }


    // ==========================================
    // 2. NAVBAR SCROLL & MOBILE MENU
    // ==========================================
    const navbar = document.getElementById("navbar");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const navBackdrop = document.getElementById("nav-backdrop");
    const navLinks = document.querySelectorAll(".nav-link");

    // Sticky Navbar shadow on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Mobile Menu Toggle
    function openMobileMenu() {
        if (navMenu && navBackdrop) {
            navMenu.classList.add("active");
            navBackdrop.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeMobileMenu() {
        if (navMenu && navBackdrop) {
            navMenu.classList.remove("active");
            navBackdrop.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => {
            if (navMenu.classList.contains("active")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (navBackdrop) {
        navBackdrop.addEventListener("click", closeMobileMenu);
    }

    // Close mobile menu on nav link click
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });


    // ==========================================
    // 3. SCROLLSPY (Active Navigation Indicator)
    // ==========================================
    const sections = document.querySelectorAll("section[id]");

    function highlightActiveNavLink() {
        const scrollY = window.pageYOffset + 140;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute("id");
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove("active"));
                    correspondingLink.classList.add("active");
                }
            }
        });
    }

    window.addEventListener("scroll", highlightActiveNavLink);


    // ==========================================
    // 4. MULTI-ROLE TYPING EFFECT
    // ==========================================
    const textElement = document.getElementById("typing-text");
    const roles = [
        "Frontend Developer",
        "UI/UX Designer",
        "System Analyst",
        "WordPress Specialist"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!textElement) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            textElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 45 : 90;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2200; // Pause when role completes
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();


    // ==========================================
    // 5. CAROUSEL COMPONENT (Skills & Projects)
    // ==========================================
    class CardCarousel {
        constructor(wrapperId, options = {}) {
            this.wrapper = document.getElementById(wrapperId);
            if (!this.wrapper) return;

            this.viewport = this.wrapper.querySelector('.cards-carousel-viewport');
            this.track = this.wrapper.querySelector('.cards-carousel-track');
            this.prevBtn = this.wrapper.querySelector('.carousel-nav-arrow.prev');
            this.nextBtn = this.wrapper.querySelector('.carousel-nav-arrow.next');
            this.dotsContainer = document.getElementById(options.dotsId);

            this.currentIndex = 0;
            this.autoPlay = options.autoPlay || false;
            this.autoPlayDelay = options.autoPlayDelay || 6000;
            this.autoPlayTimer = null;

            // Drag state
            this.isPointerDown = false;
            this.startX = 0;
            this.scrollLeftStart = 0;
            this.dragDistance = 0;

            this.init();
        }

        getVisibleCards() {
            if (!this.track) return [];
            return Array.from(this.track.children).filter(child => {
                return window.getComputedStyle(child).display !== 'none';
            });
        }

        getItemsPerView() {
            if (!this.viewport || !this.track) return 1;
            const cards = this.getVisibleCards();
            if (cards.length === 0) return 1;
            
            const cardWidth = cards[0].offsetWidth;
            const viewportWidth = this.viewport.offsetWidth;
            const count = Math.round(viewportWidth / (cardWidth || 1));
            return Math.max(1, Math.min(count, cards.length));
        }

        getMaxIndex() {
            const cards = this.getVisibleCards();
            const itemsPerView = this.getItemsPerView();
            return Math.max(0, cards.length - itemsPerView);
        }

        init() {
            if (!this.viewport || !this.track) return;

            // Arrow button events
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.prev();
                    this.resetAutoPlay();
                });
            }

            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.next();
                    this.resetAutoPlay();
                });
            }

            // Viewport scroll sync
            let scrollDebounce;
            this.viewport.addEventListener('scroll', () => {
                clearTimeout(scrollDebounce);
                scrollDebounce = setTimeout(() => {
                    this.syncWithScroll();
                }, 60);
            }, { passive: true });

            // Mouse Drag handling
            this.viewport.addEventListener('mousedown', (e) => {
                if (e.target.closest('button, a, .carousel-btn, .carousel-indicator')) return;

                this.isPointerDown = true;
                this.startX = e.pageX - this.viewport.offsetLeft;
                this.scrollLeftStart = this.viewport.scrollLeft;
                this.dragDistance = 0;
                this.viewport.classList.add('is-dragging');
                this.stopAutoPlay();
            });

            window.addEventListener('mousemove', (e) => {
                if (!this.isPointerDown) return;
                const x = e.pageX - this.viewport.offsetLeft;
                const walk = (x - this.startX) * 1.2;
                this.dragDistance = Math.abs(walk);
                this.viewport.scrollLeft = this.scrollLeftStart - walk;
            });

            window.addEventListener('mouseup', () => {
                if (!this.isPointerDown) return;
                this.isPointerDown = false;
                this.viewport.classList.remove('is-dragging');
                this.snapToNearestCard();
                this.resetAutoPlay();
            });

            // Prevent unwanted click triggers after dragging
            this.viewport.addEventListener('click', (e) => {
                if (this.dragDistance > 8) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }, true);

            // Touch events for mobile
            this.viewport.addEventListener('touchstart', () => {
                this.stopAutoPlay();
            }, { passive: true });

            this.viewport.addEventListener('touchend', () => {
                this.resetAutoPlay();
            }, { passive: true });

            // Window resize handler
            window.addEventListener('resize', () => {
                this.update();
            });

            this.update();
            this.startAutoPlay();
        }

        update() {
            this.buildDots();
            this.updateButtonStates();
            this.updateActiveDot();
        }

        buildDots() {
            if (!this.dotsContainer) return;
            this.dotsContainer.innerHTML = '';

            const maxIndex = this.getMaxIndex();
            const totalDots = maxIndex + 1;

            if (totalDots <= 1) {
                this.dotsContainer.style.display = 'none';
                return;
            }

            this.dotsContainer.style.display = 'flex';

            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${i === this.currentIndex ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Pindah ke slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    this.goToIndex(i);
                    this.resetAutoPlay();
                });
                this.dotsContainer.appendChild(dot);
            }
        }

        updateButtonStates() {
            const maxIndex = this.getMaxIndex();
            const hasMultiple = maxIndex > 0;

            if (this.prevBtn) {
                this.prevBtn.disabled = !hasMultiple || this.currentIndex <= 0;
                this.prevBtn.classList.toggle('disabled', !hasMultiple || this.currentIndex <= 0);
            }

            if (this.nextBtn) {
                this.nextBtn.disabled = !hasMultiple || this.currentIndex >= maxIndex;
                this.nextBtn.classList.toggle('disabled', !hasMultiple || this.currentIndex >= maxIndex);
            }
        }

        updateActiveDot() {
            if (!this.dotsContainer) return;
            const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === this.currentIndex);
            });
        }

        goToIndex(index) {
            const cards = this.getVisibleCards();
            const maxIndex = this.getMaxIndex();
            this.currentIndex = Math.max(0, Math.min(index, maxIndex));

            if (cards.length > 0 && cards[this.currentIndex]) {
                const targetCard = cards[this.currentIndex];
                const targetScroll = targetCard.offsetLeft - this.track.offsetLeft;
                this.viewport.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            }

            this.updateButtonStates();
            this.updateActiveDot();
        }

        next() {
            const maxIndex = this.getMaxIndex();
            if (this.currentIndex < maxIndex) {
                this.goToIndex(this.currentIndex + 1);
            } else if (this.autoPlay) {
                this.goToIndex(0);
            }
        }

        prev() {
            if (this.currentIndex > 0) {
                this.goToIndex(this.currentIndex - 1);
            }
        }

        syncWithScroll() {
            if (this.isPointerDown) return;
            const cards = this.getVisibleCards();
            if (cards.length === 0) return;

            const scrollLeft = this.viewport.scrollLeft;
            const trackOffset = this.track.offsetLeft;

            let closestIndex = 0;
            let minDiff = Infinity;

            cards.forEach((card, idx) => {
                const cardLeft = card.offsetLeft - trackOffset;
                const diff = Math.abs(cardLeft - scrollLeft);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestIndex = idx;
                }
            });

            const maxIndex = this.getMaxIndex();
            this.currentIndex = Math.min(closestIndex, maxIndex);
            this.updateButtonStates();
            this.updateActiveDot();
        }

        snapToNearestCard() {
            this.syncWithScroll();
            this.goToIndex(this.currentIndex);
        }

        startAutoPlay() {
            if (!this.autoPlay) return;
            this.stopAutoPlay();
            this.autoPlayTimer = setInterval(() => {
                this.next();
            }, this.autoPlayDelay);
        }

        stopAutoPlay() {
            if (this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer);
                this.autoPlayTimer = null;
            }
        }

        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    // Initialize Carousels for Skills and Projects
    const skillsCarousel = new CardCarousel("skills-carousel", {
        dotsId: "skills-dots",
        autoPlay: false
    });

    const projectsCarousel = new CardCarousel("projects-carousel", {
        dotsId: "projects-dots",
        autoPlay: false
    });

    // ==========================================
    // 6. PROJECT CATEGORY FILTER TABS
    // ==========================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";
                } else {
                    card.style.display = "none";
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                }
            });

            // Update Projects Carousel view and reset index
            if (projectsCarousel) {
                projectsCarousel.goToIndex(0);
                setTimeout(() => {
                    projectsCarousel.update();
                }, 60);
            }
        });
    });


    // ==========================================
    // 6. BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById("back-to-top");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // ==========================================
    // 7. KEYBOARD ACCESSIBILITY (Escape key)
    // ==========================================
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCvModal();
            closeLightbox();
            closeMobileMenu();
        }
    });
});


// ==========================================
// 8. PROJECT INNER CAROUSEL
// ==========================================
window.moveCarouselSlide = function(button, direction) {
    const carousel = button.closest('.project-carousel');
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-img');
    const dots = carousel.querySelectorAll('.carousel-indicator .dot');
    
    let activeIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    if (activeIndex === -1) activeIndex = 0;

    images[activeIndex].classList.remove('active');
    if (dots.length > activeIndex) dots[activeIndex].classList.remove('active');

    let newIndex = activeIndex + direction;
    if (newIndex >= images.length) newIndex = 0;
    if (newIndex < 0) newIndex = images.length - 1;

    images[newIndex].classList.add('active');
    if (dots.length > newIndex) dots[newIndex].classList.add('active');
};


// ==========================================
// 9. CV MODAL CONTROLS
// ==========================================
window.openCvModal = function() {
    const modal = document.getElementById('cvModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeCvModal = function() {
    const modal = document.getElementById('cvModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// Close modal if outer dark overlay is clicked
window.addEventListener('click', function(event) {
    const modal = document.getElementById('cvModal');
    if (event.target === modal) {
        closeCvModal();
    }
});


// ==========================================
// 10. IMAGE LIGHTBOX POPUP
// ==========================================
window.openLightbox = function(imageSrc, captionText = '') {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (lightbox && lightboxImg) {
        lightboxImg.src = imageSrc;
        if (lightboxCaption) {
            lightboxCaption.textContent = captionText;
        }
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
};

window.closeLightbox = function(event) {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }
};


// ==========================================
// 11. COPY EMAIL & TOAST NOTIFICATION
// ==========================================
window.copyEmail = function() {
    const email = "kautsarputra04@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        showToast("Alamat email berhasil disalin ke clipboard!");
    }).catch(() => {
        // Fallback for older browsers
        const tempInput = document.createElement("input");
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        showToast("Alamat email berhasil disalin!");
    });
};

window.showToast = function(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};


// ==========================================
// 12. CONTACT FORM SUBMIT HANDLER
// ==========================================
window.handleContactSubmit = function(event) {
    event.preventDefault();

    const name = document.getElementById('sender-name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const subject = document.getElementById('sender-subject').value.trim();
    const message = document.getElementById('sender-message').value.trim();

    if (!name || !email || !message) {
        showToast("Mohon lengkapi semua bidang isian formulir.");
        return;
    }

    // Compose formatted mailto link
    const mailtoSubject = encodeURIComponent(`[Portofolio] ${subject || "Pesan dari Web"}`);
    const mailtoBody = encodeURIComponent(`Halo Kautsar,\n\nNama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);
    const mailtoUrl = `mailto:kautsarputraramadhan34@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Open email client
    window.location.href = mailtoUrl;

    showToast("Membuka aplikasi email Anda...");
    document.getElementById('contact-form').reset();
};