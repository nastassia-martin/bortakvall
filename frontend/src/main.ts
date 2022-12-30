import "bootstrap/dist/css/bootstrap.css";
import "./styles/style.css";
import { fetchData } from "./API";
import { IProduct, IOrderInfo, IOrder, ICartItems } from "./interfaces";
import { Modal, Offcanvas } from "bootstrap";
import { populateOrder } from "./populateOrder";

//(E2S1T3) - add when we are doing E3
//import { addToCart } from './btn-click-counter-trolley'
//addToCart() */

const rowEl = document.querySelector(".row");
const URL = "https://www.bortakvall.se/";

// Empty array to fetch data to
let products: IProduct[] = [];

// Get data from API and save it into products-array
const getProducts = async () => {
  const result = await fetchData();
  products = result.data;
  renderProducts();
};

getProducts();

// Render products to DOM
const renderProducts = () => {
  rowEl!.innerHTML = products
    .map(
      (product) => `<div class="col-6 col-sm-4 col-lg-3">
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
    )
    .join("");
};

// create variables to use modal (bootstrap)
const modalEl = document.getElementById("moreInfoModal")!;
const modal = new Modal(modalEl);

// should be able to be different depending on what eventListener used
let clickedItem: any;
let index: any;

// function to find the index of the item clicked
const findIndex = () => {
  // save ID on clicked item to search for index
  const clickedID = clickedItem.dataset.id;
  // search for index to get the rest of key values
  index = products.findIndex((product) => product.id === Number(clickedID));
};

// empty array to put cartItems in
let cartItems: ICartItems[] = [];

// function to push clicked item to the cartItems array
const addToCart = () => {
  // put a new item in cart with qty 1, if there is no items added already
  if (!cartItems[0]) {
    cartItems.unshift({
      id: products[index].id,
      name: products[index].name,
      image: products[index].images.thumbnail,
      qty: 0,
      item_price: products[index].price,
      item_total: products[index].price,
    });
  }

  // look for a product already in cart with the same id as the one being added
  let doubleID = cartItems.find((item) => item.id === products[index].id);

  // find the index of the cart item that has the same id as the one being added,
  // instead of adding a new one, only add qty of that item and count item_total
  if (doubleID) {
    const index = cartItems.findIndex((product) => product.id === doubleID?.id);
    cartItems[index].qty++;
    cartItems[index].item_total =
      cartItems[index].qty * cartItems[index].item_price;
  }
  // if no dublicates was found, put the item in cart with qty 1
  else {
    cartItems.unshift({
      id: products[index].id,
      name: products[index].name,
      image: products[index].images.thumbnail,
      qty: 1,
      item_price: products[index].price,
      item_total: products[index].price,
    });
  }

  const order = populateOrder(cartItems);

  // print out added items to cart
  document.querySelector(".offcanvas-body")!.innerHTML = cartItems
    .map(
      (cartItem) => `
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
    )
    .join("");

  // print out added items to cart
  document.querySelector(".offcanvas-body")!.innerHTML = cartItems
    .map(
      (cartItem) => `
    <div class="container cart-item">
          <div class="cart-img col-2">
            <img src="${URL}${cartItem.image}" alt="">
          </div>
          <br>
          <div class="cart-info col-9">
              <div class="product-name">
                <p class="cart-name">${cartItem.name}</p>
                <button title="trash" class="btn trash"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><svg xmlns="http://www.w3.org/2000/svg"
                width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                </svg></button>
              </div>
              <div class="qty">
                <button title="btnMinus" class="btn minus"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                </svg></button>
                <p>${cartItem.qty}</p>
                <button title="btnPlus" class="btn plus"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg></i></button>
                <p class="product-sum">Totalt: ${cartItem.item_total}kr (${cartItem.item_price}kr/st)</p>
              </div>
          </div>
        </div>
    `
    )
    .join("");

  // print out 'fortsätt handla' and 'betala' buttons to cart
  document.querySelector(".offcanvas-body")!.innerHTML += `
  <div class="button-container">
  <button type="button" class="clr-button" data-bs-dismiss="offcanvas" aria-label="Close">Fortsätt handla</button>
  <button type="button" class="clr-button">Betala</button>
  </div>
 
  <div class ="total_order_container">
  <h4>TOTALSUMMAN ${order.order_total} kr<h4>
  <p>Varav moms ${order.order_total / 4} kr<p>
  </div> 
  `;

  // change nr of products in cart
  const minusBtn = document.querySelector(".minus");
  const plusBtn = document.querySelector(".plus");
  const trashBtn = document.querySelector(".trash");

  minusBtn?.addEventListener("click", () => {
    console.log("HEJ");
  });

  plusBtn?.addEventListener("click", () => {
    console.log("HEJ");
  });

  trashBtn?.addEventListener("click", () => {
    
  });
};

rowEl?.addEventListener("click", (e) => {
  // save e.target to clickedItem
  clickedItem = e.target as HTMLElement;

  // if click on picture, card, name or price
  if (clickedItem.className !== "clr-button") {
    // call function to find index of products to print
    findIndex();
    // open modal
    modal.show();

    // print out headline to modal section

    document.querySelector(
      ".heading-container"
    )!.innerHTML = `<h2>${products[index].name}</h2>`;

    // print modal to DOM
    document.querySelector(".modal-body")!.innerHTML = `
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
        `;
    // add button to cart through modal 'lägg till' button
    document.querySelector(".modal-button")?.addEventListener("click", () => {
      findIndex();
      addToCart();
    });
  }
  // add item to cart through card 'lägg till'-button
  else if (clickedItem.className === "clr-button") {
    findIndex();
    addToCart();
  }
});
