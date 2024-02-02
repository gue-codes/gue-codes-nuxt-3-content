---
title: Ein statischer Blog mit nuxt.js und dem Content-Modul
description: "Einen eigenen JAM-Stack Blog erstellen ist super einfach - dank Nuxt/Content & Tailwind CSS"
img: /article-imgs/ein-statischer-blog-mit-nuxt-js-und-dem-content-modul.jpg
tags: ["nuxt"]
createdAt: "2022-01-31T20:08:56.005Z"
updatedAt: "2022-02-17T12:15:05.025Z"
---

Heute gibt es einen kleinen Einblick hinter die Kulissen. Diese Seite habe ich mit Nuxt erstellt und ich nutze das Content-Modul für das Erstellen der Beiträge.

Die Architektur, bzw. diese Art der Webseitenerstellung folgt dem JAM-Stack Prinzip und wird auch gerne als “Static Site Generation” bezeichnet. JAM steht für JavaScript, API’s und Markup und verringert ein Stück weit die Komplexität, da man die fertigen HTML Dateien einfach auf einem Webserver ablegt und die Seite direkt live ist.

Als ich das Content-Modul von Nuxt das erste mal gesehen habe, wollte ich das sofort ausprobieren! Als Ergebnis ist letztlich dieser Blog entstanden =)

> Disclaimer: Zum Zeitpunkt dieses Beitrags, befinden wir uns in einer Übergangsphase. Die nächste Version von Nuxt wird demnächst releast und das Content-Modul ist noch nicht in der Version 3 von nuxt verfügbar. Wenn du also dieser Anleitung folgen willst, um deine eigene Seite zu erstellen, dann musst du Nuxt Version 2 nutzen.

## First Things first - ein neues Nuxt-Projekt erstellen

Erstelle als ersten ein ganz neues Nuxt-Projekt in einem Ordner deiner Wahl.

```bash
npx create-nuxt-app nuxt-content-blog
```

Ich habe folgende Optionen in dem CLI Tool ausgewählt. Die wichtigsten Optionen für das Content-Modul sind hier `Nuxt.js modules` - da musst du das Content-Modul auswählen und `Deployement target` - hier musst du Static auswählen.

Optional: Ich nutze gerne Tailwind CSS, daher hab ich das ebenfalls ausgewählt 😃

```bash
create-nuxt-app v4.0.0
✨  Generating Nuxt.js project in nuxt-content-blog
? Project name: nuxt-content-blog
? Programming language: JavaScript
? Package manager: Npm
? UI framework: Tailwind CSS
? Nuxt.js modules: Content - Git-based headless CMS
? Linting tools: ESLint, Prettier
? Testing framework: None
? Rendering mode: Universal (SSR / SSG)
? Deployment target: Static (Static/Jamstack hosting)
? Development tools: (Press <space> to select, <a> to toggle all, <i> to invert se
lection)
? Continuous integration: None
? Version control system: Git
```

Sobald die Installation durch ist, kann man den Editor seiner Wahl öffnen und sich die Ordner und Files ansehen, die erzeugt wurden.

![nuxt-content-blog-first-project-view.png](/article-imgs/nuxt-content-blog-first-project-view.png)

