import {api } from './api';
import type { Product } from '../features/products/types';
import type { ProductFilter } from '../features/products/types';


export const productService={
    async getAll(){
        const res = await api.get<Product[]>('/product');
        return res.data;
    },
    async getOne(id:number){
        const res = await api.get<Product>(`/product/${id}`)
        return res.data
    },
    async getFilter(filter:ProductFilter){
        const res = await api.get<Product[]>('/product/filter',{
            params:filter
        })
        return res.data
    },
    async create(productData:any){
        const res = await api.post<Product>('/product',productData)
        return res.data
    },
    async update(id:number, productData: Partial<Product>){
        const res = await api.patch<Product>(`/product/${id}`, productData)
        return res.data
    },
    async delete(id:number){
        const res = await api.delete(`/product/${id}`)
        return res.data
    },
    async restore(id:number){
        const res = await api.patch<Product>(`/product/restore/${id}`)
        return res.data
    }
}