import "bootstrap/dist/css/bootstrap.css"
import "./styles/style.css"
import { fetchData } from "./API"
import { IProduct, IOrderInfo, IOrder, ICartItems, IConfirmation, IConfirmationResult } from "./interfaces"
import { Modal, Offcanvas } from "bootstrap"
import { populateOrder } from "./populateOrder"
import { fetchOrder, postOrder } from "./post"

const rowEl = document.querySelector(".products-container")
const URL = "https://www.bortakvall.se/"

// Get items from localStorage
const jsonProducts = localStorage.getItem('stock_qty') ?? '[]'
const jsonCart = localStorage.getItem('cart_items') ?? '[]'

// Array for products, with products from localStorage if there is any
let products: IProduct[] = JSON.parse(jsonProducts)

// Get data from API and save it into products-array
const getProducts = async () => {
  const result = await fetchData()
  // IF localstorage is empty, fill products array 
  if (products.length <= 0) {
    products = result.data
  }
  checkStockStatus()
  renderProducts()
  if (cartItems) {
    renderToCart()
  }
}

getProducts()

// Check if products are in stock, set value from null to 0
const checkStockStatus = () => {
  products.forEach((product) => {
    if (product.stock_quantity < 1) {
      product.stock_quantity = 0
    }
  })
}

// Render products to DOM
const renderProducts = () => {
  rowEl!.innerHTML = products
    .map(
      (product) => `<div class="col-6 col-sm-4 col-lg-3">
         <div data-id="${product.id}" class="card mt-5">
          <img data-id="${product.id}" class="card-img img-fluid" src="${URL}${product.images.thumbnail}" alt="Image of ***">
           <div data-id="${product.id}" class="card-body">
              <h3 data-id="${product.id}" class="card-title pt-3">${product.name}</h3>
              <p data-id="${product.id}" class="card-text">${product.price} kr</p>
              <p data-id="${product.id}" class="card-text stock-qty">${product.stock_quantity} i lager</p>
              <button id="product-num${product.id}" class="clr-button" data-id="${product.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-basket" viewBox="0 0 16 16">
              <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
              </svg>Lägg till</button>
           </div>
         </div>
       </div>
       `
    )
    .join("")

  products.forEach((product) => {
    if (product.stock_status === "outofstock") {
      document
        .querySelector(`#product-num${product.id}`)!
        .setAttribute("disabled", "disabled")
    }
  })

  // filter the products not in stock
  let inStockProducts = products.filter(
    (product) => product.stock_quantity > 0
  )

  // print out stock overview top left
  document.querySelector(".product-overview")!.innerHTML = `
  <div class="col-6">
    <p>Antal produkter: ${products.length}</p>
    <p>Varav ${inStockProducts.length} i lager</p>
  </div>
  <div class="col-6 filter">
    <button type="button" class="clr-button">Filtrera (A-Ö)</button>
  </div>`

  // sort function from a-ö
  const sortProducts = () => {
    products.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
  }

  document.querySelector(".filter-button")?.addEventListener("click", () => {
    // only sort the products if filter-btn is pressed
    sortProducts()
    renderProducts()
  })
}

// create variables to use modal (bootstrap)
const modalEl = document.getElementById("moreInfoModal")!
const modal = new Modal(modalEl)

// should be able to be different depending on what eventListener used
let clickedItem: any
let index: number
let productIndex: any

// function to find the index of the item clicked
const findIndex = () => {
  // save ID on clicked item to search for index
  const clickedID = clickedItem.dataset.id
  // search for index to get the rest of key values
  index = products.findIndex((product) => product.id === Number(clickedID))
}

// empty array to put cartItems in
let cartItems: ICartItems[] = JSON.parse(jsonCart)

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
    })
  }

  // look for a product already in cart with the same id as the one being added
  let doubleID = cartItems.find((item) => item.id === products[index].id)

  // find the index of the cart item that has the same id as the one being added,
  // instead of adding a new one, only add qty of that item and count item_total
  if (doubleID) {
    const index = cartItems.findIndex((product) => product.id === doubleID?.id)
    // only add to cart if stock_quantity is > 0
    if (products[index].stock_quantity) {
      cartItems[index].qty++
    }
    cartItems[index].item_total =
      cartItems[index].qty * cartItems[index].item_price
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
    })
  }

  // remove 'disabled' from betala-button when something is added to cart
  document.querySelector('.checkout-btn')?.removeAttribute('disabled')

  // adjust stock_quantity of added item
  if (products[index].stock_quantity >= 1) {
    products[index].stock_quantity--
    renderProducts()
    if (!products[index].stock_quantity) {
      products[index].stock_status = "outofstock"
      renderProducts()
    }
  }
  // save products to localstorage
  saveItems()
}

