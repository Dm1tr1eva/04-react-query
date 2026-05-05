import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import "./App.module.css";
import { Toaster } from "react-hot-toast";
import SearchBar from "./../SearchBar/SearchBar";
import type { Movie } from "./../../types/movie";
import fetchMovies from "./../../services/movieService";
import MovieGrid from "./../MovieGrid/MovieGrid";
import Loader from "./../Loader/Loader";
import ErrorMessage from "./../ErrorMessage/ErrorMessage";
import MovieModal from "./../MovieModal/MovieModal";
import toast from "react-hot-toast";
import Pagination from "../Pagination/Pagination";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", searchQuery, page],
    queryFn: () => fetchMovies(searchQuery, page),
    enabled: searchQuery.length > 0,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results ?? [];

  useEffect(() => {
    if (
      isSuccess &&
      !isLoading &&
      movies.length === 0 &&
      searchQuery.length > 0
    ) {
      toast.error("No movies found for your request.", {
        duration: 3000,
      });
    }
  }, [isSuccess, isLoading, movies.length, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isSuccess && totalPages > 1 && (
        <Pagination totalPages={totalPages} page={page} setPage={setPage} />
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
