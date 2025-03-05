<template>
  <AgGridVue 
    :id="id"
    :rowData
    :defaultColumnDefs
    :columnDefs
    :loading="isLoading"
    :style
    :theme="themeBalham"
    :autoSizeStrategy
    :masterDetail
    :detailCellRendererParams
    :groupDisplayType
    :gridOptions
    @grid-ready="onGridReady"
    @grid-destroyed="onGridDestroyed"
    suppressColumnVirtualisation
  />

</template>

<script setup lang="ts" generic="T">
import { ref, shallowRef, watch, type PropType, type Ref, type ShallowRef } from 'vue';
import { AgGridVue } from 'ag-grid-vue3'
import { ClientSideRowModelModule, ModuleRegistry, themeBalham } from 'ag-grid-community'
import type { ColDef, GridApi, GridOptions, ICellRendererParams } from 'ag-grid-community'
ModuleRegistry.registerModules([ClientSideRowModelModule]);

  const props = defineProps({
    id: {
      type: String,
      required: true
    },
    rowData: {
      type: Object as PropType<Array<T> | null>,
      required: true
    },
    defaultColumnDefs: {
      type: Object as PropType<ColDef>,
      required: true
    },
    columnDefs: {
      type: Object as PropType<ColDef[]>,
      required: true
    },
    masterDetail: {
      type: Boolean,
      default: false,
    },
    detailCellRendererParams: {
      type: Object as PropType<any | undefined>,
      required: false,
    },
    style: {
      type: String,
      default: 'height: 80dvh; min-width: 80dvw;'
    },
    theme: {
      type: String,
      required: false,
      default: 'ag-theme-quartz'
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    quickFilterText: {
      type: String,
      required: false,
    },
    gridOptions: {
      type: Object as PropType<GridOptions>,
      required: false,
    },
    autoSizeStrategy: {
      type: Object as PropType<GridOptions['autoSizeStrategy']>,
      required: false
    },
    groupDisplayType: {
      type: Object as PropType<GridOptions['groupDisplayType']>,
      required: false
    }
  })

  let gridApi: ShallowRef<GridApi | undefined> = shallowRef(undefined)
  let filters: Ref<{ [colId: string]: any} | undefined> = ref(undefined)


  // function updateFilters(params: ICellRendererParams) {
  //   filters.value = params.api.getFilterModel()
  // }

  function onGridReady(params: ICellRendererParams) {
    gridApi.value = params.api
    // updateFilters(params)
  }

  function onGridDestroyed() {
    gridApi.value = undefined
    filters.value = undefined
  }

  watch(
    () => props.quickFilterText,
    () => {
      if(gridApi.value && !gridApi.value.isDestroyed()) {
        gridApi.value.setGridOption('quickFilterText', props.quickFilterText)
      }
    }
  )
</script>

<style scoped>

  .grid-header-center .ag-header-cell-label {
    display: flex;
    justify-content: center;
  }

  .ag-group-value {
    display: inline-flex;
  }


</style>
