import React from 'react'
import Header from './Components/Header'
import Home from './Components/Home'
import Response from './Components/Response'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

const App = () => {
  let routePath = createBrowserRouter([
    {
      path: "/",
      element: <Home/>
    },
    {
      path: "/response",
      element: <Response/>
    }
  ])
  return (
    <>
      <Header />
      <RouterProvider router={routePath} />
    </>
  )
}

export default App