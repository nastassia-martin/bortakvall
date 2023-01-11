import "bootstrap/dist/css/bootstrap.css"
import "./styles/style.css"
import { fetchData } from "./API"
import { IProduct, IOrder, ICartItems, IConfirmation } from "./interfaces"
import { Modal } from "bootstrap"
import { populateOrder } from "./populateOrder"
import { postOrder } from "./post"

const rowEl = document.querySelector(".products-container")
const offcanvasBody = document.querySelector(".offcanvas-body")
const URL = "https://www.bortakvall.se/"

// Get items from localStorage
const jsonProducts = localStorage.getItem('stock_qty') ?? '[]'
const jsonCart = localStorage.getItem('cart_items') ?? '[]'
const jsonOrder = localStorage.getItem('orders') ?? '[]'

// Array for products, with products from localStorage if there is any
let products: IProduct[] = JSON.parse(jsonProducts)

// create variables to use modal (bootstrap)
const modalEl = document.getElementById("moreInfoModal")!
const modal = new Modal(modalEl)



/** ** GET PRODUCTS FROM API **
 * 1. Check if products are already in localstorage, 
 *    if not, add the fetched data into products array
 * 2. Make sure their stock value is number, not null 
 */

const getProducts = async () => {
  try {
    const result = await fetchData()
    // 1. IF localstorage is empty, fill products array
    if (products.length <= 0) {
      products = result.data
    }
    checkStockStatus()
    renderProducts()
    renderToCart()

  } catch (e) {
    alert(e)
  }

}

getProducts()

// 2. For each product not in stock, set value from null to 0
const checkStockStatus = () => {
  products.forEach((product) => {
    if (product.stock_quantity < 1) {
      product.stock_quantity = 0
    }
  })
}



/** ** RENDER PRODUCTS TO DOM ** 
 * 1. Productoverview should show stock qty and total qty of products 
 * 2. Productoverview should have a filter function to sort the products
 * 3. Print out HTML content with bootstrap styling and card layout, one for each product in array
 *    Content of name, image, price, stock qty and 'lägg till'-btn
 * 4. If product is out of stock, make sure it's not possible to add to cart with the 'lägg till'-btn
 * */

const renderProducts = () => {
  // 1. Filter the products not in stock and print out to the product overview to the top left
  let inStockProducts = products.filter((product) => product.stock_quantity > 0)

  document.querySelector(".product-overview")!.innerHTML = `
  <div class="col-6">
    <p>Antal produkter: ${products.length}</p>
    <p>Varav ${inStockProducts.length} i lager</p>
  </div>
  <div class="col-6 filter">
    <button type="button" class="clr-button filter-button">Filtrera (A-Ö)</button>
  </div>`

  // 2. Sort the products from A-Ö
  document.querySelector(".filter-button")?.addEventListener("click", () => {
    products.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    renderProducts()
  })

  // 3. Render products to DOM (cards), name, image, price, stock qty and 'lägg till'-btn
  rowEl!.innerHTML = products
    .map((product) => `
    <div class="col-6 col-sm-4 col-lg-3">
      <div data-id="${product.id}" class="card mt-5">
        <img data-id="${product.id}" class="card-img img-fluid" src="${URL}${product.images.thumbnail}" alt="image of ${product.name}">
          <div data-id="${product.id}" class="card-body">
            <h3 data-id="${product.id}" class="card-title pt-3">${product.name}</h3>
            <p data-id="${product.id}" class="card-text">${product.price} kr</p>
            <p data-id="${product.id}" class="card-text stock-qty">${product.stock_quantity} i lager</p>
            <button id="product-num${product.id}" class="clr-button" data-id="${product.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-basket" viewBox="0 0 16 16"><path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
            </svg>Lägg till</button>
          </div>
      </div>
    </div>`
    )
    .join("")

  // 4. If product is out of stock - set 'lägg till'-btn to disabled
  products.forEach((product) => {
    if (product.stock_status === "outofstock") {
      document
        .querySelector(`#product-num${product.id}`)!
        .setAttribute("disabled", "disabled")
    }
  })
}



/** ** ADD PRODUCT TO CART **
 * 1. Get the item clicked, to know what product to add to the cart
 * 2. Push the values from products-array to cartItems-array
 * 3. If the product was already added, it should appear on the same row and not two separate
 * 4. Make sure the customer can go forward with their order (gå till kassan)
 * 5. Correct the stock qty of the products-array and save the cartItems to localstorage
 */

// 1. Define variables, has to be any (to get e.target)
let clickedItem: any
let index: number
let productIndex: any

// 1. Save ID on clicked item and search for index in product-array
const findIndex = () => {
  const clickedID = clickedItem.dataset.id
  index = products.findIndex((product) => product.id === Number(clickedID))
}

