<template>
    <div class="container">
        <slot></slot>
    </div>
</template>

<style scoped>
    main {
        padding: 0 clamp(.1dvw,2.5dvw, 10dvw);
        margin-top: 1.5rem;
    }
    .container {
        padding: 0;
    }
</style>