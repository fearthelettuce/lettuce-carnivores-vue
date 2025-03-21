import type { GridOptions } from "ag-grid-community";

const productCategoryGridOptions: GridOptions = {
  columnDefs: [
    { field: 'id' },
    { field: 'category' },
    { field: 'subCategory' },
    { field: 'name' },
    { field: 'description' },
    { field: 'status' },
    { field: 'isDiscountable' },
    { field: 'tags' },
    { field: 'createdDate', cellDataType: 'date' },
    { field: 'dateUpdated', cellDataType: 'date' },
    { field: 'photos' }
  ]
}