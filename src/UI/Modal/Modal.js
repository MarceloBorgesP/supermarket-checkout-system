import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const UIModal = props => {
  return (
    <Modal show={props.show} onHide={props.closed}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.closed}>
          Close
        </Button>
        <Button variant="primary" onClick={props.closed}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UIModal;
