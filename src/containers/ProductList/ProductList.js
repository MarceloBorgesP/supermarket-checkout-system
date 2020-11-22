import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Product from '../../components/Product/Product'

const ProductList = props => {
  return (
    <Container className="mt-3">
      <Row>
        {props.products.map(product =>
          <Col
            className="mb-3"
            key={product.id}
            sm={6}
            md={6}
            lg={4}
          >
            <Product
              name={product.name}
              price={product.price}
              amount={props.basket[product.id]?.amount || 0}
              added={() => props.productAdded(product.id)}
              removed={() => props.productRemoved(product.id)}
            />
          </Col>)
        }
      </Row>
    </Container>
  );
}

export default ProductList;