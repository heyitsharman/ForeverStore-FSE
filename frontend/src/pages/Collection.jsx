import React, {useState, useContext, useEffect} from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';


const Collection = () => {
  const {products, search, showSearch} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts]=useState([]);
const [category , setCategory]= useState([]);
const [subCategory, setSubCategory] = useState([]);
const [sortType,setSortType] = useState('relevant');

const toggleCategory = (e)=>{
  if(category.includes(e.target.value)){
    setCategory(prev=> prev.filter(item=> item != e.target.value))
  }
  else{
    setCategory(prev => [...prev,e.target.value])
  }
}

const toggleSubcategory = (e) =>{
  if(subCategory.includes(e.target.value)){
    setSubCategory(prev=> prev.filter(item=> item != e.target.value));
  }
  else{
    setSubCategory(prev => [...prev,e.target.value]);
  }
}

const applyFilter = () =>{
  let productsCopy = products.slice();
  if(showSearch && search){
    productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
  }
  if(category.length > 0){
    productsCopy = productsCopy.filter(item => category.includes(item.category));
  }
  if(subCategory.length > 0){
    productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
  }
  
  // Apply sorting after filtering
  switch(sortType){
    case 'low-high':
      productsCopy.sort((a,b)=>(a.price - b.price));
      break;
    case 'high-low':
      productsCopy.sort((a,b)=>(b.price-a.price));
      break;
    default:
      break;
  }
  
  setFilterProducts(productsCopy);
}

//   if (Array.isArray(products)) {
//     setFilterProducts(products);
//   }
// }, [products]);

// useEffect(()=>{
//   console.log(subCategory);
// },[subCategory])

useEffect(()=>{
  applyFilter();
},[category,subCategory,search,showSearch,products,sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
      {/* Filter options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)}  className='my-2 text-xl flex-items cursor-pointer gap-2'>FILTERS
          <img src={assets.dropdown_icon} alt="" className={`h-3 sm:hidden ${showFilter? 'rotate-90':''}`} />
        </p>
        
        {/* catergory filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '':'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex-gap-2'>
              <input type="checkbox" name="" id="" value={'Men'} className='w-3' onChange={toggleCategory}/> Men
            </p>
            <p className='flex-gap-2'>
              <input type="checkbox" name="" id="" value={'Women'}className='w-3' onChange={toggleCategory}/> Women
            </p>
            <p className='flex-gap-2'>
              <input type="checkbox" name="" id="" value={'Kids'}className='w-3' onChange={toggleCategory}/> Kids
            </p>
          </div>
        </div>
          {/* subcateggory filter */}
             <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '':'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex-gap-2'>
              <input type="checkbox" name="" id="" value={'Topwear'}className='w-3' onChange={toggleSubcategory}/> Topwear
            </p>
            <p className='flex-gap-2'>
              <input type="checkbox" name="" id="" value={'Bottomwear'}className='w-3' onChange={toggleSubcategory}/> BottomWear
            </p>
            <p className='flex-gap-2'>
              <input type="checkbox" name="" id="" value={'Winterwear'}className='w-3' onChange={toggleSubcategory}/> Winterwear
            </p>
          </div>
        </div>
      </div>
    
    {/* Right side */}
    <div className='flex-1'>
      <div className='flex justify-between text-base sm:text-2xl mb-4'>
        <Title text1={'ALL'} text2={'COLLECTIONS'}></Title>
        {/* profuct Sort */}
        <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
          <option value="relavent">Sort by Relavant</option>
          <option value="low-high">Sort by Low to High</option>
          <option value="high-low"> Sort by High to Low</option>
        </select>
      </div>

      {/* map products */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
             {Array.isArray(filterProducts) &&
  filterProducts.map((item, index) => (
    <ProductItem
      key={index}
      name={item.name}
      id={item._id}
      price={item.price}
      images={item.images}
    />
  ))}

 

      </div>
    </div>


    </div>
  )
}

export default Collection
