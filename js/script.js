document.addEventListener('DOMContentLoaded', function () {
    // Находим элементы слайдера
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
    const slideIntervalTime = 5000; // 5 секунд между сменой слайдов

    // Функция для обновления отображения слайдера
    function updateSlider() {
        // Смещение: ширина одного слайда * индекс текущего слайда
        // Используем отрицательное значение, чтобы двигаться влево
        const translateX = -currentSlideIndex * 100;
        track.style.transform = `translateX(${translateX}%)`;

        // Обновляем индикаторы
        indicators.forEach((indicator, index) => {
            if (index === currentSlideIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Функция для переключения на следующий слайд
    function goToNextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        updateSlider();
    }

    // Функция для запуска автоматической прокрутки
    function startAutoSlide() {
        autoSlideInterval = setInterval(goToNextSlide, slideIntervalTime);
    }

    // Функция для остановки автоматической прокрутки
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Обработчик клика по индикатору
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlideIndex = index;
            updateSlider();
            // Перезапускаем таймер после клика пользователя
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // --- Логика для свайпа ---
    let touchStartX = 0;
    let touchEndX = 0;

    // Обработчик начала касания
    track.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        // Останавливаем автопрокрутку при взаимодействии
        stopAutoSlide();
    }, { passive: true }); // passive: true улучшает производительность для touchstart

    // Обработчик перемещения пальца
    track.addEventListener('touchmove', (event) => {
        // Здесь можно добавить визуальный эффект "перетаскивания", но для простоты не будем
        // Предотвращаем прокрутку страницы во время свайпа по слайдеру
        event.preventDefault();
    }, { passive: false }); // passive: false, так как мы вызываем preventDefault

    // Обработчик завершения касания
    track.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
        // Перезапускаем автопрокрутку после завершения свайпа
        startAutoSlide();
    }, { passive: true });

    // Функция, определяющая направление свайпа и переключающая слайд
    function handleSwipe() {
        const swipeThreshold = 50; // Минимальное расстояние в пикселях для срабатывания свайпа

        if (touchStartX - touchEndX > swipeThreshold) {
            // Свайп влево - следующий слайд
            currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
            updateSlider();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Свайп вправо - предыдущий слайд
            // Используем (currentSlideIndex - 1 + totalSlides) % totalSlides, чтобы корректно обработать переход с 0 на последний слайд
            currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
        // Если разница меньше threshold, ничего не делаем
    }

    // Инициализация: устанавливаем первый слайд как активный и запускаем автопрокрутку
    updateSlider();
    startAutoSlide();

    // Также останавливаем автопрокрутку, если пользователь наводит курсор на слайдер
    slider.addEventListener('mouseenter', stopAutoSlide);
    // И запускаем снова, когда курсор покидает слайдер
    slider.addEventListener('mouseleave', startAutoSlide);
});