import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [users, setUsers] = useState([])
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [id, setId] = useState(null)
  const [editUser, setEditUser] = useState({})

  const getUsers = () => {
    axios.get('http://localhost:8000/users')
      .then(({ data }) => setUsers(data))
      .catch((e) => console.log(e))
  }

  const createUser = (newUser) => {
    axios.post('http://localhost:8000/users', newUser)
      .then(() => {
        getUsers()
        setNewUser({ name: '', email: '', phone: '' })
      })
      .catch((e) => console.log(e))
  }

  const deleteUser = (id) => {
    axios.delete(`http://localhost:8000/users/${id}`)
      .then(() => {
        getUsers()
      })
      .catch((e) => console.log(e))
  }

  const editNewUser = (newData) => {
    axios.patch(`http://localhost:8000/users/${id}`, newData)
      .then(() => {
        getUsers()
        setId(null)
        setEditUser({})
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <>
      <h1>Создание пользователя</h1>
      <input
        type="text"
        placeholder="name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="phone"
        value={newUser.phone}
        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
      />
      <button onClick={() => createUser(newUser)}>Add user</button>

      <h1 className="text-center">Пользователи</h1>
      <div className="max-w-100 mx-auto">
        {users?.map((user) => {
          // Добавлен return!
          return user.id === id ? (
            <div className="m-5 border p-4" key={user.id}>
              <input
                value={editUser.name || ''}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                type="text"
                className="w-full border"
                placeholder="name"
              />
              <input
                value={editUser.email || ''}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                type="text"
                className="w-full border"
                placeholder="email"
              />
              <input
                value={editUser.phone || ''}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                type="text"
                className="w-full border"
                placeholder="number"
              />
              {/* Добавлен onClick для сохранения */}
              <button onClick={() => editNewUser(user.id, editUser)}>Confirm</button>
              <button onClick={() => setId(null)}>Cancel</button>
            </div>
          ) : (
            <div className="m-5 border p-4" key={user.id}>
              <h2>Имя: {user.name}</h2>
              <h2>Почта: {user.email}</h2>
              <h2>Телефон: {user.phone}</h2>
              <button className="border p-2" onClick={() => deleteUser(user.id)}>Delete user</button>
              <button
                onClick={() => {
                  setId(user.id)
                  setEditUser(user)
                }}
                className="border p-2"
              >
                Edit
              </button>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default App