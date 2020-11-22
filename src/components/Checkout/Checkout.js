import Table from 'react-bootstrap/Table';
import { roundTo2DecimalCases } from '../../utils/utils';

const Checkout = props => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Basket Contents</th>
          <th>Raw total</th>
          <th>Total Discount</th>
          <th>Total Payable</th>
        </tr>
      </thead>
      <tbody>
        {props.basketTotal.map((basketItem, index) => {
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