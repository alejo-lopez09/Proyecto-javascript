const slides = document.querySelector(".slides");
const images = document.querySelectorAll(".slides img");

let index = 0;

function showSlide() {

    index++;

    if (index >= images.length) {
        index = 0;
    }

    slides.style.transform = `translateX(-${index * 100}%)`;
}

setInterval(showSlide, 3000);