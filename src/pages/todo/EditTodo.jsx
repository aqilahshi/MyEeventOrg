import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Button, Modal } from 'react-bootstrap';

const EditTodo = ({ todo, id }) => {
  const [updatedTodo, setUpdatedTodo] = useState(todo);
  const [showModal, setShowModal] = useState(false);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const updateTodo = async () => {
    try {
      const todoDocument = doc(db, 'todo', id);
      await updateDoc(todoDocument, {
        todo: updatedTodo,
      });
      handleModalClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleModalOpen}>
        Edit Todo
      </Button>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Todo Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            defaultValue={todo}
            onChange={(e) => setUpdatedTodo(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTodo}>
            Update Todo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditTodo;
