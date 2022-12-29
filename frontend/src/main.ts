import 'bootstrap/dist/css/bootstrap.css'
import './styles/style.css'
import { fetchData } from "./API";
import { IProduct, IOrderInfo, IOrder, ICartItems } from "./interfaces";
import { Modal, Offcanvas } from "bootstrap";

//(E2S1T3) - add when we are doing E3
//import { addToCart } from './btn-click-counter-trolley'
//addToCart() */

const rowEl = document.querySelector('.products-container')
const URL = 'https://www.bortakvall.se/'

// Empty array to fetch data to
let products: IProduct[] = []

// Get data from API and save it into products-array
const getProducts = async () => {
  const result = await fetchData()
  products = result.data
  renderProducts();
}

getProducts()

// LÄGG TILL IGEN
// <img data-id="${product.id}" class="card-img img-fluid" src="${URL}${product.images.large}" alt="Image of ***">

// Render products to DOM
const renderProducts = () => {
  
  

  rowEl!.innerHTML = products
    .map(product => `<div class="col-6 col-sm-4 col-lg-3">
         <div data-id="${product.id}" class="card mt-5">
        
           <div data-id="${product.id}" class="card-body">
              <h3 data-id="${product.id}" class="card-title pt-3">${product.name}</h3>
              <p data-id="${product.id}" class="card-text">${product.price} kr</p>
              <p data-id="${product.id}" class="card-text">${product.stock_quantity} i lager</p>
              <button id="product-num${product.id}" class = "clr-button" data-id="${product.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-basket" viewBox="0 0 16 16">
              <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
              </svg>Lägg till</button>
           </div>
         </div>
       </div>
       `
    ).join('')




 //Test 1 THIS WORKS
const disableButon = () => {
  products.forEach(product => {
     console.log(product)
     if (product.stock_quantity < 1){
        document.querySelector(`#product-num${product.id}`)!.setAttribute('disabled', 'disabled')

     }

  // document.querySelector(`#product-num${product.id}`)!.setAttribute('disabled', 'disabled')
         }); 
        }
console.log(products)
        
        
disableButon()


// //Test 2
// // to be able to print out multiple qty i need to make an array of the elements
// const OutOfStock = document.querySelectorAll('.clr-button')
// const OutOfStockArr = Array.from(OutOfStock)


// const NullStock = products
  
//   .filter(product => product.stock_quantity <1)
//   .map(product => {
   
//     if (product.stock_quantity === null){
      


      
//       // document.getElementById('product.id')!.setAttribute ('disabled', 'disabled')
//       console.log(product.stock_quantity)
//       //OutOfStockArr.forEach( item => item.setAttribute ('disabled', 'disabled'))
      
//     }
//   } )
//   console.log(NullStock)



//Test 3
  // function to disable 'lägg till' if item doesn't exist
//   const disableButons = () => {
//     const OutOFStock = products.filter( product => product.stock_quantity <1)
//     if (OutOFStock) {
//       products.forEach(product => { product.stock_quantity === null
//         // document.querySelector<HTMLButtonElement>(`#${product.id}`)!.disabled = product.stock_quantity === 0
//       });
//       console.log(OutOFStock)
//     } 
//   }
// disableButons()

// // Test 4

  
// const disableButton = () => {
//   // document.querySelector<HTMLButtonElement>(`#product-add${product.id}`)!.disabled  = 

// products.forEach(product => { 
//   product.stock_quantity === 0
// })
// };  
// console.log(disableButton)
// render number of products to 'product overview' section
// EX3T3 - change 'antal' to number in stock, if products.stock–status is not equal to in stock then filter out
const inStockProducts = products.filter( product => product.stock_status === 'instock') 


// sort function from a-ö
products
  .sort( (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
})


document.querySelector('.product-overview')!.innerHTML = `<div class="col-6">
<p>Antal produkter: ${products.length}</p>
<p>Varav ${inStockProducts.length} i lager</p>
</div>
<div class="col-6 filter">
<button type="button" class ="filter-button button">Filtrera (A-Ö)</button>
</div>
`
document.querySelector('.filter-button')?.addEventListener('click', () => {
  renderProducts()
})


// disableButon()
/*

tried to disable button if stock was null, no chance! 
products.filter ( (product) => {
  if (product.stock_quantity <= 1){
    document.querySelector('.clr-button')!.setAttribute('disabled', 'disabled')
  }
})



// const OutOfStock = products.filter(( product => product.stock_quantity <1)) 
//   console.log(OutOfStock) // logs all 10 items which are out of stock! how to access this?????
*/
// for(let i = 0; products[i].stock_quantity < 0 ; i ++) 
// {
// console.log(products[i].stock_quantity)
// }
// const OutOfStock = products.filter(( product => product.stock_quantity <1)) 
// OutOfStock.forEach(product => { 
//   product.stock_quantity === 'finns inte'
// });  
// const index = OutOfStock.findIndex(product => product.stock_quantity === )

  
  //document.querySelector('.clr-button')!.setAttribute('disabled', 'disabled')
  // you cannot add to cart????
  // console.log(OutOfStock)
}











