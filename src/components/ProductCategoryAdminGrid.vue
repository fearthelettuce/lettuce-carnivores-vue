
<template>
  <BaseGrid 
    id="product-category-admin"
    :columnDefs
    :defaultColumnDefs
    :gridOptions
    :rowData="productCategories"
    :isLoading
    ref="productCategoryGridRef"
  />
</template>

<script setup lang="ts">
import BaseGrid from '@/components/BaseGrid.vue';
import type { ColDef, GridOptions, ICellRendererParams, ISelectCellEditorParams } from 'ag-grid-community';
import { onMounted } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { storeToRefs } from 'pinia';
import { productCategoryList, productStatusList, subCategories } from "@/constants/constants";
import { useTemplateRef } from 'vue';

  const productStore = useProductStore()
  const { productCategories, isLoading, isSaving }  = storeToRefs(productStore)
  const { getProducts } = productStore

  const productCategoryGrid = useTemplateRef('productCategoryGridRef')
  
  onMounted(() => {
    getProducts()
  })

  const defaultColumnDefs: ColDef = {
    editable: true,
  }
  
  const gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: 'fitCellContents',

    },
  }
  
  const columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', editable: true, width: 64 },
    {
      field: 'category',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: productCategoryList
      },
      valueFormatter: (params) => params.data.id === '' ? 'New' : params.data.id,
      width: 120
    },
    {
      field: 'subCategory',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: getSubcategoryParams,
      width: 120
    },
    { field: 'name', editable: true, width: 240},
    { field: 'description',  editable: true },
    {
      field: 'status',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
      values: productStatusList
      }
    },
    // { field: 'tags',  cellEditor: 'agTextCellEditor' },
    { field: 'createdDate', cellDataType: 'date', cellEditor: 'agDateCellEditor', },
    { field: 'dateUpdated', cellDataType: 'date', cellEditor: 'agDateCellEditor', },
    { field: 'saveStatus', cellDataType: 'text', editable: false }
  ]

  function getSubcategoryParams(params: ICellRendererParams): ISelectCellEditorParams {
    return { values: subCategories.get(params.data.category) ?? [] }
  }
  
</script>