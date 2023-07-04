import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, doc, deleteDoc, runTransaction, orderBy, query, updateDoc } from 'firebase/firestore';
import EditTodo from './EditTodo';

import { db } from '../../firebase';

const Todo = () => {
  const [createTodo, setCreateTodo] = useState('');
  const [todos, setTodos] = useState([]);
  const [checked, setChecked] = useState([]);
  const collectionRef = collection(db, 'todo');

  useEffect(() => {
    const getTodo = async () => {
      const q = query(collectionRef, orderBy('timestamp'));
      try {
        const todoSnapshot = await getDocs(q);
        const todoData = todoSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setTodos(todoData);
        setChecked(todoData);
      } catch (err) {
        console.log(err);
      }
    };

    getTodo();
  }, []);

  const submitTodo = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collectionRef, {
        todo: createTodo,
        isChecked: false,
        timestamp: serverTimestamp(),
      });
      setCreateTodo('');
      const newTodo = {
        todo: createTodo,
        isChecked: false,
        timestamp: new Date().toLocaleString(),
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this Task!')) {
        const documentRef = doc(db, 'todo', id);
        await deleteDoc(documentRef);
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkHandler = async (event, todo) => {
    setChecked((state) => {
      const indexToUpdate = state.findIndex((checkBox) => checkBox.id.toString() === event.target.name);
      const newState = [...state];
      newState.splice(indexToUpdate, 1, {
        ...state[indexToUpdate],
        isChecked: !state[indexToUpdate].isChecked,
      });
      setTodos(newState);
      return newState;
    });

    try {
      const docRef = doc(db, 'todo', event.target.name);
      await runTransaction(db, async (transaction) => {
        const todoDoc = await transaction.get(docRef);
        if (!todoDoc.exists()) {
          throw 'Document does not exist!';
        }
        const newValue = !todoDoc.data().isChecked;
        transaction.update(docRef, { isChecked: newValue });
      });
      console.log('Transaction successfully committed!');
    } catch (error) {
      console.log('Transaction failed: ', error);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const todoDocument = doc(db, 'todo', id);
      await updateDoc(todoDocument, {
        todo: updatedTodo,
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, todo: updatedTodo };
          }
          return todo;
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const openModal = () => {
    const modal = document.getElementById('addModal');
    modal.classList.add('show');
    modal.style.display = 'block';
  };

  const closeModal = () => {
    const modal = document.getElementById('addModal');
    modal.classList.remove('show');
    modal.style.display = 'none';
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-white">
              <div className="card-body">
                <button type="button" className="btn btn-info" onClick={openModal}>
                  Add Todo
                </button>

                {todos.map(({ todo, id, isChecked, timestamp }) => (
                  <div className="todo-list" key={id}>
                    <div className="todo-item">
                      <hr />
                      <span className={`${isChecked === true ? 'done' : ''}`}>
                        <div className="checker">
                          <span className="">
                            <input
                              type="checkbox"
                              defaultChecked={isChecked}
                              name={id}
                              onChange={(event) => checkHandler(event, todo)}
                            />
                          </span>
                        </div>
                        &nbsp;{todo}
                        <br />
                        <i>{new Date(timestamp.seconds * 1000).toLocaleString()}</i>
                      </span>
                      <span className="float-end mx-3">
                        <EditTodo todo={todo} id={id} updateTodo={updateTodo} />
                      </span>
                      <button type="button" className="btn btn-danger float-end" onClick={() => deleteTodo(id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade mt-12" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form className="d-flex" onSubmit={submitTodo}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">
                  Add Todo
                </h5>
                <button type="button" className="btn-close" onClick={closeModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a Todo"
                  value={createTodo}
                  onChange={(e) => setCreateTodo(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Todo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Todo;