// create variables to use modal (bootstrap)
const modalEl = document.getElementById('moreInfoModal')!
const modal = new Modal(modalEl)

// empty array to put cartItems in 
let cartItems: ICartItems[] = []

// should be able to be different depending on what eventListener used 
let clickedItem: any;
let index: any;

// function to find the index of the item clicked
const findIndex = () => {
  // save ID on clicked item to search for index
  const clickedID = clickedItem.dataset.id
  // search for index to get the rest of key values
  index = products.findIndex(product => product.id === Number(clickedID))
}


  
 

// function to push clicked item to the cartItems array
const addToCart = () => {
  cartItems.push({
    id: products[index].id,
    name: products[index].name,
    image: products[index].images.thumbnail,
    // need to figure out how to do qty & item total , with if statement inside push {}
    qty: 1,
    item_price: products[index].price,
    item_total: 12
  })

  // print out added items to cart
  document.querySelector('.offcanvas-body')!.innerHTML = cartItems
      .map(cartItem => `
      <div class="container cart-item">
            <div class="cart-img col-2">
              <img src="${URL}${cartItem.image}" alt="">
            </div>
            <br>
            <div class="cart-info col-10">
              <p class="cart-name">${cartItem.name}</p>
            </div>
          </div>
      `
  ).join('')

  document.querySelector('.offcanvas-body')!.innerHTML += `
  <div class="button-container">
  <button type="button" class="clr-button" data-bs-dismiss="offcanvas" aria-label="Close">Fortsätt handla</button>
  <button type="button" class="clr-button">Betala</button>
  </div>
  `
}

// ** listen for clicks on cards / 'lägg till'-button section **
rowEl?.addEventListener('click', e => {

  // save e.target to clickedItem
  clickedItem = e.target as HTMLElement




  // if click on picture, card, name or price
  if (clickedItem.className !== "clr-button") {
    // call function to find index of products to print
    findIndex()
    // open modal
    modal.show()

    // print out headline to modal section
    document.querySelector('.heading-container')!.innerHTML = `
            <h2 class="main-heading">${products[index].name}</h2>`

    // print modal to DOM
    document.querySelector('.modal-body')!.innerHTML = `
    <div class="container">
      <div class="row">        
        <div class="col-6">
          <img class="img-fluid modal-img" src="${URL}${products[index].images.large}" alt="">
          <h3 class="modal-title pt-3 text-center">${products[index].name}</h3>
        </div>
        <div class="col-6 modal-body text-center">
          <p class="text-center">Produktinformation<p>
          <p class="text-center">Artikel nr: ${products[index].id}</p>
              ${products[index].description}
          <p class="modal-price text-center">${products[index].price} kr</p>
          <button id="modal-button" class="text-center clr-button modal-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-basket" viewBox="0 0 16 16">
          <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
          </svg>Lägg till</button>
        </div>
      </div>
    </div>
        `
    // add item to cart through modal 'lägg till' button
    document.querySelector('.modal-button')?.addEventListener('click', () => {
      // disableButon()
      findIndex()
 
      addToCart()
    })
  }
  // add item to cart through card 'lägg till'-button
  else if (clickedItem.className === "clr-button") {
    
    findIndex()
    addToCart()
  }
})