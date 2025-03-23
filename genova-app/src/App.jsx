import { Analytics } from "@vercel/analytics/react"
import { createBrowserRouter, Routes,Route, createRoutesFromElements, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Posts from "./pages/Posts"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"
import Settings from "./pages/settings"

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<MainLayout/>}>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Register" element={<Signup/>}/>
        <Route path="/" element={<Home/>}/>
        <Route path="/Posts" element={<Posts/>}/>
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
