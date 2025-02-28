document.addEventListener('DOMContentLoaded', function () {
    const slidesContainer = document.getElementById('slider');
    const dotsContainer = document.querySelector('.slider-nav');

    function truncateDescription(description, wordLimit) {
        const words = description.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return description;
    }

    fetch('https://test-seven-pi-94.vercel.app/anime/home')
        .then(response => response.json())
        .then(data => {
            const spotlightAnimes = data.spotlightAnimes;
            const trendingAnimes = data.trendingAnimes;

            // Inject slides
            spotlightAnimes.forEach((anime, index) => {
                const slide = document.createElement('div');
                slide.className = 'slide' + (index === 0 ? ' active' : '');
                slide.innerHTML = `
                    <img src="${anime.poster}" alt="${anime.name}">
                    <div class="slide-content">
                        <div class="title">${anime.name}</div>
                        <div class="additional-info">${anime.otherInfo.join(' | ')}</div>
                        <div class="description">${truncateDescription(anime.description, 10)}</div>
                        <div class="buttons">
                            <a href="./details.html?id=${anime.id}" class="details-button">Details</a>
                            <a href="./episodes.html?id=${anime.id}" class="watch-button">Watch</a>
                        </div>
                    </div>
                    <div class="timer-line"></div>
                `;
                slidesContainer.appendChild(slide);

                const dot = document.createElement('div');
                dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
                dot.dataset.index = index;
                dotsContainer.appendChild(dot);
            });

            // Inject movie cards
            const movieCardsContainer = document.querySelector('.movie-cards-container');
            trendingAnimes.forEach(anime => {
                const card = document.createElement('div');
                card.className = 'movie-card card';
                card.innerHTML = `
                    <img src="${anime.poster}" class="card-img-top" alt="${anime.name}">
                    <div class="play-button">
                        <img src="play.png" alt="Play">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${anime.name}</h5>
                    </div>
                `;
                card.addEventListener('click', () => {
                    window.location.href = `./details.html?id=${anime.id}`;
                });

                movieCardsContainer.appendChild(card);
            });

            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.slider-dot');
            let currentIndex = 0;

            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                    dots[i].classList.toggle('active', i === index);
                });
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % slides.length;
                showSlide(currentIndex);
            }

            const timer = setInterval(nextSlide, 10000);

            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    clearInterval(timer);
                    currentIndex = parseInt(dot.dataset.index);
                    showSlide(currentIndex);
                });
            });

            showSlide(currentIndex);
        })
        .catch(error => console.error('Error fetching anime data:', error));
});
