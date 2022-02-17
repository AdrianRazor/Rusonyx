// Слайдеры
const swiperAbout = new Swiper('.swiper-about', {
    slidesPerView: 'auto',
    spaceBetween: 20,

    pagination: {
        el: '.slider__dots-block',
        bulletClass: 'slider__dot',
        bulletActiveClass: 'slider__dot--active'
    },
    on: {
        init(e) {
            if (window.screen.width <= 576) {
                e.enable()
            } else {
                e.slideTo(0, 0)
                e.disable()
            }
        },
        resize(e) {
            if (window.screen.width <= 576) {
                e.enable()
            } else {
                e.slideTo(0, 0)
                e.disable()
            }
        }
    }
});

const swiperReviews = new Swiper('.swiper-reviews', {
    slidesPerView: 'auto',
    spaceBetween: 20,

    pagination: {
        el: '.slider__dots-block',
        bulletClass: 'slider__dot',
        bulletActiveClass: 'slider__dot--active'
    },
    on: {
        init(e) {
            if (window.screen.width <= 576) {
                e.enable()
            } else {
                e.slideTo(0, 0)
                e.disable()
            }
        },
        resize(e) {
            if (window.screen.width <= 576) {
                e.enable()
            } else {
                e.slideTo(0, 0)
                e.disable()
            }
        }
    }
});



// Инпуты в футере
let inputArr = document.querySelectorAll('.footer__input');
let inputLabelArr = document.querySelectorAll('.footer__label');

for (let i = 0; i < inputArr.length; i++) {
    inputArr[i].onfocus = function() {
        inputLabelArr[i].classList.add('footer__label--active');
    }
    inputArr[i].onblur = function() {
        if (inputArr[i].value.length !== 0) {
            inputLabelArr[i].classList.add('footer__label--active');
        } else {
            inputLabelArr[i].classList.remove('footer__label--active');
        }
    }    
}