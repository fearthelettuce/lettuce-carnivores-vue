<template>
    <div class="order-container">
        <Accordion value="0">
            <AccordionPanel v-for="order of props.orders" :key="order.id" :value="order.id.toString()">
                <AccordionHeader class="accordion-header" :pt="{toggleicon: {style:{ 'margin-left': 'auto', 'margin-right':'.6rem'}}}">
                    <div class="grid-span-2 order-number">Order {{ order.id }}</div>
                    <div class="grid-span-2">{{ formatFirebaseDate(order.orderDate) }}</div>
                    <div class="grid-span-3 text-center">{{ order.orderStatus.status }}</div>
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
                                    <div>{{ order.shippingInfo.email }}</div>
                                </div>
                                <div>
                                    <div>{{order.shippingInfo.shippingType}} Shipping</div>
                                    <div>{{  order.orderStatus.trackingNumber !== '' ?
                                        order.orderStatus.trackingNumber :
                                        'Tracking number not yet assigned' }}
                                    </div>
                                </div>
                                <div>
                                    <button v-if="isAdmin" @click="openOrderStatusModal(order)" :key="order.id" class="btn btn-info">Update Status</button>

                                </div>
                            </div>
                        </div>
                        <hr />
                        <div class="item-details my-3">
                            <h5>Products</h5>
                            <OrderDetails :order :isAdmin />
                        </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
    <OrderStatusModal v-if="selectedOrder !== undefined" :order="selectedOrder" ref="orderStatusModal" />
</template>

<script setup lang="ts">
import { nextTick, type Ref, ref } from 'vue'
import Accordion from 'primevue/accordion'
import AccordionHeader from 'primevue/accordionheader'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionContent from 'primevue/accordioncontent'
import OrderStatusModal from '@/components/OrderStatusModal.vue'
import type { Order } from '@/types/Orders'
import { USDollar, formatFirebaseDate } from '@/utils/utils';
import OrderDetails from './OrderDetails.vue'
const props = defineProps<{orders: Order[], isAdmin: boolean}>();

const orderStatusModal = ref()
const selectedOrder: Ref<Order | undefined> = ref(undefined)
async function openOrderStatusModal(order: Order) {
    selectedOrder.value = order
    await nextTick()
    orderStatusModal.value.toggleModal()
}

const columnCount = props.isAdmin ? 7 : 6

</script>

<style scoped>
.order-container {
    max-width: 100rem;
    margin: auto;
}
.item-grid {
    display: grid;
    grid-template-columns: repeat(v-bind(columnCount), minmax(2.8rem, 1fr));
    gap: 0.5rem 1rem;
}
.grid-span-1 {
    grid-column: span 1
}
.grid-span-2 {
    grid-column: span 2;
}
.grid-span-3 {
    grid-column: span 3
}
.item-name {
    text-wrap: balance;
    word-wrap:break-word;
    word-break:normal;
    grid-column: span 2;
}
.order-number {
    text-wrap: balance;
}
.accordion-header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(2rem, 1fr));
}
.total {
    display: grid;
    grid-template-columns: 12ch 12ch;
    max-width: 16rem;
}
.justify-right{
    text-align: end;
}
p-accordionheader-toggle-icon {
        margin-left: auto;

    }
</style>
