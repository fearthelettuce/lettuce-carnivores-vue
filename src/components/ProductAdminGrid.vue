
<template>
  <BaseGrid 
    id="product-category-admin"
    :columnDefs="productCategoryGrid"
    :defaultColumnDefs
    :gridOptions
    :rowData="productCategories"
    :isLoading
  />
</template>

<script setup lang="ts">
import BaseGrid from '@/components/BaseGrid.vue';
import type { ColDef, GridOptions, ICellRendererParams, ISelectCellEditorParams } from 'ag-grid-community';
import { onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { storeToRefs } from 'pinia';
import { productCategoryList, productStatusList, subCategories } from "@/constants/constants";

  const productStore = useProductStore()
  const { productCategories, isLoading, isSaving }  = storeToRefs(productStore)
  const { getProducts } = productStore

  onMounted(() => {
    getProducts()
  })

  const defaultColumnDefs: ColDef = {
  
  }
  
  const gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: 'fitCellContents',

    },
  }
  
  const productCategoryGrid: ColDef[] = [
    { field: 'id', headerName: 'ID', editable: true, width: 64 },
    {
      field: 'category',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: productCategoryList
      },
      width: 120
    },
    {
      field: 'subCategory',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: getSubcategoryParams,
      width: 120
    },
    { field: 'name', editable: true, width: 240},
    { field: 'description',  editable: true },
    {
      field: 'status',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
      values: productStatusList
      }
    },
    // { field: 'tags',  cellEditor: 'agTextCellEditor' },
    { field: 'createdDate', cellDataType: 'date', editable: true, cellEditor: 'agDateCellEditor', },
    { field: 'dateUpdated', cellDataType: 'date', editable: true, cellEditor: 'agDateCellEditor', },
  ]

  function getSubcategoryParams(params: ICellRendererParams): ISelectCellEditorParams {
    return { values: subCategories.get(params.data.category) ?? [] }
  }
  
</script>