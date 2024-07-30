<template>
    <div class="">
        <Accordion value="0">
            <AccordionPanel v-for="order of props.orders" :key="order.id" :value="order.id.toString()">
                <AccordionHeader class="accordion-header" :pt="{toggleicon: {style:{ 'margin-left': 'auto', 'margin-right':'.6rem'}}}">
                    <div class="order-number">Order {{ order.id }}</div>
                    <div class="">{{ formatDate(order.orderDate) }}</div>
                    <div>{{ order.orderStatus.status }}</div>
                </AccordionHeader>
                <AccordionContent class="my-1">
                        <div class="shipping-info my-3">
                            <h5>Shipping</h5>
                            
                            <div class="d-flex flex-row flex-wrap justify-content-around gap-2">

                                <div class="ms-3">
                                    <div>{{ order.shippingInfo.name }}</div>
                                    <div>{{ order.shippingInfo.address.line1 }}</div>
                                    <div v-if="order.shippingInfo.address.line2">{{ order.shippingInfo.address.line2 }}</div>
                                    <div>{{`${order.shippingInfo.address.city} ${order.shippingInfo.address.state} ${order.shippingInfo.address.postal_code}` }}</div>
                                </div>
                                <div>
                                    <div>{{order.shippingInfo.shippingType}} Shipping</div>
                                    <div>{{  order.orderStatus.trackingNumber !== '' ? order.orderStatus.trackingNumber : 'Tracking number not yet assigned' }}</div>
                                </div>
                                <div>
                                    <button v-if="isAdmin" @click="updateOrderStatus(order.id)" class="btn btn-info">Update Status</button>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div class="item-details my-3">
                            <h5>Products</h5>
                            <div class="item-grid">
                                <div class="item-name">Item</div>
                                <div>Size</div>
                                <div>Quantity</div>
                                <div>Price</div>
                                <template v-for="item of order.lineItems" :key="item.price_data.product_data.metadata.sku" class="grid-item">
                                    <div class="item-name">{{` ${item.price_data.product_data.name} ${item.price_data.product_data.metadata.sku} `}}</div>
                                    <div>{{ item.price_data.product_data.description }}</div>
                                    <div>{{ item.quantity }}</div>
                                    <div>{{ USDollar.format(item.price_data.unit_amount / 100) }}</div>
                                </template>
                            </div>
                            
                        </div>
                        <div class="my-5 ">
                            <h5>Total</h5>
                            <div class="d-flex flex-row gap-5">
                                <div class="">Shipping {{  USDollar.format(order.cartTotal.amount_shipping / 100) }}</div>
                                <div class="">Tax {{  USDollar.format(order.cartTotal.amount_tax / 100) }}</div>
                                <div class="">Order Total {{  USDollar.format(order.cartTotal.amountTotal / 100) }}</div>
                            </div>
                        </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionHeader from 'primevue/accordionheader';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionContent from 'primevue/accordioncontent';
import type { Order } from '@/types/Orders';

const props = defineProps<{orders: Order[], isAdmin: boolean}>();

function updateOrderStatus(orderId: number) {
    console.log(orderId)
}
const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2, 
});

function formatDate(firebaseDate: any) {
    const date =  new Date(firebaseDate.seconds * 1000)
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
        }).format(date);
}

</script>

<style scoped>
.item-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(2.8rem, 1fr));
    gap: 0.5rem 1rem;
}
.item-name {
    text-wrap: balance;
    word-wrap:break-word;
    word-break:normal;
    grid-column: span 2;
}
.order-number {
    text-wrap: balance;
    word-wrap:break-word;
    word-break: break-all;
}
.accordion-header {
    display: grid;
    grid-template-columns: repeat(4, 1fr);

}
p-accordionheader-toggle-icon {
        margin-left: auto;
        
    }
</style>