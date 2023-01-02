import { IResult } from "./interfaces";

// Fetch data from API
export const fetchData = async () => {
    const res = await fetch('https://www.bortakvall.se/api/products');
    if (!res.ok) {
        throw new Error(`could not get data: ${res.status} ${res.statusText}`)
    }

    return await res.json() as IResult
}


