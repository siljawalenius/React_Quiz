import ReactDOM from 'react-dom'
import React from 'react'
import Quiz, {Header} from './Quiz'

function App() {
  return (
    <div>
          <Header></Header>
         <Quiz></Quiz>

    </div>

  )
}

export default App

const rootElement = document.getElementById('root')
ReactDOM.render(<App></App>, rootElement)