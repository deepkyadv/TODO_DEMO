import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { app } from "../firebase";
import Task from './Task';
import "./TodoList.css";

const db = getFirestore(app);

function TodoList() {
  const [todoName, setTodoName] = useState("");
  const [todoLists, setTodoLists] = useState([]);

  const addTodoList = async () => {
    try {
      const docRef = await addDoc(collection(db, "todolists"), {
        name: todoName,
      });
      alert("Todo List created with ID: " + docRef.id);
      setTodoName("");
      fetchTodoLists();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const fetchTodoLists = async () => {
    const q = query(collection(db, "todolists"));
    const querySnapshot = await getDocs(q);
    const lists = [];
    querySnapshot.forEach((doc) => {
      lists.push({ id: doc.id, ...doc.data() });
    });
    setTodoLists(lists);
  };

  useEffect(() => {
    fetchTodoLists();
  }, []);

  return (
    <div className='todo-list'>
      <h1>Todo Lists</h1>
      <input
        type="text"
        placeholder="Enter todo list name"
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
      />
      <button onClick={addTodoList}>Create Todo List</button>
      <div>
        {todoLists.map((list) => (
          <div key={list.id}>
            <h1>TODO Name:</h1><h2>{list.name}</h2>
            <Task todoListId={list.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
