// export to API.ts
export interface IProduct {
    status: string
    data: {
        id: number,
        name: string,
        description: string | number,
        price: number,
        images: {
            thumbnail: string,
            large: string,
        }
    }
}

