import 'bootstrap/dist/css/bootstrap.css'
import './styles/style.css'
import { fetchData } from "./API";
import { IProduct, IOrderInfo, IOrder, ICartItems } from "./interfaces";
import { Modal } from "bootstrap";

//(E2S1T3) - add when we are doing E3
//import { addToCart } from './btn-click-counter-trolley'
//addToCart() */
const rowEl = document.querySelector('.row')
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

// Render products to DOM
const renderProducts = () => {
  rowEl!.innerHTML = products
    .map(product => `<div class="col-6 col-sm-4 col-lg-3">
         <div data-id="${product.id}" class="card mt-5">
           <img data-id="${product.id}" class="card-img img-fluid" src="${URL}${product.images.large}" alt="Image of ***">
           <div data-id="${product.id}" class="card-body">
              <h2 data-id="${product.id}" class="card-title pt-3">${product.name}</h2>
              <p data-id="${product.id}" class="card-text">${product.price} kr</p>
              <button class = "clr-button" data-id="${product.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-basket" viewBox="0 0 16 16">
              <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
              </svg>Lägg till</button>
           </div>
         </div>
       </div>
       `
    ).join('')
}


// *** TEST MODAL ***
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
}



rowEl?.addEventListener('click', e => {

  // save e.target to clickedItem
  clickedItem = e.target as HTMLElement

  // if click on picture, card, name or
  if (clickedItem.className !== "clr-button") {
    // call function to find index of products to print
    findIndex()
    // open modal
    modal.show()

    // print out headline to modal section
    document.querySelector('.heading-container')!.innerHTML = `
            <h2>${products[index].name}</h2>`

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
    // add button to cart through modal 'lägg till' button
    document.querySelector('.modal-button')?.addEventListener('click', e => {
      findIndex()
      addToCart()
      console.log(cartItems)
      document.querySelector('#cart-row')!.innerHTML = `
      <div>${cartItems[index].id}</div>
      <div>${cartItems[index].name}</div>
      <div>${cartItems[index].image}</div>
      <div>${cartItems[index].qty}</div>
      <div>${cartItems[index].item_price}</div>
      <div>${cartItems[index].item_total}</div>
  `

    })
  }
  // E3 - ADD TO CART 
  else if (clickedItem.className === "clr-button") {
    findIndex()
    addToCart()
    document.querySelector('#cart-row')!.innerHTML = `
    <div>${cartItems[index].id}</div>
    <div>${cartItems[index].name}</div>
    <div>${cartItems[index].image}</div>
    <div>${cartItems[index].qty}</div>
    <div>${cartItems[index].item_price}</div>
    <div>${cartItems[index].item_total}</div>
`
  }
})

// let order: IOrderInfo[] = []