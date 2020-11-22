
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';

import ProductList from "../ProductList/ProductList";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Modal from '../../UI/Modal/Modal';
import Checkout from '../../components/Checkout/Checkout';
import * as productsService from '../../services/products';

const Basket = () => {
  const [ products, setProducts ] = useState([]);
  const [ basket, setBasket ] = useState({});

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    productsService.getAll()
      .then(products => {
        const basketUpdated = products.reduce((basket, product) => {
          return {
            ...basket,
            [product.id]: {
              name: product.name,
              amount: 0
            }
          }
        }, {});

        setProducts(products);
        setBasket(basketUpdated)
      })
      .catch(e => {
        console.log(e);
      });
  };

  const productAdded = id => {
    const { name, amount = 0 } = basket[id];
    const basketUpdated = {
      ...basket,
      [id]: {
        name,
        amount: amount + 1
      }
    }

    setBasket(basketUpdated);
  }

  const productRemoved = id => {
    const { name, amount = 1 } = basket[id];
    const basketUpdated = {
      ...basket,
      [id]: {
        name,
        amount: amount - 1
      }
    }

    setBasket(basketUpdated);
  }


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <Aux>
      <ProductList
        products={products}
        basket={basket}
        productAdded={productAdded}
        productRemoved={productRemoved}
      />
      <div className="text-center">
        <Button variant="primary" size="lg" onClick={() => handleShow()}>Checkout</Button>
      </div>
      <Modal show={show} closed={() => handleClose()} title="Basket Overview">
        <Checkout basket={basket}/>
      </Modal>
    </Aux>
  );
};

export default Basket;