<template>
    <div class="card">
       <div> <img :src="cardImageUrl" /></div>
        <div class="card-title my-0">
            <div>
                <h5 class="text-primary card-name m-0">{{ product.name }}</h5>
            </div>
            <div>
                <p class="text-primary">{{ product.price }}</p>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-primary">View</button>
        </div>
        
    </div>
</template>

<script setup lang="ts">

//TODO look at cards for inspiration on this website: https://jamesbigleyranches.com/
// const props = defineProps([{
//     product: {
//         type: product,
//         required: true
//     },
//     buttonAction: {
//         type: function,
//     }
// }'product', {}'primaryAction'])


const props = defineProps(['product','cardAction', 'cardImageUrl'])
</script>

<style scoped>
img {
    width: 100%;
    display: block;
    height: 25em;
    object-fit: cover;
}

.card {
    display: flex;
    flex-direction: column;
    width: 100%;
    background-color: rgb(65, 65, 65);
    border-radius: 2em;
    overflow:hidden;
}

.card-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between
}

.card-name {
    min-height: 3em;
}

.card-footer {
    padding: 18px;
    overflow: hidden;
    border-top: 1px solid #dedede;
    display: flex;
    justify-content: space-between;
}

</style>