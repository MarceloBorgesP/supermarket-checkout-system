import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

const Product = props => {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>
        £{props.price}
        </Card.Text>
          <Button variant="success" onClick={props.added}>Add</Button>{' '}
          <Button variant="danger" onClick={props.removed} disabled={!props.amount}>Remove</Button>{' '}
          <Badge variant="light" className="float-right mt-3">{props.amount}x</Badge>
      </Card.Body>
    </Card>
  );
}

export default Product;