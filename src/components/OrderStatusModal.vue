<template>
    <BaseDialog :open="open" class="border-0 rounded p-0">
        <div class="order-modal p-3">
            <header class="">
                <h4 class="modal-title">Order {{ order.id }}</h4>
                <BaseButton type="close" class="close-button" aria-label="Close" @click="toggleModal" />
            </header>
            <div class="modal-container">
                <div class="shipping-address">
                    <h5>Shipping Address</h5>
                    <div>{{ order.shippingInfo.name }}</div>
                    <div>{{ order.shippingInfo.address.line1 }}</div>
                    <div v-if="order.shippingInfo.address.line2">{{ order.shippingInfo.address.line2 }}</div>
                    <div>
                        {{ `${order.shippingInfo.address.city} ${order.shippingInfo.address.state} ${order.shippingInfo.address.postal_code}` }}
                    </div>
                </div>
                <form class="status-form" @submit.prevent>
                    <div>
                        <Label for="status">Status</Label>
                        <Input type="text" id="status" label="Name" outer-class="grid-col-2" v-model="order.orderStatus.status" />
                    </div>
                    <div>
                        <Label for="tracking">Tracking</Label>
                        <Input type="text" id="tracking" label="Tracking Number" outer-class="grid-col-2" v-model="order.orderStatus.trackingNumber" />
                    </div>
                    <div>
                        <Label for="carrier">Carrier</Label>
                        <Input type="text" id="carrier" outer-class="grid-col-2" v-model="order.orderStatus.carrier" />
                    </div>
                    <BaseButton @click="saveOrder">Save</BaseButton>
                </form>
                <!-- <FormKit type="form" id="order-status" submit-label="Save" @submit="saveOrder" class="tracking-form">
                    <FormKit type="text" label="Name" outer-class="grid-col-2" v-model="order.orderStatus.status" />
                    <FormKit type="text" label="Tracking Number" outer-class="grid-col-2"
                        v-model="order.orderStatus.trackingNumber" />
                    <FormKit type="text" label="Carrier" outer-class="grid-col-2" v-model="order.orderStatus.carrier" />

                </FormKit> -->

            </div>
        </div>
    </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseDialog from '@/components/ui/BaseDialog.vue';
import type { Order } from '@/types/Orders'
import { saveItem } from '@/apis/dataServices'
import { toast } from 'vue3-toastify';
import Input from '@/components/ui/input/Input.vue';
const props = defineProps<{ order: Order }>()

const isSaving = ref(false)
async function saveOrder() {

    isSaving.value = true
    try {
        await saveItem('orders', props.order)
        toast.success('Saved to orders')
        await saveItem(`customers/${props.order.customer}/orders`, props.order)
        toast.success('Saved to customer/orders')
    } catch (e: any) {
        throw new Error(e.toString())
    } finally {
        isSaving.value = false
    }
    //save to orders collection
    //save to customer/uid/orders collection
}

const open = ref(false)
defineExpose({ toggleModal })
function toggleModal() {
    open.value = !open.value;

}
</script>

<style scoped>

.modal-container {
    display: flex;
    gap: 2rem;
}

.order-modal {
    min-width: 16rem;
    max-width: 90dvw;
    overflow: none;
}
header {
    display: flex;
    justify-content: space-between;
    margin-block: 1rem;
    box-sizing: border-box;
}
.close-button {
    top: 2px;
    right: 24px;
}
.status-form > div {
    display: grid;
    grid-template-columns: 1fr 2fr;
    margin-block: .5rem;
    align-items: center;
}

.shipping-address {
    justify-content: center;
    display: flex;
    flex-direction: column;
}

.tracking-form {
    display: flex;
    flex-direction: column;
    width: 200rem;
    margin-top: 0 !important;
}


</style>

<!-- TODO: Bootstrap replace close button -->