const saveItems = () => {
  localStorage.setItem('stock_qty', JSON.stringify(products))
  localStorage.setItem('cart_items', JSON.stringify(cartItems))

  // behöver lägga till när man trycker på +, - och trash
}



// print out added items to cart
const renderToCart = () => {
  const order = populateOrder(cartItems)
  document.querySelector(".offcanvas-body")!.innerHTML = cartItems
    .map(
      (cartItem) => `
    <div class="container cart-item">
          <div class="cart-img col-2">
            <img src="${URL}${cartItem.image}" alt="image of ${cartItem.name}">
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
                <p class="err"></p>
                <p class="product-sum">Totalt: ${cartItem.item_total}kr (${cartItem.item_price}kr/st)</p>
              </div>
          </div>
        </div>
    `
    )
    .join("")


  document.querySelector(".offcanvas-body")!.innerHTML += `
  <div class="button-container">
  <button type="button" class="clr-button mx-1" data-bs-dismiss="offcanvas" aria-label="Close">Fortsätt handla</button>
  <button type="button" class="clr-button mx-1 checkout-btn">Gå till kassan</button>
  </div>
 
  <div class="total_order_container">
  <h4>TOTALSUMMAN ${order.order_total} kr</h4>
  <p>Varav moms ${order.order_total / 4} kr</p>
  </div> 
  `
}

rowEl?.addEventListener("click", (e) => {
  // save e.target to clickedItem
  clickedItem = e.target as HTMLElement

  // if click on picture, card, name or price
  if (clickedItem.tagName !== "DIV" && clickedItem.className !== "clr-button") {
    // call function to find index of products to print
    findIndex()
    // open modal
    modal.show()

    // print out headline to modal section
    document.querySelector(".heading-container")!.innerHTML = `
    <h2 class="main-heading">${products[index].name}</h2>`

    // print modal to DOM
    document.querySelector(".modal-body")!.innerHTML = `
    <div class="container">
      <div class="row">        
        <div class="col-sm-12 col-md-12 col-lg-6">
          <img class="img-fluid modal-img" src="${URL}${products[index].images.large}" alt="image of ${products[index].name}">
          <h3 class="modal-title pt-3 text-center">${products[index].name}</h3>
        </div>
        <div class="col-sm-12 col-md-12 col-lg-6 modal-body text-center">
          <p class="text-center">Produktinformation<p>
          <p class="text-center">Artikel nr: ${products[index].id}</p>
              ${products[index].description}
          <p class="modal-price text-center">${products[index].price} kr</p>
          <button id="product-num${products[index].id}" class="text-center clr-button modal-button" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
          class="bi bi-basket" viewBox="0 0 16 16">
          <path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
          </svg>Lägg till</button>
        </div>
      </div>
    </div>`
    // if product is out of stock, disable 'lägg till'-btn 
    if (products[index].stock_status === "outofstock") {
      document
        .querySelector(`#product-num${products[index].id}`)!
        .setAttribute("disabled", "disabled")
    }

    // add item to cart through modal 'lägg till' button
    document.querySelector('.modal-button')?.addEventListener('click', () => {
      findIndex()
      addToCart()
      renderToCart()
    })
  }
  // add item to cart through card 'lägg till'-button
  else if (clickedItem.className === "clr-button") {
    findIndex()
    addToCart()
    renderToCart()
  }
})


