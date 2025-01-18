<script setup lang="ts">
import type { NumberFieldDecrementProps } from 'radix-vue'
import { cn } from '@/lib/utils'
import { NumberFieldDecrement, useForwardProps } from 'radix-vue'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<NumberFieldDecrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <NumberFieldDecrement data-slot="decrement" v-bind="forwarded" :class="cn('absolute top-1/2 -translate-y-1/2 left-0 p-3 disabled:cursor-not-allowed disabled:opacity-20', props.class)">
    <slot>
      <FontAwesome class="" icon="fa fa-minus"></FontAwesome>
    </slot>
  </NumberFieldDecrement>
</template>
