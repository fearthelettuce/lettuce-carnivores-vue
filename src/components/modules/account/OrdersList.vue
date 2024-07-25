<template>
    <div class="d-flex flex-column">
        <Accordion value="0">
            <AccordionPanel v-for="order of orders" :key="order.id" :value="order.id">
                <AccordionHeader><div>Order {{ order.id }}</div><div>{{  USDollar.format(order.amountTotal / 100) }}</div></AccordionHeader>
                <AccordionContent class="my-1">
                        <div class="shipping-info my-3">
                            <h5>{{`Shipping - ${order.shippingInfo.shippingType} `}}</h5>
                            <div class="ms-3">
                                <div>{{ order.shippingInfo.name }}</div>
                                <div>{{ order.shippingInfo.address.line1 }}</div>
                                <div v-if="order.shippingInfo.address.line2">{{ order.shippingInfo.address.line2 }}</div>
                                <div>{{`${order.shippingInfo.address.city} ${order.shippingInfo.address.state} ${order.shippingInfo.address.postal_code}` }}</div>
                            </div>
                        </div>
                        <div class="item-details mt-3">
                            <h5>Products</h5>
                            <div class="item-grid ms-3">
                                <div>Item</div>
                                <div>Size</div>
                                <div>Quantity</div>
                                <div>Price</div>
                                <template v-for="item of order.lineItems" :key="item.sku" class="grid-item">
                                    <div>{{` ${item.price_data.product_data.name} ${item.price_data.product_data.description} `}}</div>
                                    <div>ID {{ item.price_data.product_data.metadata.sku }}</div>
                                    <div>{{ item.quantity }}</div>
                                    <div>{{ USDollar.format(item.price_data.unit_amount / 100) }}</div>
                                </template>
                            </div>
                            
                        </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </div>
</template>

<script setup lang="ts">
import { onMounted, type Ref, ref} from 'vue';
import { findAll } from '@/apis/dataServices';
import { useUserStore } from '../auth/stores/users';
import { toast } from 'vue3-toastify'
import Accordion from 'primevue/accordion';
import AccordionHeader from 'primevue/accordionheader';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionContent from 'primevue/accordioncontent';


const { user } = useUserStore()
type Order = {
    id: string, 
    amountTotal: number,
    shippingInfo: {
        address: {
            line1: string,
            line2: string | null,
            city: string,
            state: string,
            postal_code: string,

        },
        name: string,
        shippingType: string,
    },
    lineItems: any[],
}
let orders: Ref<Order[]> = ref([])
onMounted(() => {
    findOrders()
})


async function findOrders () {
    if(!user || !user.uid) {
        toast.error('Unable to get orders')
        return
    }
    const res = await findAll(`customers/${user.uid}/orders`)
    console.log(res)
    orders.value = res as Order[]

}

const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, 
});

</script>

<style scoped>
.item-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(10rem, 1fr));
    gap: 0.5rem 1rem;
}
</style>