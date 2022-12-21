import 'bootstrap/dist/css/bootstrap.css'
import './styles/style.css'
import { addToCart } from './btn-click-counter-trolley'

addToCart()

import { fetchData } from "./API";
import { Product } from "./interfaces";


// empty array to fetch data to
let products, []: Product[] = []

// Function for get data
const getData = async () => {
    products = await fetchData()
}

getData()

