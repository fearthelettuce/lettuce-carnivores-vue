<template>
    <main>
        <div class="bscontainer-fluid">
            <slot></slot>
        </div>
    </main>
</template>

<style scoped>
    main {
        padding: 0 clamp(.1dvw,2.5dvw, 10dvw);
        margin-top: 1.5rem;
    }
    .bscontainer-fluid {
        padding: 0;
    }
</style>