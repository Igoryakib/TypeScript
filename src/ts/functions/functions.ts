import {
    Movies,
    Buttons,
    Query,
    Urls,
    Element,
    TypeRequest,
} from '../interfaces';
import { fetchFilms, setError } from '../helpers/apiFunctions';
import { saveData, getData } from '../helpers/localStorage';
import {
    renderSectionFavoriteMovies,
    renderPreview,
    renderFilms,
    renderError,
} from './renderFunctions';

const cardsContainer: Element = document.querySelector('#film-container');
const formInput: Element = document.querySelector('#search');
const loadMoreBtn: Element = document.querySelector('#load-more');
const randomMovieSection: Element = document.querySelector('#random-movie');
const bg_container: Element = document.querySelector('#random-movie');
let searchForm: string;
let favoriteFilms: number[] = [];
let likeButtons: Node[];

const createSectionFilms = (container: Element, arrayFilms: Movies): void => {
    if (getData('arrayId')) {
        favoriteFilms = [...getData('arrayId')];
    }
    renderSectionFavoriteMovies(favoriteFilms);
    renderFilms(container, arrayFilms, favoriteFilms);
    likeButtons = [...document.querySelectorAll('.bi-heart-fill')];
    likeButtons.map((element): void =>
        element?.addEventListener('click', handleOnClickLike)
    );
};

const handleOnClickLike = (event: Event): void => {
    (event.currentTarget as HTMLElement).classList.toggle('colorRed');
    const movieId = (event.currentTarget as HTMLElement).dataset.movieid;
    if ((event.currentTarget as HTMLElement).classList.contains('colorRed')) {
        favoriteFilms.push(movieId as unknown as number);
        saveData('arrayId', favoriteFilms);
    } else {
        favoriteFilms = favoriteFilms.filter(
            (item: number) => +item !== (movieId ? +movieId : null)
        );
        saveData('arrayId', favoriteFilms);
    }
    renderSectionFavoriteMovies(favoriteFilms);
};

const createPage = async (
    url: Urls,
    query: Query,
    typeRender: TypeRequest
): Promise<void> => {
    let films: Movies;
    try {
        switch (typeRender) {
            case TypeRequest.getFilms:
                films = (await fetchFilms(
                    url,
                    query,
                    TypeRequest.getFilms
                )) as Movies;
                if ((films as Movies)?.results.length === 0) {
                    setError('Oops, Not found 404 :(');
                }
                cardsContainer ? (cardsContainer.innerHTML = '') : null;
                return createSectionFilms(cardsContainer, films);
            case TypeRequest.pagination:
                films = (await fetchFilms(
                    url,
                    query,
                    TypeRequest.pagination
                )) as Movies;
                return createSectionFilms(cardsContainer, films);
        }
    } catch (error: any) {
        console.log(error);
        renderError(cardsContainer, error.message);
    }
};

const setTypeLoadMoreBtn = (typeBtn: Buttons | null, query: Query) => {
    switch (typeBtn) {
        case Buttons.popularBtn:
            return createPage(Urls.popular, null, TypeRequest.pagination);
        case Buttons.upComingBtn:
            return createPage(Urls.upComing, null, TypeRequest.pagination);
        case Buttons.topRatedBtn:
            return createPage(Urls.topRated, null, TypeRequest.pagination);
        case Buttons.submitBtn:
            return createPage(Urls.byName, query, TypeRequest.pagination);
    }
};
let handlerOnclickLoadMoreBtn = setTypeLoadMoreBtn.bind(
    this,
    Buttons.popularBtn,
    null
);

const handlerOnClick = (
    url: Urls,
    typeReq: TypeRequest,
    typeButton: Buttons,
    query: Query
): void => {
    loadMoreBtn?.removeEventListener('click', handlerOnclickLoadMoreBtn);
    handlerOnclickLoadMoreBtn = setTypeLoadMoreBtn.bind(
        this,
        typeButton,
        query
    );
    loadMoreBtn?.addEventListener('click', handlerOnclickLoadMoreBtn);
    !query ? ((formInput as HTMLInputElement).value = '') : formInput;
    createPage(url, query, typeReq);
};

const onClickButtons = async (typeButtons: Buttons): Promise<void> => {
    switch (typeButtons) {
        case Buttons.topRatedBtn:
            document
                .querySelector('#top_rated')
                ?.addEventListener('click', (): void =>
                    handlerOnClick(
                        Urls.topRated,
                        TypeRequest.getFilms,
                        Buttons.topRatedBtn,
                        null
                    )
                );
            break;
        case Buttons.popularBtn:
            document
                .querySelector('#popular')
                ?.addEventListener('click', (): void =>
                    handlerOnClick(
                        Urls.popular,
                        TypeRequest.getFilms,
                        Buttons.popularBtn,
                        null
                    )
                );
            break;
        case Buttons.upComingBtn:
            document
                .querySelector('#upcoming')
                ?.addEventListener('click', (): void =>
                    handlerOnClick(
                        Urls.upComing,
                        TypeRequest.getFilms,
                        Buttons.upComingBtn,
                        null
                    )
                );
            break;
        case Buttons.submitBtn:
            formInput?.addEventListener('input', (event): string => {
                searchForm = (event.target as HTMLInputElement).value;
                return searchForm;
            });
            document
                .querySelector('#submit')
                ?.addEventListener('click', (): void =>
                    handlerOnClick(
                        Urls.byName,
                        TypeRequest.getFilms,
                        Buttons.submitBtn,
                        searchForm
                    )
                );
            break;
    }
};

const createDefaultPage = async (): Promise<void> => {
    if (getData('arrayId')) {
        favoriteFilms = [...getData('arrayId')];
    }
    try {
        const movies = (await fetchFilms(
            Urls.popular,
            null,
            TypeRequest.getFilms
        )) as Movies;
        renderPreview(randomMovieSection, bg_container, movies);
        createPage(Urls.popular, null, TypeRequest.getFilms);
        loadMoreBtn?.addEventListener('click', handlerOnclickLoadMoreBtn);
    } catch (error: any) {
        console.log(error);
        renderError(cardsContainer, error.message);
    }
};

export { onClickButtons, createDefaultPage };
