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


document.addEventListener('DOMContentLoaded', () => {
    const filters = document.querySelector('.search__filters');
    const filtersBody = document.getElementById('filters-body');
    const toggleBtn = document.querySelector('.search__filters-toggle');
    const resetBtn = document.querySelector('.search__filters-reset');
    const applyBtn = document.querySelector('.search__filters-apply');

    const checkboxes = filters ? Array.from(filters.querySelectorAll('.search__filter-checkbox')) : [];
    const ratingRadios = filters ? Array.from(filters.querySelectorAll('.search__rating-radio')) : [];
    const ratingLabels = ratingRadios.map(r => r.closest('.search__rating-option'));
    const developerSelect = filters ? filters.querySelector('.search__developer-select') : null;
    const priceMin = filters ? filters.querySelector('input[name="price_min"]') : null;
    const priceMax = filters ? filters.querySelector('input[name="price_max"]') : null;

    if (!filters || !filtersBody || !toggleBtn) return;

    function expandFilters() {
        filters.classList.remove('search__filters--collapsed');
        toggleBtn.setAttribute('aria-expanded', 'true');
        toggleBtn.querySelector('.search__filters-toggle-text').textContent = 'Свернуть';

        const full = filtersBody.scrollHeight;
        filtersBody.style.maxHeight = full + 'px';

        const onTransitionEnd = function (e) {
            if (e.target !== filtersBody) return;
            filtersBody.style.maxHeight = 'none';
            filtersBody.removeEventListener('transitionend', onTransitionEnd);
        };
        filtersBody.addEventListener('transitionend', onTransitionEnd);
    }

    function collapseFilters() {
        const current = filtersBody.scrollHeight || filtersBody.offsetHeight;
        filtersBody.style.maxHeight = current + 'px';

        void filtersBody.offsetHeight;

        filtersBody.style.maxHeight = '0px';
        filters.classList.add('search__filters--collapsed');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.querySelector('.search__filters-toggle-text').textContent = 'Развернуть';
    }

    if (!filters.classList.contains('search__filters--collapsed')) {
        filtersBody.style.maxHeight = filtersBody.scrollHeight + 'px';
        setTimeout(() => {
            filtersBody.style.maxHeight = 'none';
        }, 350);
    } else {
        filtersBody.style.maxHeight = '0px';
    }

    toggleBtn.addEventListener('click', () => {
        const isCollapsed = filters.classList.contains('search__filters--collapsed');
        if (isCollapsed) {
            expandFilters();
        } else {
            collapseFilters();
        }
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
        if (filters.classList.contains('search__filters--collapsed')) return;
        filtersBody.style.maxHeight = filtersBody.scrollHeight + 'px';
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            filtersBody.style.maxHeight = 'none';
        }, 220);
    });

    checkboxes.forEach(ch => {
        const label = ch.closest('.search__filter-label');
        if (label) {
            label.classList.toggle('search__filter-label--checked', ch.checked);
            ch.addEventListener('change', () => {
                label.classList.toggle('search__filter-label--checked', ch.checked);
            });
        }
    });

    ratingRadios.forEach(r => {
        const label = r.closest('.search__rating-option');
        if (label) label.classList.toggle('search__rating-option--selected', r.checked);
        r.addEventListener('change', () => {
            ratingLabels.forEach(l => l.classList.remove('search__rating-option--selected'));
            const sel = r.closest('.search__rating-option');
            if (sel) sel.classList.add('search__rating-option--selected');
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            checkboxes.forEach(ch => {
                ch.checked = false;
                const label = ch.closest('.search__filter-label');
                if (label) label.classList.remove('search__filter-label--checked');
            });
            ratingRadios.forEach(r => r.checked = false);
            ratingLabels.forEach(l => l.classList.remove('search__rating-option--selected'));
            if (developerSelect) developerSelect.value = '';
            if (priceMin) priceMin.value = '';
            if (priceMax) priceMax.value = '';
        });
    }

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const activeGenres = checkboxes.filter(c => c.checked).map(c => c.value);
            const rating = ratingRadios.find(r => r.checked)?.value || '';
            const developer = developerSelect ? developerSelect.value : '';
            const minPrice = priceMin ? priceMin.value : '';
            const maxPrice = priceMax ? priceMax.value : '';

            console.log({ activeGenres, rating, developer, minPrice, maxPrice });

            if (window.innerWidth < 768 && !filters.classList.contains('search__filters--collapsed')) {
                collapseFilters();
            }
        });
    }
});

