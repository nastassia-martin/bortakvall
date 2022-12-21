import { IProduct } from "./interfaces";

// Function for fetching data
export const fetchData = async () => {
    const res = await fetch(' https://www.bortakvall.se/api/products');
    if (!res.ok) {
        throw new Error(`could not get data: ${res.status} ${res.statusText}`)
        return
    }

    return await res.json() as IProduct[]
}