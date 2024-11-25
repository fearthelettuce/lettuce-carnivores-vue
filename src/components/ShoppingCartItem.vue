<template>
<div class="cart-item">
    <router-link :to="`/plants/${encodeURIComponent(item.categoryId)}/${item.sku}`" class="align-content-center">
      <div class="cart-item-photo">
          <img
          :src="getImageUrl(item)"
          :class="getImageUrl(item) == placeholderUrl ? 'placeholderImage' : 'cardImage'"
          :alt="`An image of ${item.name}`"
          />
      </div>
    </router-link>
    <div class="item-info">
      <div class="grid-col-2">
          <router-link :to="`/plants/${encodeURIComponent(item.categoryId)}/${item.sku}`">{{ `${item.name}` }}</router-link>
      </div>
      <div class="my-1">Size: {{ item.size }}</div>
      <div class="my-1" v-if="!item.isRepresentative">Specimen {{ item.sku }}</div>
      <div class="quantity-input mt-2 input-group input-group-sm">
          <span class="input-group-prepend">
          <button type="button" class="btn btn-outline-light btn-number btn-sm" @click="decreaseQuantity(item)">
              <FontAwesome class="text-light" icon="fa fa-minus"></FontAwesome>
          </button>
          </span>
          <input type="text" class="form-control input-number text-center btn-sm" :value="item.quantity" />
          <span class="input-group-append">
          <button
              type="button"
              class="btn btn-outline-light btn-number btn-sm"
              :disabled="item.quantity >= item.maxQuantity"
              @click="increaseQuantity(item)"
          >
              <FontAwesome class="text-light" icon="fa fa-plus"></FontAwesome>
          </button>
          </span>
      </div>
    </div>

    <div v-if="discountedPrice === undefined" class="item-subtotal">
        <div class="text-center">{{ USDollar.format(item.price * item.quantity) }}</div>
    </div>
    <div v-else class="item-subtotal">
      <div class="text-center strikethrough">{{ USDollar.format(item.price * item.quantity) }}</div>
      <div class="text-center">{{ USDollar.format(discountedPrice * item.quantity) }}</div>
    </div>
</div>
</template>

<script setup lang="ts">
import type { CartItem } from '@/types/Orders'
import { getPhotoUrl, placeholderUrl } from '@/composables/usePhotoUtils'
import { USDollar } from '@/utils/utils';
import { useOrderStore } from '@/stores/order'

const props = defineProps<{ item: CartItem, discountedPrice: number | undefined }>()
const emit = defineEmits(['cartItemsChanged'])
const { addItemToCart, removeItemFromCart } =  useOrderStore()

async function increaseQuantity(item: CartItem) {
  await addItemToCart(item)
  emit('cartItemsChanged')
}

async function decreaseQuantity(item: CartItem) {
  if (item.quantity <= 1) {
    await deleteItem(item)
  } else {
    removeItemFromCart(item, false)
  }
  emit('cartItemsChanged')
}

async function deleteItem(item: CartItem) {
  removeItemFromCart(item, true)
  emit('cartItemsChanged')
}

function getImageUrl(cartItem: CartItem) {
  if (cartItem.photo && cartItem.photo.path) {
    return getPhotoUrl(cartItem.photo.path, 256)
  } else {
    return getPhotoUrl(null)
  }
}

</script>

<style scoped lang="scss">

  .cart-item {
    display: flex;
    flex-direction: row;
    margin: 1rem 0.5rem;
  }

.cart-item-photo {
  img {
    width: 6rem;
    height: 8rem;
    object-fit: cover;
    border-radius: 0.5rem;
  }
}

.strikethrough {
  text-decoration: line-through;
  color: $medium-red;
}
.item-subtotal {
  margin: 0 0.5rem 0 auto;
}
.item-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 1rem;
}
.item-details {
  padding: 1rem;
  margin: 0 1rem;
}
.item-info {
  display: flex;
  flex-direction: column;
  margin: 0 0.8rem;
}
.quantity-input {
  width: 6rem;
}
@media (min-width: 27rem) {
  .cart-item-photo {
    img {
      width: 10rem;
      height: 10rem;
      object-fit: cover;
    }
  }
  .item-info {
    margin: 0.5rem 1rem 0.5rem 2rem;
  }
  .item-subtotal {
    margin: 0.5rem 0.5rem 0 auto;
  }
}
@media (min-width: 60rem) {
  .cart-item-photo {
    img {
      width: 15rem;
      height: 15rem;
      object-fit: cover;
    }
  }
}
</style>