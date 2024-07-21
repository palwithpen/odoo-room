import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router'
import Login from './pages/login'
import Rooms from './pages/rooms'
export default function App(){
  return(
    <Routes>
      <Route path='/' element={<Navigate to="/login" />}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/room" element={<Rooms/>}/>
      <Route path='*' element={<div className='notFound'></div>}/>
    </Routes>
  )
}