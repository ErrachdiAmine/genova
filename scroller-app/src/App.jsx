
import { createBrowserRouter, Routes,Route, createRoutesFromElements, RouterProvider } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Home from "./pages/Home"
import Feeds from "./pages/Feeds"
import Reels from "./pages/Reels"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Signup from "./pages/Signup"

function App() {

  const router = createBrowserRouter(createRoutesFromElements(
      <Route path="/" element={<MainLayout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/Feeds" element={<Feeds/>}/>
        <Route path="/Reels" element={<Reels/>}/>
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
