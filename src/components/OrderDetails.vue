<template>
    <div class="table-container">

        <table class="item-detail-table">
            <thead>
                <tr>
                    <th scope="col">Item</th>
                    <th scope="col" class="justify-center">Item #</th>
                    <th v-if="isAdmin" scope="col" class="justify-center">Shelf</th>
                    <th scope="col" class="justify-center">Size</th>
                    <th scope="col" class="justify-center">Quantity</th>
                    <th scope="col">Price</th>
                </tr>
            </thead>
            <tbody>

                <tr v-for="item in lineItems" :key="item.price_data.product_data.metadata.sku">
                    <td data-th="Item">{{` ${item.price_data.product_data.name} ${item.price_data.product_data.metadata.clone || ''} `}}</td>
                    <td data-th="Item #" class="justify-center">{{ item.price_data.product_data.metadata.sku }}</td>
                    <td data-th="Shelf" class="justify-center">{{item.price_data.product_data.metadata?.shelfLocation ? item.price_data.product_data.metadata?.shelfLocation : ''}}</td>
                    <td data-th="Size" class="justify-center">{{ item.price_data.product_data.description }}</td>
                    <td data-th="Quantity" class="justify-center">{{ item.quantity }}</td>
                    <td data-th="Price" class="justify-right">{{ USDollar.format(item.price_data.unit_amount / 100) }}</td>
                </tr>
            </tbody>
            <tfoot>

                <tr v-if="hasDiscount" class="top-border">
                    <th class="justify-right" :colspan="isAdmin ? 5 : 4">{{`${hasDiscount ? 'Discount' : ''}`}}</th>
                    <td data-th="Discount" class="justify-right">{{`${hasDiscount ? '-' + USDollar.format(order.cartTotal.amount_discount / 100) : ''}  `}}</td>
                </tr>
                <tr>
                    <th class="justify-right" :colspan="isAdmin ? 5 : 4">Shipping</th>
                    <td data-th="Shipping" class="justify-right">{{ USDollar.format(order.cartTotal.amount_shipping / 100) }}</td>
                </tr>
                <tr>
                    <th class="justify-right" :colspan="isAdmin ? 5 : 4">Tax</th>
                    <td data-th="Tax" class="justify-right">{{ USDollar.format(order.cartTotal.amount_tax / 100) }}</td>
                </tr>
                <tr>
                    <td class="justify-right" :colspan="isAdmin ? 5 : 4">Total</td>
                    <td data-th="Total" class="justify-right">{{ USDollar.format(order.cartTotal.amountTotal / 100) }}</td>
                </tr>
            </tfoot>


        </table>
    </div>
</template>

<script setup lang="ts">
import { USDollar } from '@/utils/utils';
    const props = defineProps(['lineItems', 'isAdmin', 'order'])
    const hasDiscount = props.order.cartTotal.amount_discount && props.order.cartTotal.amount_discount !== 0
    const textColor = props.isAdmin ? 'black' : 'inherit'
    const backgroundColor = props.isAdmin ? 'white' : 'inherit'
    const borderColor = props.isAdmin ? 'black' : 'rgb(225, 220, 189)'
</script>
<style scoped>
    .item-detail-table {
        margin: 1rem 0.25rem;
        min-width: 300px;
    }
    .item-detail-table tr {
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }
    .item-detail-table th {
        display: none;
    }
    .item-detail-table td {
        display: block;
    }
    .item-detail-table td:first-child {
        padding-top: .5em;
    }
    .item-detail-table td:last-child {
        padding-bottom: .5em;
    }
    .item-detail-table td:before {
        content: attr(data-th) ": ";
        font-weight: bold;
        width: 5.5rem;
        display: inline-block;
    }
    @media (min-width: 480px) {
        .item-detail-table td:before {
            display: none;
        }
    }
    .item-detail-table th, .item-detail-table td {
        text-align: left;
    }

    @media (min-width: 480px) {
        .item-detail-table th, .item-detail-table td {
            display: table-cell;
            padding: .25em .5em;
        }
        .item-detail-table th:first-child, .item-detail-table td:first-child {
            padding-left: 0;
        }
        .item-detail-table th:last-child, .item-detail-table td:last-child {
            padding-right: 0;
        }
    }

    td, th {
        color: v-bind(textColor);
        background-color: v-bind(backgroundColor);
        line-height: 1.5rem;

    }
    .table-container {
        display: flex;
        flex-direction: row;
    }
    .top-border {
        border-top: 1px solid v-bind(borderColor);

    }
    .justify-center {
        text-align: center;
    }
    .justify-right {
        text-align: end;
    }
    @media(min-width: 50rem) {
        .item-detail-table {
            width: 40rem;
        }
        td, th {
            height: 1.7rem;
        }
    }
</style>
