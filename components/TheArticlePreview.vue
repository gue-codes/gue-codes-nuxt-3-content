<script setup lang="ts">
import type { ParsedContent } from "@nuxt/content/dist/runtime/types";

const props = defineProps({
  article: {
    type: Object as PropType<ParsedContent>,
    required: true,
  },
});

const formatDate = (date: string) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("de", options as any);
};

const postDate = computed(() => {
  // return Date.now().toLocaleString("de-DE");
  if (props.article.updatedAt === props.article.createDate) {
    return `erstellt am ${formatDate(props.article.createdAt)}`;
  } else {
    return `aktualisiert am ${formatDate(props.article.updatedAt)}`;
  }
});
</script>

<template>
  <article>
    <div class="bg-white shadow-md border border-gray-200 rounded-lg mb-5 mx-2">
      <NuxtLink :to="`${article._path}/`">
        <img class="rounded-t-lg" :src="article.img" alt="" />
      </NuxtLink>
      <div class="tags px-5 pt-4">
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="`/tags/${tag}/`"
          class="rounded-md bg-gray-200 text-xs px-2 py-1 text-yellow-700 mr-2"
          >{{ tag }}</NuxtLink
        >
      </div>
      <div class="px-5 pb-5 pt-2">
        <NuxtLink :to="`${article._path}/`">
          <h5 class="text-gray-900 font-bold text-2xl tracking-tight mb-2">
            {{ article.title }}
          </h5>
        </NuxtLink>
        <p class="text-gray-300 text-sm my-2">{{ postDate }}</p>
        <p class="font-normal text-gray-700 mb-3">
          {{ article.description }}
        </p>
        <NuxtLink
          :to="`${article._path}/`"
          class="text-white bg-yellow-600 hover:bg-yellow-400 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
        >
          weiterlesen
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
