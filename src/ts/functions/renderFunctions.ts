import {
    Movies,
    Movie,
    Buttons,
    Query,
    Urls,
    Element,
    TypeRequest,
} from '../interfaces';

import { fetchFilms } from '../helpers/apiFunctions';

const favoriteContainer: Element = document.querySelector('#favorite-movies');

const renderFavoriteFilms = (container: Element, arrayFilms: Movie[]): void => {
    container ? (container.innerHTML = '') : null;
    arrayFilms.map((item: Movie) =>
        container?.insertAdjacentHTML(
            'beforeend',
            `<div class="col-12 p-2">
            <div class="card shadow-sm">
                <img src="https://image.tmdb.org/t/p/original/${item.poster_path}" />
                <svg xmlns="http://www.w3.org/2000/svg" stroke="red" fill="red" width="50" height="50"
                    class="bi bi-heart-fill position-absolute p-2" viewBox="0 -2 18 22">
                    <path fill-rule="evenodd"
                        d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>
                <div class="card-body">
                    <p class="card-text truncate">
                    ${item.overview}
                    </p>
                    <div class="
                                d-flex
                                justify-content-between
                                align-items-center
                            ">
                        <small class="text-muted">${item.release_date}</small>
                    </div>
                </div>
            </div>
        </div>`
        )
    );
};

const renderError = (container: Element, errorMessage: string): void => {
    container ? (container.innerHTML = '') : null;
    container?.insertAdjacentHTML(
        'beforeend',
        `<h3 class="errorMessage">${errorMessage}</h3>`
    );
};

const renderPreview = (
    container: Element,
    bg_container: Element,
    arrayFilms: Movies
): void => {
    const randomIndex = Math.round(Math.random() * (19 - 0) + 0);
    const randomMovie = arrayFilms.results[randomIndex];
    bg_container
        ? (bg_container.style.backgroundImage = `url('https://image.tmdb.org/t/p/original/${randomMovie.backdrop_path}')`)
        : null;
    container?.insertAdjacentHTML(
        'beforeend',
        `<div class="row py-lg-5">
    <div class="col-lg-6 col-md-8 mx-auto" style="background-color: #2525254f">
        <h1 id="random-movie-name" class="fw-light text-light">${randomMovie.original_title}</h1>
        <p id="random-movie-description" class="lead text-white">
            ${randomMovie.overview}
        </p>
    </div>
</div>`
    );
};

const renderSectionFavoriteMovies = async (
    arrayID: number[]
): Promise<void> => {
    const arrayMoviesPromises = arrayID.map((item: number) => {
        const url = `/movie/${item}`;
        return fetchFilms(url, null, TypeRequest.getFilms);
    });
    const arrayMovies = (await Promise.all(arrayMoviesPromises)) as Movie[];
    renderFavoriteFilms(favoriteContainer, arrayMovies);
};

const renderFilms = (
    container: Element,
    arrayFilms: Movies,
    favoriteFilms: number[]
): void => {
    arrayFilms.results.map((item: Movie): void => {
        container?.insertAdjacentHTML(
            'beforeend',
            `<div class="col-lg-3 col-md-4 col-12 p-2">
                <div class="card shadow-sm">
                    <img
                        src="https://image.tmdb.org/t/p/original/${
                            item.poster_path
                        }"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="red"
                        fill="#ff000078"
                        width="50"
                        height="50"
                        class="bi bi-heart-fill position-absolute p-2 cursorPointer ${
                            favoriteFilms.includes(item.id) ? 'colorRed' : ''
                        }"
                        data-movieId=${item.id}
                        viewBox="0 -2 18 22"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                        />
                    </svg>
                    <div class="card-body">
                        <p class="card-text truncate">
                            ${item.overview}
                        </p>
                        <div
                            class="
                                d-flex
                                justify-content-between
                                align-items-center
                            "
                        >
                            <small class="text-muted">${
                                item.release_date
                            }</small>
                        </div>
                    </div>
                </div>
            </div>`
        );
    });
};

export { renderSectionFavoriteMovies, renderPreview, renderFilms, renderError };
