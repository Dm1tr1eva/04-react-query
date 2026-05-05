import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

export default async function fetchMovies(query: string, page: number = 1): Promise<MoviesHttpResponse> {
  const token = import.meta.env.VITE_TMDB_TOKEN;

  const response = await axios.get<MoviesHttpResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: {
        query: query,
        page: page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
}
