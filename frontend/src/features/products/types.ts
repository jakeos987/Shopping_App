export type ProductCategory =
    | 'ELECTRONICS'
    | 'CLOTHING'
    | 'BOOKS'
    | 'BOARD_GAMES'
    | 'BEVERAGES'
    | 'GAMING';

export interface Product{
    productId:number
    name:string
    category:ProductCategory
    price:number
    stockQuantity:number
    deletedAt:Date
    imageUrl?:string
    isActive:boolean
}
export interface ProductFilter{
    category?:ProductCategory
    minPrice?:number
    maxPrice?:number
    name?:string
}