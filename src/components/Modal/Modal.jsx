import React, { Component } from 'react';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

export class Modal extends Component {
  static propTypes = {
    image: PropTypes.exact({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyClose);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyClose);
  }

  handleKeyClose = evt => {
    if (evt.code === 'Escape') {
      this.props.onClose();
    }
  };

  closeModal = ({ currentTarget, target }) => {
    if (currentTarget === target) {
      this.props.onClose();
    }
  };

  render() {
    const {
      image: { src, alt },
    } = this.props;
    return (
      <div className={css.Overlay} onClick={this.closeModal}>
        <div className={css.Modal}>
          <img src={src} alt={alt} />
        </div>
      </div>
    );
  }
}
