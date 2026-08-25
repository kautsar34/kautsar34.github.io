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
    // 5. PROJECT CATEGORY FILTER TABS
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
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 250);
                }
            });
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
    const email = "kautsarputraramadhan34@gmail.com";
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