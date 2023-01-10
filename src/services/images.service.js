import axios from 'axios';

const imagesApi = axios.create({
  baseURL: 'https://pixabay.com/',
});

export const getImages = async ({ page, search } = {}) => {
  const { data } = await imagesApi.get(`api/`, {
    params: {
      key: '31237471-5a493734838c09426069ada78',
      per_page: 12,
      image_type: 'photo',
      orientation: 'horizontal',
      page,
      q: search,
    },
  });

  return data;
};
