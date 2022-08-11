import React from 'react'
import { useRoutes } from 'react-router-dom'
import  Routes from './routes'
import './App.css'

export default function App() {
  const element = useRoutes(Routes)
  return (
      <div style={{height: '100%'}}>
        {element}
      </div>
  )
}
