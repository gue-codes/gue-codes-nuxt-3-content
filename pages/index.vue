<script setup lang="ts">
const { data } = await useAsyncData("home", () =>
  queryContent("blog").limit(3).sort({ createdAt: -1 }).find()
);
</script>

<template>
  <div>
    <h1>Home</h1>
    <TheArticlePreview :article="entry" v-if="data" v-for="entry in data" />
  </div>
</template>
