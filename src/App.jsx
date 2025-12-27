import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { fetchImages } from "./api/unsplash";

import SearchBar from "./components/SearchBar/SearchBar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import ImageModal from "./components/ImageModal/ImageModal";

import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!query) return;

    let isActive = true;

    async function run() {
      try {
        setError("");
        setIsLoading(true);

        const { results, totalPages } = await fetchImages(query, page);

        if (!isActive) return;

        setImages((prev) => (page === 1 ? results : [...prev, ...results]));
        setTotalPages(totalPages);
      } catch (err) {
        if (!isActive) return;
        setError("Something went wrong. Try again.");
      } finally {
        if (!isActive) return;
        setIsLoading(false);
      }
    }

    run();
    return () => {
      isActive = false;
    };
  }, [query, page]);

  const handleSearch = (value) => {
    const normalized = value.trim();
    if (!normalized) {
      toast.error("Please enter a search term.");
      return;
    }

    setQuery(normalized);
    setPage(1);
    setImages([]);
    setTotalPages(0);
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const handleLoadMore = () => setPage((p) => p + 1);

  const openModal = (img) => {
    setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const canLoadMore = images.length > 0 && page < totalPages && !isLoading;

  return (
    <div className="app">
      <Toaster position="top-right" />

      <SearchBar onSubmit={handleSearch} />

      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          {images.length > 0 && <ImageGallery images={images} onImageClick={openModal} />}
          {isLoading && <Loader />}
          {canLoadMore && <LoadMoreBtn onClick={handleLoadMore} />}
        </>
      )}

      <ImageModal isOpen={isModalOpen} onClose={closeModal} image={selectedImage} />
    </div>
  );
}