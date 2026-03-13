import { createContext, useContext  , useState, useEffect} from "react";
import axios from "axios";
export const ShopContext = createContext();
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const ShopContextProvider = (props) =>{

    const currency = '₹';
    const delivery_fee = 30;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems , setCartItems]= useState({});
    const navigate = useNavigate();
    const [products,setProducts]= useState([]);
    const [token,setToken] = useState('');

    const addToCart = async (itemId,size)=>{

        if(!size){
            toast.error('Select Product Size');
            
            return;
        }
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size]=1;
        }
        setCartItems(cartData);

        if(token){
            try {
                await axios.post(backendUrl+'/api/cart/add',{itemId,size},{headers:{token}});

                
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

  const getCartCount = ()=>{
    let totalCount = 0;
    for(const items in cartItems){
        for(const item in cartItems[items]){
            try{
                if(cartItems[items][item]>0){
                    totalCount += cartItems[items][item];
                }
            }
            catch(err){
                console.log(err);
            }
        }
    }
    return totalCount;
  }


    // useEffect(()=>{
    //     console.log(cartItems);
    // },[cartItems]);

    const updateQuantity = async(itemId,size,quantity)=>{
        let cartData = structuredClone(cartItems);

        cartData[itemId][size]=quantity;
        setCartItems(cartData);
        if(token){
            try {
                await axios.post(backendUrl+'/api/cart/update',{itemId,size,quantity},{headers:{token}});
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    }

   // In your ShopContext file
const getCartAmount = () => {
    let totalAmount = 0;
    
    for(const items in cartItems) {
        for(const item in cartItems[items]) {
            if(cartItems[items][item] > 0) {
                let itemInfo = products.find((product) => product._id === items);
                if(itemInfo) {
                    totalAmount += itemInfo.price * cartItems[items][item];
                }
            }
        }
    }
    
    return totalAmount;
}

const getProductsData=async()=>{
    try {
        const res = await axios.get(backendUrl+'/api/product/list');
        if(res.data.success){
            setProducts(res.data.products);
        }
        else{
            toast.error(res.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error('Error fetching products');
    }

}
const getUserCart= async(token)=>{
    try {
        const res = await axios.post(backendUrl+ '/api/cart/get', {}, {headers:{token}});

        if(res.data.success){
            setCartItems(res.data.cartData);
        }
    } catch (error) {
        console.log(error);
        toast.error('Error fetching user cart');
    }

}

useEffect(()=>{
    getProductsData();
},[])

useEffect(()=>{
    if(!token && localStorage.getItem('token')){
        setToken(localStorage.getItem('token'));
        getUserCart(localStorage.getItem('token'));
    }
},[])

    const value = {
        products, currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems, addToCart,
        getCartCount,updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken,token, setCartItems
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;