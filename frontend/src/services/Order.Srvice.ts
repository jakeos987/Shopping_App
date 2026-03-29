import { api } from './api';
import type { Order } from '../features/orders/types';

export const orderService = {
    async getAll() {
        const res = await api.get<Order[]>('/orders')
        return res.data
    },
    async checkout(data: { shippingAddress: string; city: string; phone: string }) {
        const res = await api.post(`/orders/checkout`, data)
        return res.data
    },
    async updateStatus(orderId: number, status: string) {
        const res = await api.patch(`/orders/${orderId}`, { status }) // Note: Backend expects body { status: ... } or just string? Checked controller: @Body('status') status: OrderStatus. Correct.
        return res.data
    },
    async getOrdersByUser(userId: number) {
        const res = await api.get<Order[]>(`/orders/user/${userId}`)
        return res.data
    },
}