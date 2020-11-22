import axios from 'axios';

export const getAll = () => {
  return axios
    .get('http://localhost:8081/products')
    .then(({ data }) => data.map(formatProductPrices));
};

export const get = id => {
  return axios.get(`http://localhost:8081/products/${id}`)
  .then(({ data }) => formatProductPrices(data));
};

const formatProductPrices = product => {
  let { promotions = [] } = product;

  promotions = promotions.map(promotion => {
    return {
      ...promotion,
      price: promotion.price / 100
    }

  });
  
  return {
    ...product,
    price: product.price / 100,
    promotions
  };
}
