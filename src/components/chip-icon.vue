<template>
    <div class="chip-container" :class="`color-${color}`">
        <slot />
    </div>
</template>

<script setup>
defineProps(['color'])
</script>