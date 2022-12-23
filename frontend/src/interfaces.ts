// export to API.ts and main.ts
export interface IProduct {
    id: number,
    name: string,
    description: string | number,
    price: number,
    images: {
        thumbnail: string,
        large: string,
    }
}

export interface IResult {
    status: string,
    data: IProduct[]
}
