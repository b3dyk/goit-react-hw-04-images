import { useEffect } from 'react';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

export const Modal = ({ image: { src, alt }, onClose }) => {
  useEffect(() => {
    const handleKeyClose = evt => {
      if (evt.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyClose);

    return () => {
      window.removeEventListener('keydown', handleKeyClose);
    };
  }, [onClose]);

  const closeModal = ({ currentTarget, target }) => {
    if (currentTarget === target) {
      onClose();
    }
  };

  return (
    <div className={css.Overlay} onClick={closeModal}>
      <div className={css.Modal}>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
};

Modal.propTypes = {
  image: PropTypes.exact({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
