<template>
    <main>
        <div class="container-fluid">
            <slot></slot>
        </div>
        </main>
</template>

<style scoped>
    main {
        padding: 0 clamp(.5dvw, 5dvw, 10dvw);
    }
</style>