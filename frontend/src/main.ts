import 'bootstrap/dist/css/bootstrap.css'
import './styles/style.css'
/* import { addToCart } from './btn-click-counter-trolley' */

/* addToCart() */

/* import { fetchData } from "./API";
import { IProduct } from "./interfaces"; */




// TEST KOD 
interface IProduct {
    status: string,
    data: [
        {
            id: number,
            name: string,
            description: string | number,
            price: number,
            images: {
                thumbnail: string,
                large: string,
            }

        }
    ]
}


const fetchData = async () => {
    const res = await fetch('https://www.bortakvall.se/api/products');
    if (!res.ok) {
        throw new Error(`could not get data: ${res.status} ${res.statusText}`)
    }

    return await res.json() as IProduct[]
}


// empty array to fetch data to
let products: IProduct[] = []

console.log(products)

// Function for get data
const getData = async () => {
    products = await fetchData()
    console.log(products)
}

getData()

//render product 

const renderProducts = () => {

    // PSUEDO 
    // foreach product in product-array, print out one card

}