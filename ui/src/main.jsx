import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { Provider } from "react-redux";
import { store } from './store'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
//https://docs.google.com/document/d/1SLWB9yJ9Vw6TM8q2q1BSWAG8mLT7DNCYlcPZPtvcL2M/edit