Du kannst den Entwicklungsserver im Projekt-Ordner mit `npm run dev` starten und im Browser auf [http://localhost:3000/](http://localhost:3000/) kannst du das Blanko-Projekt betrachten:

![nuxt-content-blog-localhost](/article-imgs/nuxt-content-blog-localhost.png)

## Der content-Ordner

Der wohl wesentlichste Unterschied gegenüber allgemeinen Nuxt-Projekten, ist der “content” Ordner. Hier kannst du künftig deine Blogbeiträge im Markdown-Format ablegen.

Das Content-Modul wandelt beim speichern alle Markdown-Files dann in HTML-Content um.

Die CLI hat bereits ein Beispielfile “hello.md” in dem Ordner angelegt, das du dir gerne ansehen kannst. Ganz oben im File befindet sich ein Abschnitt der von dem eigentlichen Inhalt des Files getrennt ist. Diesen Abschnitt nennt man Frontmatter und den kann man ein wenig wie den Head-Bereich eines allgemeinen HTML-Files betrachten.

```markdown
---
title: Getting started
description: "Empower your NuxtJS application with @nuxt/content module: write in a content/ directory and fetch your Markdown, JSON, YAML and CSV files through a MongoDB like API, acting as a Git-based Headless CMS."
---
```

Das Frontmatter befüllt für jeden Beitrag alle diese Felder:

```jsx
{
  body: Object;
  excerpt: Object;
  title: "Introduction";
  description: "Learn how to use @nuxt/content.";
  dir: "/";
  extension: ".md";
  path: "/index";
  slug: "index";
  toc: Array;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

Prinzipiell kannst du in deinem Beitrag alle diese Felder übersteuern und darüber hinaus noch eigene Felder definieren. Ich pflege zum Beispiel auch tags im Frontmatter für jeden Beitrag, damit ich die Blog-Posts später für Themenseiten herausfiltern kann.

## Lass uns aus der Seite einen simplen Blog machen

Ich lösche zunächst das Beispiel `hello.md` aus dem Content-Ordner und erzeuge erstmal einen Unterordner “blog” und lege dort die Datei `erster-beitrag.md` mit folgenden Inhalt rein:

```markdown
---
title: Erster Beitrag
tags: ["allgemein"]
---

## Das hier ist der erste Beitrag

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.

<!--more-->

Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.

### Das hier ist eine H3

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
```

Im Frontmatter hab ich ein Feld `tags` ergänzt und speichere die Tags für den Artikel als Array-Einträge ab.

> In dem Text hab ich `<!—more—>` ergänzt. Das bewirkt, das der Text bis zu diesem Marker im Feld `description` landet. Das kann man dann wiederrum nutzen um Auszüge des Textes zum Beispiel auf einer Übersichtseite darzustellen.

## Die Blogbeiträge auslesen

Als nächstes hol ich mir die Blogbeiträge in `pages/index.vue`

```jsx
<template>
  <section>
		<h1>Blogbeiträge</h1>
    <article v-for="article in articles" :key="article.title">
      <h2>{{ article.title }}</h2>
      <p>{{ article.description }}</p>
    </article>
  </section>
</template>

<script>
export default {
  name: 'IndexPage',
  async asyncData({ $content }) {
    const articles = await $content('blog').fetch()
    return {
      articles,
    }
  },
}
</script>
```

Jetzt kann man bereits auf der Startseite den ersten Post mit Auszug sehen 🥳

![nuxt-content-blog-localhost-first-content.png](/article-imgs/nuxt-content-blog-localhost-first-content.png)

Das find ich persönlich so bemerkenswert einfach, das ich jedesmal wieder begeistert bin 😅 Als nächstes werde ich das ganze noch ein wenig aufhübschen.

## Ein Bild zum Beitrag hinzufügen

Im Ordner static hab ich einen Unterordner img angelegt und dort ein Bild von [unsplash.com](http://unsplash.com) hinzugefügt:

![nuxt-content-blog-static-img-folder.png](/article-imgs/nuxt-content-blog-static-img-folder.png)

Im Beitrag ergänze ich die Info im Frontmatter:

```markdown
---
title: Erster Beitrag
tags: ["allgemein"]
img: /img/erster-beitrag.jpg
---
```

Dann hat man direkt das Bild für den Beitrag in der Hand:

```jsx
<img :src="article.img" :alt="article.title"/>
```

## Eine Komponente für den einzelnen Beitrag erstellen

Als nächstes lege ich eine BlogPost-Komponente an, um den Code ein wenig überschaubarer zu machen.

Im Ordner `components` leg ich die Datei `BlogPost.vue` an. Neben den bereits genutzten Feldern, ergänze ich auch gleich die Ausgabe der Tags. Da ich diese als Array im Frontmatter definiert habe, kann ich ganz einfach drüber loopen und mir alle Tags ausgeben lassen:

```jsx
<template>
  <article>
    <h2>{{ article.title }}</h2>
    <ul>
      <li v-for="tag in article.tags" :key="tag">{{ tag }}</li>
    </ul>
    <img :src="article.img" :alt="article.title" />
    <p>{{ article.description }}</p>
  </article>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true,
      default() {
        return {
          title: 'Post Title',
          description: 'Post Description',
          tags: ['tagname'],
          img: '/link/to/your/image.file',
        }
      },
    },
  },
}
</script>
```

Jetzt kann ich unter `pages/index.vue` den bisherigen Code gegen die Komponente austauschen:

```jsx
<template>
  <section>
    <h1>Blogbeiträge</h1>
    <blog-post
      v-for="article in articles"
      :key="article.title"
      :article="article"
    ></blog-post>
  </section>
</template>

