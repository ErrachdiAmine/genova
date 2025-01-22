
import { createBrowserRouter, Routes,Route, createRoutesFromElements, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Posts from "./pages/Posts"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<MainLayout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/posts" element={<Posts/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Register" element={<Signup/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Route>
  ))

  return (
    <> 
    <RouterProvider router={router} />
    </>
  )
}

export default App
