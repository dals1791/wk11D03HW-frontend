import logo from './logo.svg';
import React, { useEffect } from 'react'
import './App.css';
import Form from "./Form"

function App() {
 const [products, setProducts] = React.useState([])
 const [singleProduct, setSingleProduct] = React.useState([])
 const [toggleReview, setToggleReview] = React.useState(false)
 const [reviews, setReviews] = React.useState([])
 const emptyReview={
  title: "",
  content: "",
  author: ""
 }
 const [selectedReview, setSelectedReview]=React.useState(emptyReview)
 
//  CRUD================================
  // GET
  const getProducts = async () =>{
    try{
      const res = await fetch('http://localhost:3000/products')
      const json = await res.json()
      setProducts(json)
    }
    catch(error){}
  }

  // GET Single Product =================================
  const getSingleProduct = async (id) =>{
    // console.log('this is id', id)
    try{
      const res = await fetch('http://localhost:3000/products/'+ id)
      const json = await res.json()
      setSingleProduct(json)
   
    }
    catch(error){}  
  }
  // GET all reviews for product =======================
  const getReviews = async (id) =>{
    console.log("this is the product id", id)
    try{
      const res = await fetch('http://localhost:3000/products/'+ id +'/reviews')
      const json = await res.json()
      setReviews(json)
      getSingleProduct(id)
      setToggleReview(true)
    }
    catch(error){}
  }
  
  // CREATE Review ===========================================
  const createReview =  (newReview) =>{
    // console.log(id)
    fetch('http://localhost:3000/products/'+ singleProduct.id+'/reviews', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newReview)
    }).then(()=>{getReviews(singleProduct.id)})
  }
  // UPDATE Review =======================================
  const updateReview =  (review) =>{
    console.log(review)
    fetch('http://localhost:3000/reviews/'+ review.id , {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(review)
    }).then(()=>{getReviews(singleProduct.id)})
  }
  // DELETE Review ========================================
  const deleteReview =  (review) =>{
    console.log(review)
    fetch('http://localhost:3000/reviews/'+ review.id , {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(review)
    }).then(()=>{getReviews(singleProduct.id)})
  }

  // +================================
  const handleToggle=()=>{
    setToggleReview(toggleReview=>!toggleReview)
  }
  const handleReviews = ()=>{
    return reviews.map(review=>{
          return(
            <div>
              <hr/>
              <p>Title: {review.title}</p>
              <p>msg: {review.content}</p>
              <p>Author:{review.author}</p>
              <p>Update this review:</p>
              <Form label="update" review={review} handleSubmit={updateReview}/>
              <button onClick={()=>{deleteReview(review)}}>DELETE REVIEW</button>
            </div>
          )
        })
  }
  const loaded=()=>{
    if (toggleReview){
      return (
        <div>
        <div>
          <img src={singleProduct.img}/>
        </div>
        <div>
          <ul style={{listStyle: "none"}}>
            <li>{singleProduct.name}</li>
            <li>${singleProduct.price}</li>
          </ul>
        </div>
        <button onClick={handleToggle}>back to all products</button>
        <p>Add a Review</p>
        <Form label="create" review={emptyReview} handleSubmit={createReview}/>
        
      </div>
      )

    }
    else{
      return products.map(product=>{
        return (
          <div>
            <div>
              <img src={product.img} onClick={()=>{getReviews(product.id)}}/>
            </div>
            <div>
              <ul style={{listStyle: "none"}}>
                <li>{product.name}</li>
                <li>${product.price}</li>
              </ul>
            </div>
          </div>
        )
      })
    }

  }
  const loading = <h2>Loading..</h2>
useEffect(()=>{getProducts()}, [])
  return (
    <div className="App">
      <header className="App-header">
        <div>
        {products ? loaded( ): loading}
        </div>
        <div>
          <h3>Reviews</h3>
        {reviews.length>0 ? handleReviews():<h2>No Reviews</h2>}
        </div>
      </header>
    </div>
  );
}

export default App;
