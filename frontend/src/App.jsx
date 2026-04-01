import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Product from './pages/Product'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import ProfilePage from './components/ProfilePage'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      {/* <ToastContainer /> */}
      <ToastContainer/>
      <Navbar></Navbar>
      <SearchBar></SearchBar>
      <Routes>
        <Route path='/' element={<Home></Home>} />
        <Route path='/collection' element={<Collection></Collection>}></Route>
        <Route path='/about' element={<About></About>}/>
        <Route path='/contact' element={<Contact></Contact>} ></Route>
        <Route path='/product/:productId' element={<Product></Product>}></Route>
        <Route path='/cart' element={<Cart></Cart>} />
        <Route path='/login' element={<Login></Login>}></Route>
        <Route path='/placeOrder' element={<PlaceOrder></PlaceOrder>}></Route>
<Route path='/orders' element={<Orders></Orders>}></Route>
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/verify' element={<Verify></Verify>}></Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
