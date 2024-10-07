<template>
    <div class="table-container">

        <table class="item-detail-table">
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col" class="justify-center">Item #</th>
                    <th scope="col" class="justify-center">Size</th>
                    <th scope="col" class="justify-center">Quantity</th>
                    <th scope="col">Price</th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="item in lineItems" :key="item.price_data.product_data.metadata.sku">
                    <td>{{` ${item.price_data.product_data.name} ${item.price_data.product_data.metadata.clone || ''} `}}</td>
                    <td class="justify-center">{{ item.price_data.product_data.metadata.sku }}</td>
                    <td class="justify-center">{{ item.price_data.product_data.description }}</td>
                    <td class="justify-center">{{ item.quantity }}</td>
                    <td class="justify-right">{{ USDollar.format(item.price_data.unit_amount / 100) }}</td>
                </tr>
            </tbody>
            <tfoot>

                <tr class="top-border">
                    <td class="justify-right" colspan="4">{{`${hasDiscount ? 'Discount' : ''}`}}</td>
                    <td class="justify-right">{{`${hasDiscount ? '-' + USDollar.format(order.cartTotal.amount_discount / 100) : ''}  `}}</td>
                </tr>
                <tr>
                    <td class="justify-right" colspan="4">Shipping</td>
                    <td class="justify-right">{{ USDollar.format(order.cartTotal.amount_shipping / 100) }}</td>
                </tr>
                <tr>
                    <td class="justify-right" colspan="4">Tax</td>
                    <td class="justify-right">{{ USDollar.format(order.cartTotal.amount_tax / 100) }}</td>
                </tr>
                <tr>
                    <td class="justify-right" colspan="4">Total</td>
                    <td class="justify-right">{{ USDollar.format(order.cartTotal.amountTotal / 100) }}</td>
                </tr>
            </tfoot>
                
            
        </table>
        <table v-if="isAdmin">
            <thead>
                <tr>
                    <th scope="col" class="justify-center">Location</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in lineItems" :key="item.price_data.product_data.metadata.sku">
                    <td class="justify-center">{{item.price_data.product_data.metadata?.shelfLocation ? item.price_data.product_data.metadata?.shelfLocation : ''}}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr><td> </td></tr>
                <tr><td> </td></tr>
                <tr><td> </td></tr>
                <tr><td> </td></tr>
            </tfoot>
            
        </table>
    </div>
</template>

<script setup lang="ts">
import { USDollar } from '@/utils/utils';
    const props = defineProps(['lineItems', 'isAdmin', 'order'])
    // const columnCount = props.isAdmin ? 7 : 6
    const hasDiscount = props.order.cartTotal.amount_discount && props.order.cartTotal.amount_discount !== 0
</script>
<style scoped>
    .item-detail-table {
        width: 50rem;
        
    }
    td, th {
        padding: .1rem .25rem;
        color: black;
        background-color: white;
        line-height: 1.5rem;
        height: 1.7rem;
    }
    .table-container {
        display: flex;
        flex-direction: row;
    }
    .top-border {
        border-top: 2px solid black;

    }
    .justify-center {
        text-align: center;
    }
    .justify-right {
        text-align: end;    
    }
</style>