// 2. Define array with values from localstorage (if any)
let cartItems: ICartItems[] = JSON.parse(jsonCart)

const addToCart = () => {
  // 2. Put a new item in cart with qty 1, if there is no items added already
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

  // 3. Look for a product already in cart with the same id as the one being added
  let doubleID = cartItems.find((item) => item.id === products[index].id)
  if (doubleID) {
    const index = cartItems.findIndex((product) => product.id === doubleID?.id)
    if (products[index].stock_quantity) {
      cartItems[index].qty++
    }
    cartItems[index].item_total = cartItems[index].qty * cartItems[index].item_price
  }

  // 3. If no dublicates was found, put the item in cart with qty 1
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

  // 4. Remove 'disabled' from betala-button when something is added to cart
  document.querySelector('.checkout-btn')?.removeAttribute('disabled')

  // 5. Adjust stock_quantity of added item
  if (products[index].stock_quantity >= 1) {
    products[index].stock_quantity--
    renderProducts()
    if (!products[index].stock_quantity) {
      products[index].stock_status = "outofstock"
      renderProducts()
    }
  }
  // 5. Save products to localstorage
  saveItems()
}

const saveItems = () => {
  localStorage.setItem('stock_qty', JSON.stringify(products))
  localStorage.setItem('cart_items', JSON.stringify(cartItems))
}



/** ** RENDER ADDED ITEMS TO CART ** 
 * 1. Print out the added name, image, price, qty
 * 2. Print out buttons 'fortsätt handla' and 'gå till kassan' and order total sum
 */



const renderToCart = () => {
  // 1. Print out the added name, image, price, qty
  const order = populateOrder(cartItems)
  offcanvasBody!.innerHTML = cartItems
    .map((cartItem) => `
    <div class="container cart-item">
      <div class="cart-img col-2">
        <img src="${URL}${cartItem.image}" alt="image of ${cartItem.name}">
      </div>
      <br>
      <div class="cart-info col-9">
        <div class="product-name">
          <h3 class="cart-name">${cartItem.name}</h3>
          <button title="trash" class="btn-trash" data-id="${cartItem.id}"><img data-id="${cartItem.id}" class="btn-trash" src="/images/trash3.svg" alt="Bootstrap" width="20" height="20"></button>
        </div>
        <div class="qty">
          <button title="btnMinus" class="btn-minus" data-id="${cartItem.id}">
            <img data-id="${cartItem.id}" class="btn-minus" src="/images/dash-circle.svg" alt="Bootstrap" width="25" height="25">
          </button>
          <p data-id="${cartItem.id}" class="product-qty">${cartItem.qty}</p>
          <button title="btnPlus" class="btn-plus" data-id="${cartItem.id}">
            <img data-id="${cartItem.id}" class="btn-plus" src="/images/plus-circle-fill.svg" alt="Bootstrap" width="25" height="25">
          </button>
          <p class="err"></p>
          <p class="product-sum">Totalt: ${cartItem.item_total}kr (${cartItem.item_price}kr/st)</p>
        </div>
      </div>
    </div>`
    )
    .join("")

  //. 2. Print out 'fortsätt handla' and 'gå till kassan' btns and order total sum
  offcanvasBody!.innerHTML += `
  <div class="button-container">
    <button type="button" class="clr-button mx-1" data-bs-dismiss="offcanvas" aria-label="Close">Fortsätt handla</button>
    <button type="button" class="clr-button mx-1 checkout-btn">Gå till kassan</button>
  </div>
  <div class="total_order_container">
    <h5>TOTALSUMMAN ${order.order_total} kr</h5>
    <p>Varav moms ${order.order_total / 4} kr</p>
  </div> `

  // 2. If the cart is empty, make sure the 'gå till kassan' btn is disabled
  if (!cartItems[0]) {
    document.querySelector('.checkout-btn')?.setAttribute('disabled', 'disabled')
  }
}


/** ** PRODUCT OVERVIEW (MORE INFO ABOUT PRODUCT) **
 * 1. Check what product is being clicked, to get information about product
 * 2. Render the information about the product
 * 3. Make sure if the product stock qty is out, disable the 'lägg till' button
 * 4. Make sure the product is possible to add to cart from the product overview
 * 5. Make sure the product is possible to add to cart from the card (all products overview) 
 */

const headingContainer = document.querySelector(".heading-container")
const modalBody = document.querySelector(".modal-body")

