import "bootstrap/dist/css/bootstrap.css";
import "./styles/style.css";
import { fetchData } from "./API";
import { IProduct, IOrderInfo, IOrder, ICartItems } from "./interfaces";
import { Modal, Offcanvas } from "bootstrap";
import { populateOrder } from "./populateOrder";

//(E2S1T3) - add when we are doing E3
//import { addToCart } from './btn-click-counter-trolley'
//addToCart() */

const rowEl = document.querySelector(".products-container");
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
    )
    .join("");

  //Test 1 THIS WORKS
  const disableButton = () => {
    products.forEach((product) => {
      if (product.stock_quantity < 1) {
        document
          .querySelector(`#product-num${product.id}`)!
          .setAttribute("disabled", "disabled");
      }
    });
  };

  disableButton();

  // render number of products to 'product overview' section
  // EX3T3 - change 'antal' to number in stock
  const inStockProducts = products.filter(
    (product) => product.stock_status === "instock"
  );

  // sort function from a-ö
  products.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  document.querySelector(".product-overview")!.innerHTML = `<div class="col-6">
<p>Antal produkter: ${products.length}</p>
<p>Varav ${inStockProducts.length} i lager</p>
</div>
<div class="col-6 filter">
<button type="button" class ="filter-button button">Filtrera (A-Ö)</button>
</div>
`;
  document.querySelector(".filter-button")?.addEventListener("click", () => {
    renderProducts();
  });
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

  // remove 'disabled' from betala-button when something is added to cart
  document.querySelector('.checkout-btn')?.removeAttribute('disabled')
};

