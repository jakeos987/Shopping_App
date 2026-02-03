export interface Product{
    productId:number
    name:string
    category:Category
    price:number
    stockQuantity:number
    deletedAt:Date
    imageUrl?:string
}
export interface ProductFilter{
    category?:Category
    minPrice?:number
    maxPrice?:number
    name?:string
}
export interface Category{
    categoryId: number
    name: string
}