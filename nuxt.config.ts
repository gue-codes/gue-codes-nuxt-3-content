// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/content",
    "nuxt-icon",
  ],
  googleFonts: {
    download: true,
    families: {
      Nunito: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
});
