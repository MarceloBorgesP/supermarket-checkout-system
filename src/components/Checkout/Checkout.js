import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import * as productsService from '../../services/products';
import { roundTo2DecimalCases } from '../../utils/utils';

const Checkout = props => {
  const [basketTotal, setBasketTotal] = useState([]);
  const { basket } = props;

  useEffect(() => {
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
    }, [basket]);

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
          console.log(item.price, basketItem.amount, promotion.amount);
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

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Basket Contents</th>
          <th>Raw total</th>
          <th>Total Promos</th>
          <th>Total Payable</th>
        </tr>
      </thead>
      <tbody>
        {basketTotal.map((basketItem, index) => {
          const quantity = basketItem.amount !== undefined
            ? <span className="font-weight-bold">{basketItem.amount}x</span>
            : basketItem.amount;

          return <tr key={index}>
            <td>{quantity} {basketItem.name}</td>
            <td>£{roundTo2DecimalCases(basketItem.price)}</td>
            <td className="text-danger">£{roundTo2DecimalCases(basketItem.discounts)}</td>
            <td className="text-success">£{roundTo2DecimalCases(basketItem.total)}</td>
          </tr>
        })}
      </tbody>
    </Table>
  );
}

export default Checkout;