// ** Add / subtract / delete items inside of cart **
document.querySelector(".offcanvas-body")?.addEventListener("click", (e) => {
  let clickedBtn: any
  clickedBtn = e.target as HTMLButtonElement

  // to be able to print out the clicked item i made arrays of the elements
  const productQty = document.querySelectorAll(".product-qty")
  const productQtyArr = Array.from(productQty)
  const cartInfo = document.querySelectorAll(".cart-item")
  const cartInfoArr = Array.from(cartInfo)
  const productPrice = document.querySelectorAll(".product-sum")
  const productPriceArr = Array.from(productPrice)
  const err = document.querySelectorAll('.err')
  const errArr = Array.from(err)
  const totalSum = document.querySelector(".total_order_container")

  // get the product.id from the clicked product and save as index, add 1 to qty and print out new qty
  const getClickedIndex = () => {
    let clickedID: any
    clickedID = clickedBtn.dataset.id
    index = cartItems.findIndex(product => product.id === Number(clickedID))
    productIndex = products.findIndex((product) => product.id === Number(clickedID))
  }

  // count item_total and render new qty and total sum
  const updateQty = () => {
    cartItems[index].item_total = cartItems[index].qty * cartItems[index].item_price
    productQtyArr[index].innerHTML = `${cartItems[index].qty}`
    productPriceArr[index].innerHTML = `Totalt: ${cartItems[index].item_total}kr (${cartItems[index].item_price}kr/st)`
    const order = populateOrder(cartItems)
    totalSum!.innerHTML = `<h4>TOTALSUMMAN ${order.order_total} kr</h4><p>Varav moms ${order.order_total / 4} kr</p>`
  }

  // remove chosen item from array and cart and print out new sum
  const removeFromCart = () => {
    cartItems.splice(index, 1)
    cartInfoArr[index].remove()
    const order = populateOrder(cartItems)
    totalSum!.innerHTML = `<h4>TOTALSUMMAN ${order.order_total} kr</h4><p>Varav moms ${order.order_total / 4} kr</p>`
  }

  // if there no longer is any items in cartItems, set 'betala-btn' to disabled
  const disableCheckoutBtn = () => {
    if (cartItems.length < 1) {
      document.querySelector('.checkout-btn')?.setAttribute('disabled', 'disabled')
      totalSum!.innerHTML = ``
    }
  }

  // render updated stock values to DOM and save items to localstorage
  const renderAndSave = () => {
    renderProducts()
    saveItems()
  }

  // only respond to button/img element clicks
  if (clickedBtn.tagName === 'BUTTON' || clickedBtn.tagName === 'IMG') {
    if (clickedBtn.classList.contains("btn-plus")) {
      getClickedIndex()
      if (products[productIndex].stock_quantity) {
        cartItems[index].qty++
        products[productIndex].stock_quantity--
        updateQty()
        renderAndSave()
      } else {
        errArr[index]!.innerHTML = `0 i lager`
        setTimeout(() => {
          errArr[index]!.innerHTML = ``
        }, 2000);
      }
    } else if (clickedBtn.classList.contains('btn-trash')) {
      getClickedIndex()
      const resetQty = cartItems[index].qty
      removeFromCart()
      disableCheckoutBtn()
      products[productIndex].stock_quantity += resetQty
      products[productIndex].stock_status = "instock"
      renderAndSave()
    } else if (clickedBtn.classList.contains('btn-minus')) {
      getClickedIndex()
      if (cartItems[index].qty > 1) {
        cartItems[index].qty--
        products[productIndex].stock_quantity++
        products[productIndex].stock_status = "instock"
        updateQty()
        renderAndSave()
      } else {
        removeFromCart()
        products[productIndex].stock_quantity++
        products[productIndex].stock_status = "instock"
        document.querySelector('.checkout-btn')?.setAttribute('disabled', 'disabled')
        renderAndSave()
      }
    } else if (clickedBtn.classList.contains('checkout-btn')) {
      modal.show()
      renderCheckout()
      sendOrder()
    }
  }
})

