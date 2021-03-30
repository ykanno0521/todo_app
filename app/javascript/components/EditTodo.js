import React, { useState, useEffect } from "react"
import axios from 'axios'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// スタイル定義---
const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
  margin: 12px 0;
`

const CurrentStatus = styled.div`
  font-size: 19px;
  margin: 8px 0 12px 0;
  font-weight: bold;
`
const IsCompletedButton = styled.button`
  color: #fff;
  font-weight: bold;
  font-size: 17px;
  padding: 5px 10px;
  background: #f2a115;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`
const EditButton = styled.button`
  color: #fff;
  font-weight: bold;
  font-size: 17px;
  padding: 5px 10px;
  margin: 0 10px;
  background: #0ac620;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`
const DeleteButton = styled.button`
  color: #fff;
  font-weight: bold;
  font-size: 17px;
  padding: 5px 10px;
  background: #f54242;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`
// ---

// 
toast.configure()

function EditTodo(props) {
  const initialTodoState = {
    id: null,
    name: "",
    is_completed: false
  }

  const [currentTodo, setCurrentTodo] = useState(initialTodoState)
  
  const notify = () => {
    toast.success('Todo successfully updated!!', {
      position: 'bottom-center',
      hideProgressBar: true
    })
  }

  const getTodo = (id) => {
    axios.get(`/api/v1/todos/${id}`)
    .then(resp => {
    setCurrentTodo(resp.data)
    })
    .catch(e => {
      console.log(e)
    })
  }

  useEffect(() => {
    // URLからIDを取得
    getTodo(props.match.params.id)
  }, [props.match.params.id])

  const handleInputChange = (evnet) => {
    const { name, value } = event.target
    setCurrentTodo({...currentTodo, [name]: value})
  }

  const updateisCompleted = val => {
    var data = {
      id: val.id,
      name: val.name,
      is_completed: !val.is_completed
    }
    axios.patch(`/api/v1/todos/${val.id}`, data)
      .then(resp => {
        setCurrentTodo(resp.data)
    })
  }
  const updateTodo = () => {
    axios.patch(`/api/v1/todos/${currentTodo.id}`, currentTodo)
      .then(resp => {
        notify()
        props.history.push('/todos')
      })
      .catch(e => {
      console.log(e)
    })
  }

  const deleteTodo = () => {
    const sure = window.confirm('Are you sure?')
    if (sure) {
      axios.delete(`/api/v1/todos/${currentTodo.id}`)
        .then(resp => {
        props.history.push('/todos')
        })
        .catch(e => {
        console.log(e)
      })
    }
  }
  
  return (
    <>
      <h1>Editing Todo</h1>
      <div>
        <div>
          <label htmlFor="name">Current Name</label>
          <InputName
            type="text"
            name="name"
            value={currentTodo.name}
            onChange={ handleInputChange}
          />
          <div>
            <span>Current Status</span>
            <CurrentStatus>
              {currentTodo.is_completed ? "Completed" : "Uncompleted"}
            </CurrentStatus>
          </div>
        </div>
        {currentTodo.is_completed ? (
          <IsCompletedButton
            onClick={() => updateisCompleted(currentTodo) }
          >
            Uncompleted
          </IsCompletedButton>
        ) : (
          <IsCompletedButton
            onClick={() => updateisCompleted(currentTodo) }
          >
            Completed
          </IsCompletedButton>
        )}
        <EditButton onClick={ updateTodo }>
          Update
        </EditButton>
        <DeleteButton onClick={ deleteTodo }>
          delete
        </DeleteButton>
      </div>
    </>  
  )
}

export default EditTodo