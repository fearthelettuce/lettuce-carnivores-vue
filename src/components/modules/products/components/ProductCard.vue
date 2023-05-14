<template>
    <div class="card">
       <div> <img :src="cardImageUrl" /></div>
        <div class="card-title">
            <div>
                <h3 class="text-primary">{{ product.name }}</h3>
            </div>
            <div>
                <h3 class="text-primary">{{ product.price }}</h3>
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
    padding: 10px;
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-basis: 24%
}

.card-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between
}

.card-footer {
    padding: 18px;
    overflow: hidden;
    border-top: 1px solid #dedede;
    display: flex;
    justify-content: space-between;
}

</style>