const renderCheckout = () => {
  // print out headline to modal section
  document.querySelector('.heading-container')!.innerHTML = `
            <h2 class="main-heading">Kassa</h2>`

  // print modal to DOM
  const order = populateOrder(cartItems)
  document.querySelector(".modal-body")!.innerHTML = `
      <div class="container">
        <div class="row gy-4">     
          <div class="col-sm-12 col-md-12 col-lg-6 checkout-products">
          </div>
          <div class="col-sm-12 col-md-12 col-lg-6 customer-info">
            <form id="new-order">
              <div class="form-group mb-1">
              <label for="first-name">Förnamn</label>
              <input type="text" name="first-name" id="first-name" class="form-control" placeholder="Förnamn" required>
              </div>
              <div class="form-group mb-1">
              <label for="last-name">Efternamn</label>
              <input type="text" name="last-name" id="last-name" class="form-control" placeholder="Efternamn" required>
              </div>
              <div class="form-group mb-1">
                <label for="adress">Adress</label>
                <input type="text" name="adress" id="adress" class="form-control" placeholder="Gatunamn" required>
              </div>
              <div class="row mb-1">
                <div class="col-5">
                  <label for="postcode">Postnr</label>
                  <input type="text" name="postcode" id="postcode" class="form-control" placeholder="123 45" maxlength="5" required>
                </div>
                <div class="col-7">
                  <label for="city">Ort</label>
                  <input type="text" name="city" id="city" class="form-control" placeholder="Ort" required>
                </div>
              </div>
              <div class="form-group mb-1">
                <label for="email">Email</label>
                <input type="text" name="email" id="email" class="form-control" placeholder="exempel@mail.se" required>
              </div>
              <div class="form-group mb-3">
                <label for="phone">Telefon</label>
                <input type="tel" name="phone" id="phone" class="form-control" placeholder="+46 701 23 45 67">
              </div>
              <div >
                <button type="submit" role="button" class="clr-button lagg-order">Lägg order</button>
              </div>
            </form>
          </div>
          <div class="total_order_container">
              <h4>TOTALSUMMAN ${order.order_total} kr</h4>
              <p>Varav moms ${order.order_total / 4} kr</p>
          </div> 
        </div>
      </div>
        `
  document.querySelector('.checkout-products')!.innerHTML = cartItems
    .map(
      (cartItem) => `
              <div class="container-md cart-item py-2">
              <div class="cart-img col-2">
                <img class="img-fluid" src="${URL}${cartItem.image}" alt="image of ${cartItem.name}">
              </div>
              <div class="cart-info col-10">
                <div class="product-name checkout-info">
                  <p class="cart-name">Produkt</p>
                  <p class="product-qty">Antal</p>
                  <p class="product-sum">Totalt:</p>
                </div>
                <div class="product-name checkout-product">
                  <p class="cart-name">${cartItem.name}</p>
                  <p data-id="${cartItem.id}" class="product-qty">${cartItem.qty}</p>
                  <p class="product-sum">${cartItem.item_total}kr (${cartItem.item_price}kr/st)</p>
                </div>
              </div>
            </div>`
    )
    .join('')
}


const sendOrder = () => {
  document.querySelector('#new-order')?.addEventListener('submit', async e => {
    e.preventDefault()

    const ItemOrder = populateOrder(cartItems)
    const newOrder: IOrder = {
      customer_first_name: document.querySelector<HTMLInputElement>("#first-name")!.value,
      customer_last_name: document.querySelector<HTMLInputElement>("#last-name")!.value,
      customer_address: document.querySelector<HTMLInputElement>("#adress")!.value,
      customer_postcode: document.querySelector<HTMLInputElement>("#postcode")!.value,
      customer_city: document.querySelector<HTMLInputElement>("#city")!.value,
      customer_email: document.querySelector<HTMLInputElement>("#email")!.value,
      customer_phone: document.querySelector<HTMLInputElement>("#phone")?.value,
      order_total: ItemOrder.order_total,
      order_items: ItemOrder.order_items,
    }

    const getConfirmation = async () => {
      const res = await postOrder(newOrder)
      const orderData = res.data
      const orderStatus = res.status

      // print out order-section to DOM
      document.querySelector('.heading-container')!.innerHTML = `
          <h2 class="main-heading">Orderbekräftelse</h2>`

      document.querySelector(".modal-dialog")!.innerHTML = `
          <div class="modal-content order-section">
            <div class="modal-body">
            </div>
          </div>
      `
      if (orderStatus === 'success') {
        document.querySelector(".modal-body")!.innerHTML = `
          <p class="success-message text-center p-3">Tack ${newOrder.customer_first_name} ${newOrder.customer_last_name} för din order!</p>
          <p class="success-message text-center p-3">Ditt ordernummer är: ${orderData.id}!</p>
        `
      } else {
        document.querySelector(".modal-body")!.innerHTML = `
          <p class="success-message text-center p-3">Sorry ${newOrder.customer_first_name} ${newOrder.customer_last_name}, something went wrong with your order.</p>
          <p class="success-message text-center p-3">Please try to place your order again.</p>    
        `
      }
    }

    // get order and print out if success or not
    getConfirmation()

    // empty cart array and localstorage
    cartItems = []
    localStorage.removeItem('cart_items')
    renderProducts()
    renderToCart()

    // customer information and items are still saved in array newOrder
  })
}