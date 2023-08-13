import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import PropTypes from 'prop-types';

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (e.code === 'Escape') {
      this.props.onClose();
    }
  };

  handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    const { open, largeImageUrl, alt } = this.props;

    if (!open) {
      return null;
    }

    return createPortal(
      <div className={styles.overlay} onClick={this.handleOverlayClick}>
        <div className={styles.modal}>
          <img src={largeImageUrl} alt={alt} className={styles.modalImage} />
        </div>
      </div>,
      document.getElementById('modal-root')
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired, // Пропс, що вказує, чи має бути показане модальне вікно.
  largeImageUrl: PropTypes.string.isRequired, // URL великого зображення для відображення в модальному вікні.
  alt: PropTypes.string.isRequired, // Альтернативний текст для зображення.
  onClose: PropTypes.func.isRequired, // Функція-зворотний виклик для закриття модального вікна.
};

export default Modal;
