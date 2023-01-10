import { Component } from 'react';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { getImages } from 'services/images.service';
import { STATUS } from 'constants/status.constants';
import Notify from 'services/notifications.service';

export class App extends Component {
  state = {
    images: [],
    page: 1,
    search: '',
    currentImage: null,
    status: STATUS.idle,
  };

  componentDidUpdate(_, prevState) {
    const { page, search } = this.state;
    if (prevState.page !== page || prevState.search !== search) {
      if (search !== '') {
        this.fetchData({ page, search });
      }
    }
  }

  handleSearch = search => {
    if (search === '') {
      Notify.warning('Please enter key word');
    }
    this.setState({
      images: [],
      search,
      page: 1,
    });
  };

  fetchData = async ({ page = this.state.page, search = '' }) => {
    this.setState({ status: STATUS.loading });

    try {
      const data = await getImages({ page, search });
      this.handleResolve(data);
    } catch (error) {
      this.setState({ status: STATUS.error });
      console.log(error);
    }
  };

  handleResolve = ({ hits, total, totalHits }) => {
    const sortedImages = hits.map(
      ({ id, webformatURL, tags, largeImageURL }) => ({
        id,
        webformatURL,
        tags,
        largeImageURL,
      })
    );

    if (!total) {
      Notify.failure(
        'Sorry, there are no images matching your search, please try another key word'
      );
      this.setState({ status: STATUS.idle });
      return;
    }

    if (totalHits < this.state.page * 12) {
      this.setState(({ images }) => ({
        images: [...images, ...sortedImages],
        status: STATUS.idle,
      }));
      Notify.failure(
        "We're sorry, but you've reached the end of search results"
      );
      return;
    }

    this.setState(({ images }) => ({
      images: [...images, ...sortedImages],
      status: STATUS.success,
    }));
    if (this.state.page === 1) {
      Notify.success(`That's what we found`);
    }
  };

  handleLoadMore = () => {
    this.setState(({ page }) => ({
      page: page + 1,
    }));
    Notify.success('Here you have more pictures');
  };

  openModal = image => {
    this.setState({ currentImage: image });
  };

  closeModal = () => {
    this.setState({ currentImage: null });
  };

  render() {
    const { images, status, currentImage } = this.state;

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: '16px',
          paddingBottom: '24px',
          color: '#122236',
          fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
          fontSize: '24px',
        }}
      >
        <Searchbar onSubmit={this.handleSearch} />

        {images.length > 0 && (
          <ImageGallery images={images} onClick={this.openModal} />
        )}

        {images.length > 0 && status === STATUS.success && (
          <Button onClick={this.handleLoadMore} />
        )}

        {status === STATUS.loading && <Loader />}

        {currentImage && (
          <Modal image={currentImage} onClose={this.closeModal} />
        )}

        {status === STATUS.error && (
          <h2
            style={{
              textAlign: 'center',
            }}
          >
            Oops... Something went wrong
          </h2>
        )}
      </div>
    );
  }
}
