import { Analytics } from "@vercel/analytics/react"
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
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Register" element={<Signup/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/Posts" element={<Posts/>}/>
        <Route path="/my-posts" element={<ManagePosts/>}/>
        <Route path="/Settings" element={<Settings/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
  ))

  return (
    <>
    <Analytics />
    <RouterProvider router={router} />
    </>
  )
}

export default App
