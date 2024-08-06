<template>
  <TheHeader />
  <RouterView />
</template>

<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import TheHeader from '@/components/header/TheHeader.vue';
</script>

<style lang="scss">
@import '@/assets/scss/main';
html {
  background-color: #44403b;
  color: #e1dcbd;
}
a {
    text-decoration: none;
}

li {
  list-style: none;
}

.textprimary {
  color: #9fdb50;
}
.textwarning {
  color: #FFBF46;
}
.textdanger {
  color: #EB5E55;
}
.textinfo {
  color: #00A0E5;
}
.textlight {
  color: #f8f9fa
}

.textcenter {
  text-align: center;
}
.dinlineblock {
  display: inline-block;
}
.dflex {
  display: flex;
}
.flexrow {
  flex-direction: row;
}
.flexcolumn {
  flex-direction: column;
}
.flexwrap {
  flex-wrap: wrap;
}
.aligncontentcenter {
  align-content: center;
}
.alignitemscenter {
  align-items: center;
} 
.justifycontentcenter {
  justify-content: center;
}
.justifycontentevenly {
  justify-content: space-evenly;
}
.justifycontentaround {
  justify-content: space-around;
}
.dgrid {
  display: grid;
}

.grid-col-2 {
    grid-column: span 2;
}
.grid-col-3 {
    grid-column: span 3;
}
.grid-col-4 {
    grid-column: span 4;
}
.grid-col-5 {
    grid-column: span 5;
}
.grid-col-10 {
    grid-column: span 10;
}

.bscontainer,
.bscontainer-fluid {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  width: 100%;
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  margin-right: auto;
  margin-left: auto;
}




.gap-0 {
  gap: 0 !important;
}

.gap-1 {
  gap: 0.25rem !important;
}

.gap-2 {
  gap: 0.5rem !important;
}

.gap-3 {
  gap: 1rem !important;
}

.gap-4 {
  gap: 1.5rem !important;
}

.gap-5 {
  gap: 3rem !important;
}


.m-0 {
  margin: 0 !important;
}

.m-1 {
  margin: 0.25rem !important;
}

.m-2 {
  margin: 0.5rem !important;
}

.m-3 {
  margin: 1rem !important;
}

.m-4 {
  margin: 1.5rem !important;
}

.m-5 {
  margin: 3rem !important;
}

.m-auto {
  margin: auto !important;
}

.mx-0 {
  margin-right: 0 !important;
  margin-left: 0 !important;
}

.mx-1 {
  margin-right: 0.25rem !important;
  margin-left: 0.25rem !important;
}

.mx-2 {
  margin-right: 0.5rem !important;
  margin-left: 0.5rem !important;
}

.mx-3 {
  margin-right: 1rem !important;
  margin-left: 1rem !important;
}

.mx-4 {
  margin-right: 1.5rem !important;
  margin-left: 1.5rem !important;
}

.mx-5 {
  margin-right: 3rem !important;
  margin-left: 3rem !important;
}

.mx-auto {
  margin-right: auto !important;
  margin-left: auto !important;
}

