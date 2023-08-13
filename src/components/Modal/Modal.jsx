import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import PropTypes from 'prop-types';

const Modal = ({ showModal, largeImageUrl, alt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };

    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'visible';
    };
  }, [showModal, onClose]);

  if (!showModal) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {largeImageUrl && (
        <div className={styles.modal}>
          <img src={largeImageUrl} alt={alt} className={styles.modalImage} />
        </div>
      )}
    </div>,
    document.getElementById('modal-root')
  );
};

Modal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  largeImageUrl: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
