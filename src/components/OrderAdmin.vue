<template>
    <OrdersList v-if="orders.length > 0" :orders :isAdmin="true" />
    <div v-else>No orders to display</div>
    <div class="d-flex flex-row gap-2 mt-4 justify-content-around">
        <button class="btn btn-primary" @click="fetchOpenOrders">View Open Orders</button>
        <button class="btn btn-secondary" @click="findAllOrders">View All Orders</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref,} from 'vue';
import { findAll, findByProperty } from '@/apis/dataServices';
import { toast } from 'vue3-toastify'
import { sortNumerically } from '@/utils/utils'
import OrdersList from '@/components/OrdersList.vue'
import type { Order } from '@/types/Orders'
const orders: Ref<Order[]> = ref([])
const isLoading = ref(false)
onMounted(()=>{
    fetchOpenOrders()
})

const fetchOpenOrders = async () => {
    isLoading.value = true
    try{
        const res = await findByProperty('orders', 'orderStatus.status', '!=', 'Complete')
        if(res !== undefined && res.length !== 0) {
            sortNumerically(res)
            orders.value = res as Order[]
        } 
    } catch (e: any) {
        console.error(e)
        toast.error('Error fetching orders')
    } finally {
        isLoading.value = false
    }
}

async function findAllOrders() {
    const res = await findAll(`orders`)
    if(res) {
        sortNumerically(res)
        orders.value = res as Order[]
    }
}

</script>
