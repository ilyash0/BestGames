document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    const track = slider.querySelector('.slider__track');
    const slides = Array.from(slider.querySelectorAll('.slider__slide'));
    const indicators = Array.from(slider.querySelectorAll('.slider__indicator'));

    if (!track || slides.length === 0) {
        console.error('Элементы слайдера не найдены или нет слайдов.');
        return;
    }

    const totalSlides = slides.length;
    let currentSlideIndex = 0;

    let autoSlideInterval = null;
    let autoSlideTimeout = null;
    const slideIntervalTime = 5000; // ms

    function updateSlider() {
        const translateX = -currentSlideIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;

        indicators.forEach((indicator, idx) => {
            indicator.classList.toggle('active', idx === currentSlideIndex);
        });
    }

    function goToSlide(index) {
        currentSlideIndex = ((index % totalSlides) + totalSlides) % totalSlides;
        updateSlider();
    }

    function goToNextSlide() {
        goToSlide(currentSlideIndex + 1);
    }

    function goToPrevSlide() {
        goToSlide(currentSlideIndex - 1);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
        if (autoSlideTimeout) {
            clearTimeout(autoSlideTimeout);
            autoSlideTimeout = null;
        }
    }

    function startAutoSlide(delay = slideIntervalTime) {
        if (autoSlideInterval || autoSlideTimeout) return;

        autoSlideTimeout = setTimeout(() => {
            if (autoSlideInterval || !autoSlideTimeout) {
                autoSlideTimeout = null;
                return;
            }
            autoSlideInterval = setInterval(goToNextSlide, slideIntervalTime);
            autoSlideTimeout = null;
        }, delay);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            goToSlide(index);
            stopAutoSlide();
            startAutoSlide(slideIntervalTime);
        });
    });

    let touchStartX = 0;
    let touchStartY = 0;
    let isTouching = false;

    const swipeThreshold = 50;
    const horizontalDetectionThreshold = 10;

    track.addEventListener('touchstart', (event) => {
        if (!event.touches || event.touches.length === 0) return;
        const t = event.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        isTouching = true;
        stopAutoSlide();
    }, {passive: true});

    track.addEventListener('touchmove', (event) => {
        if (!isTouching || !event.touches || event.touches.length === 0) return;

        const t = event.touches[0];
        const deltaX = t.clientX - touchStartX;
        const deltaY = t.clientY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > horizontalDetectionThreshold) {
            event.preventDefault();
        }
    }, {passive: false});

    track.addEventListener('touchend', (event) => {
        if (!isTouching) return;
        isTouching = false;

        const t = event.changedTouches[0];
        const touchEndX = t.clientX;
        const touchEndY = t.clientY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > swipeThreshold) {
            if (dx < 0) {
                goToNextSlide();
            } else {
                goToPrevSlide();
            }
        }

        stopAutoSlide();
        startAutoSlide(slideIntervalTime);
    }, {passive: true});

    slider.addEventListener('mouseenter', () => {
        stopAutoSlide();
    });

    slider.addEventListener('mouseleave', () => {
        stopAutoSlide();
        startAutoSlide(slideIntervalTime);
    });

    slider.addEventListener('focusin', () => {
        stopAutoSlide();
    });
    slider.addEventListener('focusout', () => {
        stopAutoSlide();
        startAutoSlide(slideIntervalTime);
    });

    updateSlider();
    startAutoSlide(slideIntervalTime);
});

document.addEventListener('DOMContentLoaded', function () {
    const themeToggleBtn = document.querySelector('.header__theme-toggle');
    const themeIcon = document.querySelector('.header__theme-icon');
    const htmlElement = document.documentElement; // Или document.body

    const isLightTheme = localStorage.getItem('theme') === 'light';

    if (isLightTheme) {
        htmlElement.classList.add('theme-light');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', function () {
        htmlElement.classList.toggle('theme-light');

        if (htmlElement.classList.contains('theme-light')) {
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });
});