.my-0 {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.my-1 {
  margin-top: 0.25rem !important;
  margin-bottom: 0.25rem !important;
}

.my-2 {
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
}

.my-3 {
  margin-top: 1rem !important;
  margin-bottom: 1rem !important;
}

.my-4 {
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
}

.my-5 {
  margin-top: 3rem !important;
  margin-bottom: 3rem !important;
}

.my-auto {
  margin-top: auto !important;
  margin-bottom: auto !important;
}

.mt-0 {
  margin-top: 0 !important;
}

.mt-1 {
  margin-top: 0.25rem !important;
}

.mt-2 {
  margin-top: 0.5rem !important;
}

.mt-3 {
  margin-top: 1rem !important;
}

.mt-4 {
  margin-top: 1.5rem !important;
}

.mt-5 {
  margin-top: 3rem !important;
}

.mt-auto {
  margin-top: auto !important;
}

.me-0 {
  margin-right: 0 !important;
}

.me-1 {
  margin-right: 0.25rem !important;
}

.me-2 {
  margin-right: 0.5rem !important;
}

.me-3 {
  margin-right: 1rem !important;
}

.me-4 {
  margin-right: 1.5rem !important;
}

.me-5 {
  margin-right: 3rem !important;
}

.me-auto {
  margin-right: auto !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-1 {
  margin-bottom: 0.25rem !important;
}

.mb-2 {
  margin-bottom: 0.5rem !important;
}

.mb-3 {
  margin-bottom: 1rem !important;
}

.mb-4 {
  margin-bottom: 1.5rem !important;
}

.mb-5 {
  margin-bottom: 3rem !important;
}

.mb-auto {
  margin-bottom: auto !important;
}

.ms-0 {
  margin-left: 0 !important;
}

.ms-1 {
  margin-left: 0.25rem !important;
}

.ms-2 {
  margin-left: 0.5rem !important;
}

.ms-3 {
  margin-left: 1rem !important;
}

.ms-4 {
  margin-left: 1.5rem !important;
}

.ms-5 {
  margin-left: 3rem !important;
}

.ms-auto {
  margin-left: auto !important;
}

.p-0 {
  padding: 0 !important;
}

.p-1 {
  padding: 0.25rem !important;
}

.p-2 {
  padding: 0.5rem !important;
}

.p-3 {
  padding: 1rem !important;
}

.p-4 {
  padding: 1.5rem !important;
}

.p-5 {
  padding: 3rem !important;
}

.px-0 {
  padding-right: 0 !important;
  padding-left: 0 !important;
}

.px-1 {
  padding-right: 0.25rem !important;
  padding-left: 0.25rem !important;
}

.px-2 {
  padding-right: 0.5rem !important;
  padding-left: 0.5rem !important;
}

.px-3 {
  padding-right: 1rem !important;
  padding-left: 1rem !important;
}

.px-4 {
  padding-right: 1.5rem !important;
  padding-left: 1.5rem !important;
}

.px-5 {
  padding-right: 3rem !important;
  padding-left: 3rem !important;
}

.py-0 {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.py-1 {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}

.py-2 {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}

.py-3 {
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

.py-4 {
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
}

.py-5 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}

.pt-0 {
  padding-top: 0 !important;
}

.pt-1 {
  padding-top: 0.25rem !important;
}

.pt-2 {
  padding-top: 0.5rem !important;
}

.pt-3 {
  padding-top: 1rem !important;
}

.pt-4 {
  padding-top: 1.5rem !important;
}

.pt-5 {
  padding-top: 3rem !important;
}

.pe-0 {
  padding-right: 0 !important;
}

.pe-1 {
  padding-right: 0.25rem !important;
}

.pe-2 {
  padding-right: 0.5rem !important;
}

.pe-3 {
  padding-right: 1rem !important;
}

.pe-4 {
  padding-right: 1.5rem !important;
}

.pe-5 {
  padding-right: 3rem !important;
}

.pb-0 {
  padding-bottom: 0 !important;
}

.pb-1 {
  padding-bottom: 0.25rem !important;
}

.pb-2 {
  padding-bottom: 0.5rem !important;
}

.pb-3 {
  padding-bottom: 1rem !important;
}

.pb-4 {
  padding-bottom: 1.5rem !important;
}

.pb-5 {
  padding-bottom: 3rem !important;
}

.ps-0 {
  padding-left: 0 !important;
}

.ps-1 {
  padding-left: 0.25rem !important;
}

.ps-2 {
  padding-left: 0.5rem !important;
}

.ps-3 {
  padding-left: 1rem !important;
}

.ps-4 {
  padding-left: 1.5rem !important;
}

.ps-5 {
  padding-left: 3rem !important;
}
</style>