rowEl?.addEventListener('click', e => {
  // 1. Save the clicked item into an variable
  clickedItem = e.target as HTMLElement
  if (clickedItem.tagName !== "DIV" && clickedItem.className !== "clr-button") {
    findIndex()
    modal.show()

    // 2. Print out the product to modal section
    headingContainer!.innerHTML = `<h2 class="main-heading">${products[index].name}</h2>`
    modalBody!.innerHTML = `
    <div class="container">
      <div class="row">        
        <div class="col-sm-12 col-md-12 col-lg-6 product-modal">
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

    // 3. If the stock qty is outofstock, disable the 'lägg till'-button
    if (products[index].stock_status === "outofstock") {
      document
        .querySelector(`#product-num${products[index].id}`)!
        .setAttribute("disabled", "disabled")
    }

    // 4. Add item to cart through modal 'lägg till' button
    document.querySelector('.modal-button')?.addEventListener('click', () => {
      findIndex()
      addToCart()
      renderToCart()
    })
  }
  // 5. Add item to cart through card 'lägg till'-button
  else if (clickedItem.className === "clr-button") {
    findIndex()
    addToCart()
    renderToCart()
  }
})


/** ** CHANGE THE QTY OF ITEMS FROM INSIDE THE CART **
 * 1. Check what product is being clicked, to get information about product
 * 2. Remove the specific product from the cart
 * 3. Make sure the total sum is rendered and updated 
 * 4. If there's no products left in cart, make sure the 'gå till kassan' btn is disabled
 * 5. Render the updated products (because of stock qty) and save the cart to local storage
 * 6. When click on +, add item to cart 
 * 7. Prevent from adding more to cart than stock qty 
 * 8. When click on trashcan, remove all items from cart
 * 9. When click on -, subtract item from cart
 */

offcanvasBody?.addEventListener("click", (e) => {
  // 1. Save the clicked item into an variable, to get the items iformation
  let clickedBtn: any
  clickedBtn = e.target as HTMLButtonElement

  // 1. To be able to print out the clicked item, make arrays of the elements
  const productQty = document.querySelectorAll(".product-qty")
  const productQtyArr = Array.from(productQty)
  const cartInfo = document.querySelectorAll(".cart-item")
  const cartInfoArr = Array.from(cartInfo)
  const productPrice = document.querySelectorAll(".product-sum")
  const productPriceArr = Array.from(productPrice)
  const err = document.querySelectorAll('.err')
  const errArr = Array.from(err)
  const totalSum = document.querySelector(".total_order_container")

  // 1. Get the product.id from the clicked product and save as index
  const getClickedIndex = () => {
    let clickedID: any
    clickedID = clickedBtn.dataset.id
    index = cartItems.findIndex(product => product.id === Number(clickedID))
    productIndex = products.findIndex((product) => product.id === Number(clickedID))
  }

  // 2. Remove chosen product from array and cart and print out new sum
  const removeFromCart = () => {
    cartItems.splice(index, 1)
    cartInfoArr[index].remove()
    const order = populateOrder(cartItems)
    totalSum!.innerHTML = `<h5>TOTALSUMMAN ${order.order_total} kr</h5><p>Varav moms ${order.order_total / 4} kr</p>`
  }

  // 3. Count item_total and render new qty and total sum
  const updateQty = () => {
    cartItems[index].item_total = cartItems[index].qty * cartItems[index].item_price
    productQtyArr[index].innerHTML = `${cartItems[index].qty}`
    productPriceArr[index].innerHTML = `Totalt: ${cartItems[index].item_total}kr (${cartItems[index].item_price}kr/st)`
    const order = populateOrder(cartItems)
    totalSum!.innerHTML = `<h5>TOTALSUMMAN ${order.order_total} kr</h5><p>Varav moms ${order.order_total / 4} kr</p>`
  }

  // 4. If there no longer are any items in cartItems, set 'betala-btn' to disabled
  const disableCheckoutBtn = () => {
    if (cartItems.length < 1) {
      document.querySelector('.checkout-btn')?.setAttribute('disabled', 'disabled')
      totalSum!.innerHTML = ``
    }
  }

  // 5. Render updated stock values to DOM and save items to localstorage
  const renderAndSave = () => {
    renderProducts()
    saveItems()
  }

  // Only respond to the icon clicks
  if (clickedBtn.tagName === 'BUTTON' || clickedBtn.tagName === 'IMG') {
    // 6. When +, add the qty of cartItems and subtract the qty of products. Render and save updated values.
    if (clickedBtn.classList.contains("btn-plus")) {
      getClickedIndex()
      if (products[productIndex].stock_quantity) {
        cartItems[index].qty++
        products[productIndex].stock_quantity--
        updateQty()
        renderAndSave()
      } else {
        // 7. If stock qty is out, add information that says nothing left in stock
        errArr[index]!.innerHTML = `0 i lager`
        setTimeout(() => {
          errArr[index]!.innerHTML = ``
        }, 2000);
      }
    } else if (clickedBtn.classList.contains('btn-trash')) {
      // 8. Remove product from cartItems and set products qty and stock status back to its values 
      getClickedIndex()
      const resetQty = cartItems[index].qty
      removeFromCart()
      disableCheckoutBtn()
      products[productIndex].stock_quantity += resetQty
      products[productIndex].stock_status = "instock"
      renderAndSave()
    } else if (clickedBtn.classList.contains('btn-minus')) {
      // 9. When -, remove qty from cartItems and add to products 
      getClickedIndex()
      if (cartItems[index].qty > 1) {
        cartItems[index].qty--
        products[productIndex].stock_quantity++
        products[productIndex].stock_status = "instock"
        updateQty()
        renderAndSave()
      } else {
        // 9. If there is nothing left in the cart, remove the product from the cart
        removeFromCart()
        products[productIndex].stock_quantity++
        products[productIndex].stock_status = "instock"
        disableCheckoutBtn()
        renderAndSave()
      }
    } else if (clickedBtn.classList.contains('checkout-btn')) {
      modal.show()
      renderCheckout()
      sendOrder()
    }
  }
})


