import React from 'react';
import styles from './ImageGalleryItem.module.css';
import PropTypes from 'prop-types';

const ImageGalleryItem = ({ imageUrl, onImageClick, largeImageUrl, alt }) => {
  const handleClick = () => {
    onImageClick(largeImageUrl);
  };

  return (
    <li className={styles.galleryItem}>
      <img
        src={imageUrl}
        alt={alt}
        onClick={handleClick}
        className={styles.galleryImage}
      />
    </li>
  );
};

ImageGalleryItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  onImageClick: PropTypes.func.isRequired,
  largeImageUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default ImageGalleryItem;