<script>
import BlogPost from '../components/BlogPost.vue'
export default {
  components: { BlogPost },
  name: 'IndexPage',
  async asyncData({ $content }) {
    const articles = await $content('blog').fetch()
    return {
      articles,
    }
  },
}
</script>
```

> Wichtig: Bei der Verwendung der Komponenten müssen wir mit dem Content-Modul die **Kebap-Case-Schreibweise** benutzen und dürfen auch keine selbstschließende Tags verwenden. Beides führt sonst zu Fehlern.

## Die dynamische Beitragsseite und <nuxt-content>

Noch sehen wir nicht den ganzen Beitrag, sonder nur den Auszug. Da ich gerne die selbe Komponente `BlogPost.vue` auch auf der Beitragsseite verwenden möchte, erweitere ich diese um eine neue prop `preview` um die Ausgabe steuern zu können.

Wenn `preview` mit `false` übergeben wird, dann kann man mit der `<nuxt-content>` Komponente den Inhalt des gesamten Beitrags anzeigen lassen:

```jsx
<template>
  <article>
    <h2>{{ article.title }}</h2>
    <ul>
      <li v-for="tag in article.tags" :key="tag">{{ tag }}</li>
    </ul>
    <img :src="article.img" :alt="article.title" />
    <p v-if="preview">{{ article.description }}</p>
    <nuxt-content v-else :document="article" />
  </article>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true,
      default() {
        return {
          title: 'Post Title',
          description: 'Post Description',
          tags: ['tagname'],
          img: '/link/to/your/image.file',
        }
      },
    },
    preview: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
```

Jetzt kann ich im Ordner `pages` eine neue Seitenkomponente mit dynamischen Seitennamen erstellen, damit wir auf den einzelnen Beitrag kommen.

![nuxt-content-blog-dynamic-page-component.png](/article-imgs/nuxt-content-blog-dynamic-page-component.png)

In dem File hole ich mir von dem Router den hinteren Teil der URL um den passenden Beitrag aus dem Content-Ordner zu holen. Dazu können wir einfach den Wert `params.slug` der in der `$route` enthalten ist auslesen.

```jsx
<template>
  <blog-post :article="article" :preview="false"></blog-post>
</template>

<script>
import BlogPost from '../components/BlogPost.vue'
export default {
  components: { BlogPost },
  async asyncData({ $content, params }) {
    const article = await $content('blog', params.slug).fetch()
    return { article }
  },
}
</script>
```

In der Komponente `BlogPost.vue` ergänzen wir noch einen `<nuxt-link>` auf der Überschrift, so wie einen Button, die beide auf die Artikelseite verlinken. Damit die Links auf der Seite selber nicht viel Sinn machen, bzw. auf sich selber zeigen würden, greife ich das Prop `preview` auf um die Links zu deaktivieren:

```jsx
<template>
  <article>
    <nuxt-link v-if="preview" :to="article.slug"
      ><h2>{{ article.title }}</h2></nuxt-link
    >
    <h2 v-else>{{ article.title }}</h2>
    <ul>
      <li v-for="tag in article.tags" :key="tag">{{ tag }}</li>
    </ul>
    <img :src="article.img" :alt="article.title" />
    <p v-if="preview">{{ article.description }}</p>
    <nuxt-content v-else :document="article" />
    <nuxt-link v-if="preview" :to="article.slug"
      ><button>Weiterlesen</button></nuxt-link
    >
  </article>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true,
      default() {
        return {
          title: 'Post Title',
          description: 'Post Description',
          tags: ['tagname'],
          img: '/link/to/your/image.file',
        }
      },
    },
    preview: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
```

## Grundlegendes Layout erstellen mit Tailwind CSS

Bis hierhin haben wir es geschafft unseren Content in Markdown zu schreiben und den Inhalt auf der Seite auszugeben. Abschließend will ich noch ein paar grundlegende Styles und Komponenten ergänzen, damit das Ganze ein wenig wie eine richtige Seite aussieht.

Hier zu erstelle ich zwei neue Komponenten, `TheHeader.vue` und `TheFooter.vue`

Anschließend erstelle ich einen neuen Ordner `layouts` und dort kommt das File `default.vue` hinein.

![nuxt-content-blog-default-layout-component.png](/article-imgs/nuxt-content-blog-default-layout-component.png)

Hier kommen die beiden neuen Komponenten in das File rein, einmal vor den Content und einmal danach:

```jsx
// default.vue
<template>
  <div>
    <the-header></the-header>
    <Nuxt class="mx-auto px-8 max-w-6xl" />
    <the-footer></the-footer>
  </div>
</template>
```

Die beiden Komponenten schauen wie folgt aus:

```jsx
// TheHeader.vue
<template>
  <div class="h-20 bg-gray-100 flex flex-wrap justify-content content-center">
    <nav class="mx-8 max-w-4xl">
      <nuxt-link to="/" class="font-black text-2xl">
        NuxtBlog
      </nuxt-link>
    </nav>
  </div>
