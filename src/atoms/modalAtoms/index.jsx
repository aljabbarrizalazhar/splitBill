import { Button, Modal } from "flowbite-react";
import PropTypes from "prop-types";

const ModalAtom = ({ show, onClose, onSubmit, title, children }) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={onSubmit} className="bg-secondary text-white rounded-md hover:bg-teal-500 transition duration-200">Simpan</Button>
      </Modal.Footer>
    </Modal>
  );
};

ModalAtom.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ModalAtom;
