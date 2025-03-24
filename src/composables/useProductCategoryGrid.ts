import { productCategories, subCategories } from "@/constants/constants";
import type { GridOptions, ICellRendererParams, ISelectCellEditorParams } from "ag-grid-community";

export const productCategoryGridOptions: GridOptions = {
  columnDefs: [
    { field: 'id', editable: true, cellEditor: 'agTextCellEditor' },
    {
      field: 'category',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: productCategories
      }
    },
    {
      field: 'subCategory',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: getSubcategoryParams
    },
    { field: 'name', editable: true, cellEditor: 'agTextCellEditor' },
    { field: 'description', editable: true, cellEditor: 'agTextCellEditor' },
    { field: 'status', editable: true, cellEditor: 'agSelectCellEditor' },
    { field: 'tags', editable: true, cellEditor: 'agTextCellEditor' },
    { field: 'createdDate', cellDataType: 'date' },
    { field: 'dateUpdated', cellDataType: 'date' },
    { field: 'photos' }
  ]
}

function getSubcategoryParams(params: ICellRendererParams): ISelectCellEditorParams {
  return { values: subCategories.get(params.data.category) ?? [] }
}