</template>
```

```jsx
//TheFooter.vue
<template>
  <footer class="mt-16">
    <div class="text-center text-gray-400 p-4 border-t border-gray-100">
      ©{{ theyear }} NuxtBlog
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    theyear() {
      return new Date(Date.now()).getFullYear()
    },
  },
}
</script>
```

Dadurch erhalten wir folgende Startseite:

![nuxt-content-blog-first-unstyled-content.png](/article-imgs/nuxt-content-blog-first-unstyled-content.png)

## Allgemeine Styles hinzufügen

Das Grundgerüst steht, jetzt benötigen wir nur nur noch ein paar allgemeine Styles, die ich im dem File `default.vue` im `<style>` Abschnitt reinpacke.

```jsx
// default.vue
...
<style>
body {
  @apply text-gray-700;
}
h1 {
  @apply text-5xl font-extralight text-gray-900 sm:text-6xl mt-6 mb-1;
}
h2 {
  @apply text-4xl font-extrabold text-green-800 mt-6 mb-1;
}
h3 {
  @apply text-2xl font-bold text-green-800 mt-6 mb-1;
}
h4 {
  @apply text-xl font-bold text-green-800 mt-6 mb-1;
}
p {
  @apply text-lg mb-4;
}
button {
  @apply bg-green-800 text-white hover:bg-green-600 font-bold rounded px-4 py-2;
}
blockquote {
  @apply bg-gray-100 border-l-4 border-gray-300 px-4 pt-4;
  padding-bottom: 0.15rem;
}
</style>
```

Dadurch erhalten wir folgenden Look:

![nuxt-content-blog-first-base-styles.png](/article-imgs/nuxt-content-blog-first-base-styles.png)

## Der letzte Feinschliff

Das Bild ist sehr groß und nimmt sehr viel Platz ein, daher möchte ich ebenfalls ein wenig an der Optik feilen und gerne auch noch ein Beitragsdatum anzeigen. Hierzu werde ich die BlogPost.vue ein wenig umstrukturieren und Logik ergänzen.

```jsx
//BlogPost.vue
<template>
  <article>
    <nuxt-link v-if="preview" :to="article.slug"
      ><h2>{{ article.title }}</h2></nuxt-link
    >
    <h2 v-else class="mb-6">{{ article.title }}</h2>
    <div
      class="wrapper"
      :class="preview ? 'flex flex-wrap md:flex-nowrap flex-row ' : ''"
    >
      <div>
        <img
          :src="article.img"
          :alt="article.title"
          :class="preview ? 'max-w-md rounded-xl mr-3 mt-3' : 'rounded-xl mb-8'"
        />
      </div>
      <div class="m-3">
        <ul class="mb-2">
          <li
            v-for="tag in article.tags"
            :key="tag"
            class="rounded-md border border-green-800 px-2 py-1 text-xs w-min text-green-800 inline-block mr-2"
          >
            {{ tag }}
          </li>
        </ul>
        <div class="text-gray-500 text-xs mt-4 mb-2">
          {{ formatDate(article.updatedAt) }}
        </div>
        <p v-if="preview">{{ article.description }}</p>
        <nuxt-content v-else :document="article" />
        <nuxt-link v-if="preview" :to="article.slug"
          ><button>Weiterlesen</button></nuxt-link
        >
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      required: true,
      default() {
        return {
          title: 'Post Title',
          description: 'Post Description',
          tags: ['tagname'],
          img: '/link/to/your/image.file',
        }
      },
    },
    preview: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('de', options)
    },
  },
}
</script>
```

Ein paar kleine Style-Anpassungen gab es auch in der `pages/index.vue`:

```jsx
// index.vue
<template>
  <section>
    <h1 class="my-10">Blogbeiträge</h1>
    <blog-post
      v-for="article in articles"
      :key="article.title"
      :article="article"
      class="mb-16"
    ></blog-post>
  </section>
</template>
```

Ich habe auch testweise einen zweiten Beitrag ergänzt. Das Ergebnis sieht final so aus:

![nuxt-content-blog-final-styling.png](/article-imgs/nuxt-content-blog-final-styling.png)

## Fazit

Mit relativ wenig Code und Aufwand ist es möglich einen statischen Blog zu erzeugen. Dank Tailwind CSS ist auch das Styling schnell erledigt und man bekommt einen ordentlich aussehende Seite auf die Beine gestellt. Auch das bloggen ist mit dem JAM-Stack super simpel. Einfach ein Markdown-File anlegen und Nuxt übernimmt den Rest.

Natürlich kann man hier dann auch tiefer einsteigen und zum Beispiel dynamische Tag Seiten anlegen und die Tags der Beiträge verlinken. Das Content-Modul bietet ebenfalls noch mehr Abfrage-Möglichkeiten um Beiträge zu filtern, zu sortieren und vieles mehr.

Falls du ebenfalls deinen Blog mit nuxt/content umsetzen möchtest, dann wirf auf jedenfall auch einen Blick in die Dokumentation:

[https://content.nuxtjs.org/](https://content.nuxtjs.org/)

### Den gesamten Code kannst du auf github auschecken

[https://github.com/gue-codes/nuxt-content-blog](https://github.com/gue-codes/nuxt-content-blog)
