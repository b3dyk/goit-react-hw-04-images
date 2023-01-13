import { useEffect, useState } from 'react';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { getImages } from 'services/images.service';
import { STATUS } from 'constants/status.constants';
import Notify from 'services/notifications.service';

export const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [status, setStatus] = useState(STATUS.idle);

  useEffect(() => {
    const fetchData = async ({ page, search = '' }) => {
      setStatus(STATUS.loading);

      try {
        const data = await getImages({ page, search });
        handleResolve(data);
      } catch (error) {
        setStatus(STATUS.error);
        console.log(error);
      }
    };

    const handleResolve = ({ hits, total, totalHits }) => {
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
        setStatus(STATUS.idle);
        return;
      }

      if (totalHits < page * 12) {
        setImages(prevState => [...prevState, ...sortedImages]);
        setStatus(STATUS.idle);
        Notify.failure(
          "We're sorry, but you've reached the end of search results"
        );
        return;
      }

      setImages(prevState => [...prevState, ...sortedImages]);
      setStatus(STATUS.success);

      if (page === 1) {
        Notify.success(`That's what we found`);
      }
    };

    if (!search) {
      return;
    }

    fetchData({ page, search });
  }, [page, search]);

  const handleSearch = search => {
    if (!search) {
      Notify.warning('Please enter key word');
    }
    setSearch(search);
    setImages([]);
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prevState => prevState + 1);
    Notify.success('Here you have more pictures');
  };

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
      <Searchbar onSubmit={handleSearch} />

      {images.length > 0 && (
        <ImageGallery images={images} onClick={setCurrentImage} />
      )}

      {images.length > 0 && status === STATUS.success && (
        <Button onClick={handleLoadMore} />
      )}

      {status === STATUS.loading && <Loader />}

      {currentImage && <Modal image={currentImage} onClose={setCurrentImage} />}

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
};
