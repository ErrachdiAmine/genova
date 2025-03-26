import { Analytics } from "@vercel/analytics/react"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserRouter, Routes,Route, createRoutesFromElements, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Posts from "./pages/Posts"
import ManagePosts from "./pages/ManagePosts"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<MainLayout/>}>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Signup/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/profile/my-posts" element={<ManagePosts/>}/>
        <Route path="/posts" element={<Posts/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
  ))

  return (
    <>
    <Analytics />
    <RouterProvider router={router} />
    <ToastContainer />
    </>
  )
}

export default App
