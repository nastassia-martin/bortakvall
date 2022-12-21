import 'bootstrap/dist/css/bootstrap.css'
import './styles/style.css'

//(E2S1T3) - add when we are doing E3 
//import { addToCart } from './btn-click-counter-trolley'
//addToCart() */

import { fetchData } from "./API";
import { IProduct } from "./interfaces";


// Empty array to fetch data to
//let products: IProduct[] = []

// Get data from API and save it into products-array
const getProducts = async () => {
    let products: IProduct[] = await fetchData()
    renderProducts();
    return products
}

// Call function (test for now)
getProducts()

/* const getData = async () => {
    let data: IProduct[] = await fetchData()
    console.log(data)
} */

// Render products to DOM 
const renderProducts = async () => {

    const test = await getData()
    console.log(test)

    /*  console.log(...productArr[1])
     const product: IProduct = [...productArr[1]]  */

    document.querySelector('.row')!.innerHTML =
        test.map(product => `<div class="col-6 col-sm-4 col-lg-3">
         <div class="card mt-5">
           <!-- E2S1T2 - add path to product and name of product from objects in TS -->
           <img class="card-img img-fluid" src="/public/images/placeholderx116.png" alt="Image of ***">
           <div class="card-body">
             <!-- E2S1T2 - print product name from objects in TS -->
             <h2 class="card-title pt-3">Product Name</h2>
             <!-- E2S1T2 - add price from objects in TS -->
             <p class="card-text">10 kr</p>
             <!-- E2S1T3 - add eventlistener -->
             <button><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                 class="bi bi-basket" viewBox="0 0 16 16">
                 <path
                   d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z" />
               </svg>Lägg till</button>
           </div>
         </div>
       </div>
       `
        ).join('')

    // PSUEDO 
    // for each product in product-array, print out one card
}
