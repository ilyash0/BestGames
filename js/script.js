document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');
    const track = slider.querySelector('.slider__track');
    const slides = slider.querySelectorAll('.slider__slide');
    const indicators = slider.querySelectorAll('.slider__indicator');

    if (!track || !slides.length || !indicators.length) {
        console.error('Элементы слайдера не найдены.');
        return;
    }

    const totalSlides = slides.length;
    let currentSlideIndex = 0;
    let autoSlideInterval;
    const slideIntervalTime = 5000;

    function updateSlider() {
        const translateX = -currentSlideIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;

        indicators.forEach((indicator, index) => {
            if (index === currentSlideIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    function goToNextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        updateSlider();
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(goToNextSlide, slideIntervalTime);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlideIndex = index;
            updateSlider();
            stopAutoSlide();
            startAutoSlide();
        });
    });

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });

    track.addEventListener('touchmove', (event) => {
        event.preventDefault();
    }, { passive: false });

    track.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchStartX - touchEndX > swipeThreshold) {
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            updateSlider();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
    }

    updateSlider();
    startAutoSlide();

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
});