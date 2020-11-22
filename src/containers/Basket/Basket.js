
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';

import ProductList from "../ProductList/ProductList";
import Aux from "../../hoc/Auxiliary/Auxiliary";
import Modal from '../../UI/Modal/Modal';
import Checkout from '../../components/Checkout/Checkout';
import * as productsService from '../../services/products';

const Basket = () => {
  const [products, setProducts] = useState([]);
  const [basket, setBasket] = useState({});
  const [basketTotal, setBasketTotal] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const calculateDiscounts = (item, basketItem) => {
    const { promotions } = item;

    if (!promotions.length) {
      return 0;
    }

    const evaluatePromotion = (totalDiscount, promotion) => {
      let discount = 0;

      switch (promotion.type) {
        case "BUY_X_GET_Y_FREE":
          if (basketItem.amount >= promotion.required_qty) {
            discount = item.price * promotion.free_qty;
          }
          break;
        case "FLAT_PERCENT":
          discount = item.price * basketItem.amount * (promotion.amount / 100);
          break;
        case "QTY_BASED_PRICE_OVERRIDE":
          if (basketItem.amount >= promotion.required_qty) {
            discount = item.price * promotion.required_qty - promotion.price;
          }
          break;
        default:
          break;
      }

      return totalDiscount + discount;
    }

    return promotions.reduce(evaluatePromotion, 0);
  };

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

  const calculateBasketTotal = () => {
    const promises = Object.keys(basket).map(id => {
      const basketItem = basket[id];

      return productsService
        .get(id)
        .then((data) => {
          const price = data.price * basketItem.amount;
          const discounts = calculateDiscounts(data, basketItem);
          const total = price - discounts

          return {
            ...basketItem,
            price,
            discounts,
            total
          };
        })
        .catch(console.log);
    }, []);

    Promise.all(promises).then(basket => {
      const total = Object.keys(basket).reduce((basketTotalAccumulator, index) => {
        const basketItem = basket[index];

        return {
          ...basketTotalAccumulator,
          price: basketTotalAccumulator.price + basketItem.price,
          discounts: basketTotalAccumulator.discounts + basketItem.discounts,
          total: basketTotalAccumulator.total + basketItem.total
        }
      }, { name: "Total", price: 0, discounts: 0, total: 0 });
      setBasketTotal([...basket, total]);
    });
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    calculateBasketTotal();
    setShow(true);
  }

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
        <Checkout basketTotal={basketTotal} />
      </Modal>
    </Aux>
  );
};

export default Basket;