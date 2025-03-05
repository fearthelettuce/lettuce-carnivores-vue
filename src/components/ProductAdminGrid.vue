
<template>
  <BaseGrid 
    id="product-admin"
    :columnDefs
    :defaultColumnDefs
    :gridOptions
    :rowData
  />
</template>

<script setup lang="ts">
import BaseGrid from '@/components/BaseGrid.vue';
import type { ColDef, GridOptions } from 'ag-grid-community';
import ButtonRenderer from '@/grid/ButtonRenderer.vue';

const defaultColumnDefs: ColDef = {
  sortable: true,
  resizable: true
}

const gridOptions: GridOptions = {
  autoSizeStrategy: {
    type: 'fitGridWidth',
  }
}

const columnDefs: ColDef[] = [
  {
    field: 'someField',
    headerName: 'Some Name',
    cellRenderer: ButtonRenderer,
    cellRendererParams: {
      clickHandler: someFunction
    }
  }
]

const rowData = [
  {
    someField: 1,
  },
  {
    someField: 2
  }
]
function someFunction() {
  console.log('hi')
}
</script>