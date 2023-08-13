import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import PropTypes from 'prop-types';

const Modal = ({ open, largeImageUrl, alt, onClose }) => {
  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('click', handleOverlayClick);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleOverlayClick);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <img src={largeImageUrl} alt={alt} className={styles.modalImage} />
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  largeImageUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
