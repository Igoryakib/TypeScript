import { Movie, Movies, Query, TypeRequest } from '../interfaces';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'bfa52d7e3cb8b977a558f7a3657e1861';

let films: Movies | Movie;
let page = 1;

const mapper = (data: any): Movies | Movie => {
    if (data.results) {
        films = {
            page: data.page,
            results: data.results.map((item: Movie) => ({
                original_title: item.original_title,
                overview: item.overview,
                poster_path: item.poster_path,
                release_date: item.release_date,
                backdrop_path: item.backdrop_path,
                id: item.id,
            })),
        };
    } else {
        films = {
            original_title: data.original_title,
            overview: data.overview,
            poster_path: data.poster_path,
            release_date: data.release_date,
            backdrop_path: data.backdrop_path,
            id: data.id,
        };
    }
    return films;
};

const setError = (errorMessage: string): never => {
    throw Error(errorMessage);
};

const fetchFilms = async (
    url: string,
    query: Query,
    typeRequest: TypeRequest
): Promise<Movie | Movies> => {
    let res;
    let data;
    try {
        switch (typeRequest) {
            case TypeRequest.getFilms:
                page = 1;
                res = await fetch(
                    `${BASE_URL}${url}?api_key=${API_KEY}&query=${query}&page=${page}`
                );
                data = await res.json();
                films = mapper(data);
                break;
            case TypeRequest.pagination:
                page += 1;
                res = await fetch(
                    `${BASE_URL}${url}?api_key=${API_KEY}&query=${query}&page=${page}`
                );
                data = await res.json();
                films = mapper(data);
                if ((films as Movies)?.results.length === 0) {
                    setError('Oops, Not found 404 :(');
                }
                break;
        }
    } catch (error: any) {
        console.log(error)
        setError(error.message);
    }
    return films;
};

export { fetchFilms, setError };
