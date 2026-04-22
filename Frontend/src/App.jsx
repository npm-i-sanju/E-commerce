import {createBrowserRouter, RouterProvider, Route} from 'react-router-dom';
import Home from "./pages/Home.jsx";
import ProductDetails from './pages/ProductDetails.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import LogoutPage from './pages/Logout.jsx';

const router = createBrowserRouter([
  {path:"/", element:<Home/>},
  {path:"/login",element:<Login/>},{
    path:"/register",element:<SignUp/>
  },{
    path:"/logout",element:<LogoutPage/>
  },{
    path:"/product/:id", element:<ProductDetails/>
  }
])

export default function App(){
  return (
    <RouterProvider router={router} />
  )
}