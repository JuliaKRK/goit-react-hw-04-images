import React, { Component } from 'react';
import axios from 'axios';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import styles from './App.module.css';

const API_KEY = '37181386-1c0d920a7929ae22641c44c4d';
const BASE_URL = 'https://pixabay.com/api/';

class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    page: 1,
    isLoading: false,
    showModal: false,
    selectedImage: null,
    noResults: false,
    totalPages: null, // Додайте змінну для загальної кількості сторінок
    currentPage: null, // Додайте змінну для поточної сторінки
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.fetchImages();
    }
  }

  handleFormSubmit = query => {
    this.setState({
      searchQuery: query,
      page: 1,
      images: [],
      noResults: false,
      totalPages: null,
      currentPage: null,
    });
  };

  fetchImages = () => {
    const { searchQuery, page } = this.state;
    const url = `${BASE_URL}?q=${searchQuery}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`;

    this.setState({ isLoading: true });

    axios
      .get(url)
      .then(response => {
        const newImages = response.data.hits;
        const totalHits = response.data.totalHits;
        const totalPages = Math.ceil(totalHits / 12);

        if (newImages.length === 0) {
          // Якщо немає отриманих зображень, встановлюємо noResults в true
          this.setState({ noResults: true });
        } else {
          // Інакше додаємо зображення до списку та оновлюємо стан
          this.setState(prevState => ({
            images: [...prevState.images, ...newImages],
            totalPages: totalPages,
            currentPage: prevState.page,
            noResults: false, // Встановлюємо noResults в false, тому що є зображення
          }));
        }
      })
      .catch(error => {
        alert('Error fetching images: ' + error.message);
      })
      .finally(() => this.setState({ isLoading: false }));
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));
  };

  handleImageClick = largeImageUrl => {
    this.setState({ selectedImage: largeImageUrl });
    this.toggleModal();
  };

  handleLoadMore = () => {
    this.setState(
      prevState => ({
        page: prevState.page + 1,
      }),
      this.fetchImages
    );
  };

  render() {
    const {
      images,
      isLoading,
      showModal,
      selectedImage,
      noResults,
      totalPages,
      currentPage,
    } = this.state;

    const hasMoreImages =
      totalPages !== null && currentPage !== null && currentPage < totalPages;

    return (
      <div className={styles.App}>
        <Searchbar onSubmit={this.handleFormSubmit} />
        {images.length === 0 && noResults ? (
          <div className={styles.noResults}>No images found</div>
        ) : (
          images.length > 0 && (
            <ImageGallery
              images={images}
              onImageClick={this.handleImageClick}
            />
          )
        )}
        {isLoading && <Loader />}

        {hasMoreImages && <Button onClick={this.handleLoadMore} />}
        {showModal && (
          <Modal
            open={showModal}
            imageSrc={selectedImage}
            alt=""
            largeImageUrl={selectedImage}
            onClose={this.toggleModal}
          />
        )}
      </div>
    );
  }
}

export default App;
