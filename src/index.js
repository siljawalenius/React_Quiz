import ReactDOM from 'react-dom'
import React from 'react'
import Quiz from './Quiz'

function App() {
  return (
    <Quiz></Quiz>
  )
}

export default App

const rootElement = document.getElementById('root')
ReactDOM.render(<App></App>, rootElement)