// print out added items to cart
const renderToCart = () => {
  const order = populateOrder(cartItems);
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
                <button title="trash" class="btn-trash" data-id="${cartItem.id}"><img data-id="${cartItem.id}" class="btn-trash" src="/node_modules/bootstrap-icons/icons/trash3.svg" alt="Bootstrap" width="20" height="20"></button>
              </div>
              <div class="qty">
                <button title="btnMinus" class="btn-minus" data-id="${cartItem.id}"><img data-id="${cartItem.id}" class="btn-minus" src="/node_modules/bootstrap-icons/icons/dash-circle.svg" alt="Bootstrap" width="25" height="25"></button>
                <p data-id="${cartItem.id}" class="product-qty">${cartItem.qty}</p>
                <button title="btnPlus" class="btn-plus" data-id="${cartItem.id}"><img data-id="${cartItem.id}" class="btn-plus" src="/node_modules/bootstrap-icons/icons/plus-circle-fill.svg" alt="Bootstrap" width="25" height="25"></button>
                <p class="product-sum">Totalt: ${cartItem.item_total}kr (${cartItem.item_price}kr/st)</p>
              </div>
          </div>
        </div>
    `
    )
    .join("");

  document.querySelector(".offcanvas-body")!.innerHTML += `
  <div class="button-container">
  <button type="button" class="clr-button" data-bs-dismiss="offcanvas" aria-label="Close">Fortsätt handla</button>
  <button type="button" class="clr-button checkout-btn">Betala</button>
  </div>
 
  <div class="total_order_container">
  <h4>TOTALSUMMAN ${order.order_total} kr</h4>
  <p>Varav moms ${order.order_total / 4} kr</p>
  </div> 
  `;
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
    document.querySelector(".heading-container")!.innerHTML = `
            <h2 class="main-heading">${products[index].name}</h2>`;

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
    // add item to cart through modal 'lägg till' button
    document.querySelector('.modal-button')?.addEventListener('click', () => {
      findIndex()
      addToCart()
      renderToCart()
    })
  }
  // add item to cart through card 'lägg till'-button
  else if (clickedItem.className === "clr-button") {
    findIndex();
    addToCart();
    renderToCart();
  }
});


// ** Add / subtract / delete items inside of cart **
document.querySelector(".offcanvas-body")?.addEventListener("click", (e) => {
  // change nr of products in cart
  let clickedBtn;
  let clickedID: any;
  clickedBtn = e.target as HTMLButtonElement;

  // to be able to print out multiple qty i need to make an array of the elements
  const productQty = document.querySelectorAll(".product-qty");
  const productQtyArr = Array.from(productQty);
  const cartInfo = document.querySelectorAll(".cart-item");
  const cartInfoArr = Array.from(cartInfo);
  const productPrice = document.querySelectorAll(".product-sum");
  const productPriceArr = Array.from(productPrice);
  const totalSum = document.querySelector(".total_order_container");

  // only respond to button/img elements
  if (clickedBtn.tagName === 'BUTTON' || clickedBtn.tagName === 'IMG') {
    // when + is clicked
    if (clickedBtn.classList.contains("btn-plus")) {
      // get the product.id from the clicked product and save as index, add 1 to qty and print out new qty
      clickedID = clickedBtn.dataset.id
      index = cartItems.findIndex(product => product.id === Number(clickedID))
      cartItems[index].qty++
      cartItems[index].item_total = cartItems[index].qty * cartItems[index].item_price
      productQtyArr[index].innerHTML = `${cartItems[index].qty}`
      productPriceArr[index].innerHTML = `Totalt: ${cartItems[index].item_total}kr (${cartItems[index].item_price}kr/st)`
      const order = populateOrder(cartItems);
      totalSum!.innerHTML = `<h4>TOTALSUMMAN ${order.order_total} kr</h4><p>Varav moms ${order.order_total / 4} kr</p>`;
    } else if (clickedBtn.classList.contains('btn-trash')) {
      // do the same with trashcan, but remove item from cartItems arr and delete el from DOM 
      clickedID = clickedBtn.dataset.id
      index = cartItems.findIndex(product => product.id === Number(clickedID))
      cartItems.splice(index, 1)
      cartInfoArr[index].remove()
      const order = populateOrder(cartItems);
      totalSum!.innerHTML = `<h4>TOTALSUMMAN ${order.order_total} kr</h4><p>Varav moms ${order.order_total / 4} kr</p>`;
      // if there no longer is any items in cartItems, set 'betala-btn' to disabled
      if (cartItems.length < 1) {
        document.querySelector('.checkout-btn')?.setAttribute('disabled', 'disabled')
        totalSum!.innerHTML = ``;
      }
    } else if (clickedBtn.classList.contains('btn-minus')) {
      // do the same with -, but instead subtract by 1 and delete el from DOM 
      clickedID = clickedBtn.dataset.id
      index = cartItems.findIndex(product => product.id === Number(clickedID))
      if (cartItems[index].qty > 1) {
        cartItems[index].qty--;
        cartItems[index].item_total = cartItems[index].qty * cartItems[index].item_price;
        productQtyArr[index].innerHTML = `${cartItems[index].qty}`;
        productPriceArr[index].innerHTML = `Totalt: ${cartItems[index].item_total}kr (${cartItems[index].item_price}kr/st)`;
        const order = populateOrder(cartItems);
        totalSum!.innerHTML = `<h4>TOTALSUMMAN ${order.order_total} kr</h4><p>Varav moms ${order.order_total / 4} kr</p>`;
      } else {
        totalSum!.innerHTML = ``;
        cartItems.splice(index, 1)
        cartInfoArr[index].remove()
        // if there no longer is any items in cartItems, set 'betala-btn' to disabled
        document.querySelector('.checkout-btn')?.setAttribute('disabled', 'disabled')
      }
    } else if (clickedBtn.classList.contains('checkout-btn')) {
      modal.show()

      // print out headline to modal section
      document.querySelector('.heading-container')!.innerHTML = `
            <h2 class="main-heading">Kassa</h2>`

      // print checkout-section to DOM
      document.querySelector(".modal-body")!.innerHTML = `
      <div class="container">
        <div class="row">        
          <div class="col-6 modal-body checkout-products">
          test
          </div>
          <div class="col-6 modal-body customer-info">
            <form action="post">
              <div class="form-group mb-1">
                <label for="name">Namn</label>
                <input type="text" name="name" id="name" class="form-control" placeholder="Förnamn Efternamn">
              </div>
              <div class="form-group mb-1">
                <label for="adress">Adress</label>
                <input type="text" name="adress" id="adress" class="form-control" placeholder="Gatunamn">
              </div>
              <div class="row mb-1">
                <div class="col-5">
                  <label for="postcode">Postnr</label>
                  <input type="number" name="postcode" id="postcode" class="form-control" placeholder="123 45">
                </div>
                <div class="col-7">
                  <label for="city">Ort</label>
                  <input type="text" name="city" id="city" class="form-control" placeholder="Ort">
                </div>
              </div>
              <div class="form-group mb-1">
                <label for="phone">Telefon</label>
                <input type="tel" name="phone" id="phone" class="form-control" placeholder="+46 701 23 45 67">
              </div>
              <div class="form-group mb-3">
                <label for="email">Email</label>
                <input type="text" name="email" id="email" class="form-control" placeholder="exempel@mail.se">
              </div>
              <div class="col-12">
                <button type="submit" class="clr-button order-btn">Lägg order</button>
              </div>
            </form>
          </div>
        </div>
      </div>
        `


      // *** ORDER SECTION ***
      /* OBS GLÖM INTE LÄGGA TILL REQUIRED PÅ INPUT ELEMENTS IGEN INNAN MERGE */
      document.querySelector('.order-btn')?.addEventListener('click', () => {
        // print out headline to modal section
        document.querySelector('.heading-container')!.innerHTML = `
            <h2 class="main-heading">Orderbekräftelse</h2>`
        // print out order-section to DOM
        document.querySelector(".modal-dialog")!.innerHTML = `
         <div class="modal-content order-section">
          <div class="modal-body">
          </div>
        </div>
      </div>
        `
      })
    }
  }
})

