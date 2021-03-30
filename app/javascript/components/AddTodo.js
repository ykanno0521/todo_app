import React, {useState} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiSend } from 'react-icons/fi'
import { handleRemote } from '@rails/ujs'

const InputAndButton = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`
const InputName = styled.input`
  font-size: 20px;
  width: 100%;
  height: 40px;
  padding: 2px 7px;
`
const Button = styled.button`
  font-size: 20px;
  border: none;
  border-radius:  3px;
  margin-left: 10px;
  padding: 2px 10px;
  background: #1E90FF;
  color: #fff;
  text-align: center;
  cursor: pointer;
  ${({ disabled }) => disabled && `
    opacity: 0.5;
    cursor: default;
  `}
`
const Icon = styled.span`
  display: flex;
  align-items: center;
  margin: 0 7px;
`
// toastを表示
toast.configure()

// 関数コンポーネントに初期値を設定
function AddTodo(props) {
  const initialTodoState = {
    id: null,
    name: "",
    is_completed: false
  }

  // useStateで関数コンポーネントに状態を持たせる
  const [todo, setTodo] = useState(initialTodoState)

  // フォームに入力される毎に呼び出されstateを更新する
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    // console.log(name, value);
    setTodo({ ...todo, [name]: value})
  }

  // 新規登録成功時にtoastを表示させる
  const notify = () => {
    toast.success('Todo successfully created!!', {
      position: 'bottom-center',
      hideProgressBar: true
    })
  }

  // 入力したtodo.nameを保存する
  const saveTodo = () => {
    // console.log(data)
    // console.log(todo)
    var data = {
      name: todo.name
    }
    axios.post('/api/v1/todos', data)
      .then(resp => {
        console.log(resp)
        // stateの更新
        setTodo({
          id: resp.data.id,
          name: resp.data.name,
          is_completed: resp.data.is_completed
        })
        notify()
        // 画面遷移(前居た画面を履歴に追加し、ブラウザの戻るボタンで戻れるようにする)
        props.history.push('/todos')
      })
      .catch(e => {
        console.log(e)
      })
  }
  return (
    <>
      <h1>New Todo</h1>
      <InputAndButton>
        <InputName
          type="text"
          required
          value={todo.name}
          name="name"
          onChange={handleInputChange}
        />
        <Button
          onClick={saveTodo}
          disabled={(!todo.name || /^\s$/.test(todo.name))}
        >
        <Icon>
          <FiSend />
        </Icon>
        </Button>
      </InputAndButton>
    </>
  )
}

export default AddTodo
