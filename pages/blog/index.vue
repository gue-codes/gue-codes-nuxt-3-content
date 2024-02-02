<template>
  <section class="container mx-auto px-6 mt-3">
    <h2 class="mt-12 mb-4">Blog-Beiträge</h2>
    <section class="main-content mx-auto pb-10">
      <div class="flex flex-wrap overflow-hidden">
        <div class="w-full overflow-hidden md:w-3/4">
          <div class="articles">
            <blog-list-entry
              v-for="article in articles"
              :key="article.createdAt"
              :article="article"
            ></blog-list-entry>
          </div>
        </div>
        <div
          class="
            sidebar
            w-full
            overflow-hidden
            md:w-1/4
            px-10
            md:px-2
            mt-4
            md:order-2
          "
        >
          <div
            class="
              w-full
              overflow-hidden
              bg-gray-100
              p-6
              rounded-md
              mb-6
              flex flex-wrap
              space-x-2 space-y-2
            "
          >
            <h3 class="mt-0 mb-4 w-full">Beiträge nach Tags</h3>
            <nuxt-link
              v-for="tag in tags"
              :key="tag"
              :to="'/tags/' + tag + '/'"
              class="
                rounded-md
                bg-gray-200
                text-md
                px-2
                py-1
                text-yellow-700
                mr-2
              "
              >{{ tag }}</nuxt-link
            >
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import BlogListEntry from '~/components/BlogListEntry.vue'
export default {
  components: { BlogListEntry },
  async asyncData({ $content, params }) {
    const articles = await $content('blog', params.slug)
      .sortBy('createdAt', 'desc')
      .limit(10)
      .fetch()
    return {
      articles,
    }
  },
  computed: {
    tags() {
      const allTags = []
      for (const article of this.articles) {
        for (const tag of article.tags) {
          if ([].find) allTags.push(tag)
        }
      }
      const tags = [...new Set(allTags)]
      return tags
    },
  },
}
</script>

<style></style>
