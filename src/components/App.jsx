import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import styles from './App.module.css';

const API_KEY = '37181386-1c0d920a7929ae22641c44c4d';
const BASE_URL = 'https://pixabay.com/api/';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);

  const fetchImages = async (query, pageNum) => {
    const url = `${BASE_URL}?q=${query}&page=${pageNum}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    setIsLoading(true);

    try {
      const response = await axios.get(url);
      const newImages = response.data.hits;
      const totalHits = response.data.totalHits;
      const newTotalPages = Math.ceil(totalHits / 12);

      if (newImages.length === 0) {
        setNoResults(true);
      } else {
        setImages(prevImages => [...prevImages, ...newImages]);
        setTotalPages(newTotalPages);
        setCurrentPage(pageNum);
        setNoResults(false);
      }
    } catch (error) {
      alert('Error fetching images: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery !== '') {
      fetchImages(searchQuery, 1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1) {
      fetchImages(searchQuery, page);
    }
  }, [searchQuery, page]);

  const handleFormSubmit = query => {
    setSearchQuery(query);
    setPage(1);
    setImages([]);
    setNoResults(false);
    setTotalPages(null);
    setCurrentPage(null);
  };

  const toggleModal = () => {
    setShowModal(prevShowModal => !prevShowModal);
  };

  const handleImageClick = largeImageUrl => {
    setSelectedImage(largeImageUrl);
    toggleModal();
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const hasMoreImages =
    totalPages !== null && currentPage !== null && currentPage < totalPages;

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={handleFormSubmit} />
      {images.length === 0 && noResults ? (
        <div className={styles.noResults}>No images found</div>
      ) : (
        images.length > 0 && (
          <ImageGallery images={images} onImageClick={handleImageClick} />
        )
      )}
      {isLoading && <Loader />}

      {hasMoreImages && <Button onClick={handleLoadMore} />}
      <Modal
        showModal={showModal}
        largeImageUrl={selectedImage}
        alt=""
        onClose={toggleModal}
      />
    </div>
  );
}

export default App;