/** ** CHECKOUT ** 
 * 1. Render the products from cartItems and a form to fill in customer information to the checkout section
 * 2. When submit, push the items from cartItems and the customer information into an object of the orderinformation 
 * 3. Post order and save the results
 * 4. Save the order to local storage
 * 5. 
 */

const renderCheckout = () => {
  // 1. Render headline and a modal with the products from cartItems, and a form with customer information inputs 
  headingContainer!.innerHTML = `<h2 class="main-heading">Kassa</h2>`

  const order = populateOrder(cartItems)
  modalBody!.innerHTML = `
      <div class="container">
        <div class="row gy-4">     
          <div class="col-sm-12 col-md-12 col-lg-6 checkout-products">
          </div>
          <div class="col-sm-12 col-md-12 col-lg-6 customer-info">
            <form id="new-order">
              <div class="form-group mb-1">
              <label for="first-name">Förnamn</label>
              <input type="text" name="first-name" id="first-name" class="form-control" placeholder="Förnamn" >
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
                  <input type="text" name="postcode" id="postcode" class="form-control" placeholder="123 45" minlength="5" maxlength="5" pattern="[0-9]*" required>
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
              <div>
                <button type="submit" role="button" class="clr-button lagg-order">Lägg order</button>
              </div>
            </form>
          </div>
          <div class="total_order_container">
              <h5>TOTALSUMMAN ${order.order_total} kr</h5>
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
                  <h3 class="cart-name">${cartItem.name}</h3>
                  <p data-id="${cartItem.id}" class="product-qty">${cartItem.qty}</p>
                  <p class="product-sum">${cartItem.item_total}kr (${cartItem.item_price}kr/st)</p>
                </div>
              </div>
            </div>`
    )
    .join('')
}

// array of previous orders
let savedOrder: IConfirmation[] = JSON.parse(jsonOrder)

const sendOrder = () => {
  // 2. When submit, push the customer information and order items to an object
  document.querySelector('#new-order')?.addEventListener('submit', async e => {
    e.preventDefault()

    const ItemOrder = populateOrder(cartItems);
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
      try {
        const res = await postOrder(newOrder)
        const orderData = res.data
        const orderStatus = res.status
        const test = Object.entries(orderData)

        // 4. Save the order-information to local storage
        savedOrder.push(orderData)
        localStorage.setItem('orders', JSON.stringify(savedOrder))

        // print out order-section to DOM
        document.querySelector('.heading-container')!.innerHTML = `
              <h2 class="main-heading">Orderbekräftelse</h2>
              `

        if (orderStatus === 'success') {
          document.querySelector(".modal-body")!.innerHTML = `
                <p class="success-message text-center p-3">Tack ${newOrder.customer_first_name} ${newOrder.customer_last_name} för din order!</p>
                <p class="success-message text-center p-3">Ditt ordernummer är: ${orderData.id}!</p>
                `
        } else {
          document.querySelector(".modal-body")!.innerHTML = `
                <p class="success-message text-center p-3">Sorry something went wrong with your order. Please check below!</p>
                <p class ="error-message"text-center p-3"></p>  
                <p class="success-message text-center p-3">Please try to place your order again.</p>    
                `

          test.forEach(error => {
            document.querySelector('.error-message')!.innerHTML += `
                        <p class ="error-message text-center p-3">${error[1]}</p>`
          })
        }
      } catch (e: any) {
        alert(e)
      }
    }
    getConfirmation()
    // empty cart array and localstorage
    cartItems = []
    localStorage.removeItem('cart_items')
    renderProducts()
    renderToCart()

    // customer information and items are still saved in array newOrder
  })
}

let mybutton = document.getElementById("btn-back-to-top");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton!.style.display = "block";
  } else {
    mybutton!.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
mybutton!.addEventListener("click", backToTop);

function backToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
