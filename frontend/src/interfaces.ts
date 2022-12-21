// export to API.ts
export interface Product {
    id: number,
    name: string,
    description: string | number,
    price: number,
    images: {
        thumbnail: string,
        large: string,
    }
}

