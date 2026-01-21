import {api} from './api';
import type { Order } from '../features/orders/types';

export const orderService={
    async getAll(){
        const res = await api.get<Order[]>('/orders')
        return res.data
    },
    async checkout(){
        const res = await api.post(`/orders/checkout`,{})
        return res.data
    },
}