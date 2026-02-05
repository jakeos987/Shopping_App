import { api } from './api';
import type { Category, Product } from '../features/products/types';
import type { ProductFilter } from '../features/products/types';

export const productService = {
    async getAll() {
        const res = await api.get<Product[]>('/product');
        return res.data;
    },
    async getCategories() {
        const res = await api.get<Category[]>('/product/categories')
        return res.data
    },
    async getOne(id: number) {
        const res = await api.get<Product>(`/product/${id}`)
        return res.data
    },


    async getFilter(filter: ProductFilter) {
        const res = await api.get<Product[]>('/product/filter', {
            params: filter
        })
        return res.data
    },
    async createCategory(category: { name: string }) {
        const res = await api.post('/product/category', category)
        return res.data
    },
    create: async (formData: FormData) => {
        return api.post('/product', formData, {
            headers: {
                // ⭐ התיקון הקריטי:
                // במקום לכתוב מחרוזת, אנחנו מגדירים undefined.
                // זה גורם ל-Axios להסיר את ה-JSON Header, 
                // והדפדפן משלים לבד את ה-multipart + boundary.
                "Content-Type": undefined
            }
        });
    },

    update: async (id: number, formData: FormData) => {
        return api.patch(`/product/${id}`, formData, {
            headers: {
                "Content-Type": undefined
            }
        });
    },
    async delete(id: number) {
        const res = await api.delete(`/product/${id}`)
        return res.data
    },
    async restore(id: number) {
        const res = await api.patch<Product>(`/product/restore/${id}`)
        return res.data
    },
    async getDeleted() {
        const res = await api.get<Product[]>('/product/deleted')
        return res.data
    }
}