---
title: Toasty-Vue - Eine Toast-Komponente mit Vue 3
description: "In diesem Beitrag zeige ich, wie man eine animierte Toast-Komponente mit Vue 3 erstellt."
img: /article-imgs/toasty-vue-eine-toast-komponente-mit-vue-3.jpg
tags: ["vue3", "komponenten"]
createdAt: "2022-02-16T21:20:13.154Z"
updatedAt: "2022-02-17T07:59:49.203Z"
---

Ich möchte dir zeigen, wie man eine einfache Toast-Komponente mit Vue.js bauen kann. Toasts sind Notifications die man zum Beispiel von seinem Smartphone oder Rechner schon kennt. Das sind die kleinen Banner die meistens oben rechts eingeblendet werden.

## TL;DR - Der Link zum Code auf github

Wenn Du einfach nur Code zum Kopieren und einfügen benötigst, dann findest den Code zu dem Beitrag auf meinem Github-Account unter:

> [https://github.com/gue-codes/toasty-vue](https://github.com/gue-codes/toasty-vue)

## Ein neues Vue 3 Projekt erstellen mit create-vue

Seit dem 07. Februar 2022 ist Vue 3 die offizielle aktuelle Vue Version, auch auf [vuejs.org](http://vuejs.org), daher werde ich dieses Projekt ebenfalls mit der aktuellen Vue Version erstellen und dabei auch die neue **Composition-API** von **Vue 3** nutzen.

Im Ordner deiner Wahl folgenden Befehl ausführen:

```bash
npm init vue@latest
```

Da ich hier nur eine Beispiel-Komponente bauen möchte, hab ich ich bei den Optionen so gut wie nichts angehakt, außer ESLint und Prettier:

```bash
✔ Project name: … toasty-vue
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit Testing? … No / Yes
✔ Add Cypress for both Unit and End-to-End testing? … No / Yes
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes
```

Als nächstes einfach den vorgegebenen Schritten folgen:

```bash
cd toasty-vue
npm install
npm run lint
npm run dev
```

Et voilà, wir haben ein laufendes Vue 3 Projekt mit einem Vite Server unter der Haube 🥳

```bash
vite v2.8.1 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose

  ready in 637ms.
```

Als nächstes schmeiß ich den ganzen Boilerplate Code raus. Ich leere den Ordner `components`, den Ordner `assets` und die Inhalte aus dem App.vue, damit ich ein komplett blankes Projekt in der Hand habe.

## Welche Files werden benötigt?

Für mein Beispiel benötige ich nur zwei Files, die `App.vue` die als Parent fungiert und die Komponente `ToastyVue.vue` die als Child im Parent eingebunden, bzw. aufgerufen wird.

![toasty-vue-der-projektordner.png](/article-imgs/toasty-vue-der-projektordner.png)

Der Plan ist, das im Parent ein Array mit den anfallenden Meldungen existiert, die als Prop in die Komponente reingereicht werden. Die Komponente kümmert sich dann um die Darstellung und Ausgabe der Meldung. Die Meldungen sollen sich Stapeln können und Animationen soll das ganze dann abrunden.

## App.vue und das HTML-Grundgerüst

Da bei diesem Beispiel keine echten Events anfallen, bei denen man mit Notifications reagieren könnte, hab ich ein einfache Seitenkomponente in App.vue erstellt, in der ein wenig Text enthalten ist, sowie ein Button, der die Toast-Meldungen auslösen soll. Dazu noch ein wenig CSS und das Grundgerüst ist bereits fertig.

```jsx
<template>
  <section class="main">
    <h1>Toasty-Vue Demo</h1>
    <p>Just click the Button to try it out 😃</p>
  </section>
  <section>
    <button class="primary">Show me the Toast!</button>
  </section>
</template>

<style>
body {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Helvetica, Arial, sans-serif;
  background-color: #f7f7f7;
  color: #222222;
}
h1 {
  font-size: 2em;
}
button {
  cursor: pointer;
  border: none;
  border-radius: 5px;
  padding: 0.5em 1em;
}
button.primary {
  background-color: #d78407;
  color: #ffffff;
  font-size: 1.5em;
  font-weight: bold;
}
button.primary:hover {
  background-color: #e6951d;
}
</style>
```

Als nächstes kommt der Inhalt des neuen `<script setup>` Abschnitts:

```jsx
<script setup>import {ref} from "vue"; const toasts = ref([]);</script>
```

Ich erzeuge hier ein reaktives Array `toasts` das die Meldungen enthalten soll, die angezeigt werden sollen.

Ich ergänze daher eine Funktion, die beim Klick auf dem Button, eine Meldung in das Array pushen soll und verdrahte den Button mit der Funktion:

```jsx
<script setup>
import { ref } from "vue";
const toasts = ref([]);
function addOne() {
  const fakeid = Date.now().toString();
  toasts.value.push({
    id: fakeid,
    title: "This is the Title",
    content: "This is the content",
  });
}
</script>
```

> Da ich später mit einem v-for über die Meldungen drüber loopen werde, erzeuge ich mir mit der `fakeid` einen String, den ich als id in die Meldung reinhänge. Solange ich nicht innerhalb einer Millisekunde zweimal auf den Button klicke, ist dieser Workaround erst mal “Good to Go” 😅

Damit haben wir das Grundgerüst in `App.vue` fertig. Als nächstes geht es dann schon um die Komponente.

## Die Toasty-Vue Komponente

Da die Daten von außen in die Komponente reingegeben werden, muss innerhalb der Komponente ein `prop` definiert werden, das die Meldungen entgegen nehmen kann.

Da die Meldungen sich “aufstapeln” sollen, macht es Sinn alle Toasts in einen Container zu packen und innerhalb dem Container über die `prop` zu loopen. Ich hab mir überlegt, auch einen Slot mit reinzupacken, damit man nach belieben von außen auch SVG-Icons mit reingeben kann. Damit die optische Aufteilung innerhalb der Notification mit Flex-Box funktionert, hab ich title und content noch zusätzlich in einen Wrapper gepackt. Den Wrapper benötige ich nur wegen dem CSS.

Das File `ToastyVue.vue` schaut zunächst so aus:

```jsx
<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" class="toast">
			<slot></slot>
      <div class="wrapper">
        <div class="title">{{ toast.title.toUpperCase() }}</div>
        <div class="content">{{ toast.content }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  toasts: {
    type: Array,
    default: () => [
      {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
      },
    ],
  },
});
</script>

<style>
.toast-container {
  width: 22em;
  position: absolute;
  top: 0.75em;
  right: 0.75em;
  z-index: 10;
}
.toast {
  background-color: #ffffff;
  border-radius: 5px;
  text-align: left;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  justify-content: space-between;
  margin-bottom: 10px;
  box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
}
.title {
  font-weight: bold;
  font-size: 1.2em;
  padding: 0.5em 0.75em 0.25em 0.75em;
}
.content {
  padding: 0.5em 0.75em;
}
.wrapper {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
```

Ich ergänze auf Button “Show me the Toast” in `App.vue` noch die Methode `addOne` um einen Toast auszulösen und natürlich bau ich die neue Komponente auch in die Seite ein. Daraus ergibt sich dann folgendes Template:

```jsx
<template>
  <section class="main">
    <h1>Toasty-Vue Demo</h1>
    <p>Just click the Button to try it out 😃</p>
  </section>
  <section>
    <button class="primary" @click="addOne">Show me the Toast!</button>
  </section>
  <ToastyVue :toasts="toasts" />
</template>
```

Ein Testklick und wir sehen schon oben rechts folgendes Ergebnis:

![toasty-vue-die-basis-toast-karte.png](/article-imgs/toasty-vue-die-basis-toast-karte.png)

## Den Toast mit einem _emit_ wieder entfernen

Bis hierhin haben wir schon mal den Toast zur Anzeige gebracht. Da der gedachte User die Meldungen nicht bis in alle Ewigkeiten auf seinem Bildschirm haben möchte, müssen wir eine Möglichkeit schaffen, die Meldung zu schließen.

Da die Quelle der Meldung im Parent liegt, müssen wir im Child ein Event per emit abfeuern.

Ich ergänze hierzu in `ToastyVue.vue` ein Button mit einem `X` als SVG und ergänze ein @click-Methode die wiederum ein Event auslöst, auf das ich dann in App.vue reagieren kann. Da es mehrere aktive Toasts geben kann, schick ich als Payload die id mit, damit ich auch den richtigen Toast wieder entferne.

```jsx
<template>
  <div class="toast-container">
    <div v-for="toast in toasts" :key="toast.id" class="toast">
      <div class="wrapper">
        <div class="title">{{ toast.title.toUpperCase() }}</div>
        <div class="content">{{ toast.content }}</div>
      </div>
      <button class="close" @click="this.$emit('clear-one', toast.id)">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  toasts: {
    type: Array,
    default: () => [
      {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
      },
    ],
  },
});
</script>

<style>
.toast-container {
  width: 22em;
  position: absolute;
  top: 0.75em;
  right: 0.75em;
  z-index: 10;
}
.toast {
  background-color: #ffffff;
  border-radius: 5px;
  text-align: left;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  justify-content: space-between;
  margin-bottom: 10px;
  box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
}
button.close {
  background-color: transparent;
  align-self: flex-start;
  padding: 0.5em;
}
button.close > svg {
  stroke: #666666;
  width: 1.5em;
  height: 1.5em;
}
.title {
  font-weight: bold;
  font-size: 1.2em;
  padding: 0.5em 0.75em 0.25em 0.75em;
}
.content {
  padding: 0.5em 0.75em;
}
.wrapper {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
```

Damit das ganze auch tut was es soll, müssen wir natürlich im Parent auf das Event reagieren.

Also zurück in `App.vue` müssen wir zwei Sachen ergänzen:

1. Eine Funktion ergänzen, die eine `id` entgegen nimmt und das Element mit der entsprechenden `id` aus unserem `toasts`-Array rausschmeißt
2. Einen Event-Listener der auf den `emit` vom Event horcht und unsere Funktion mit dem Payload ausführt

Unsere `App.vue` schaut danach wie folgt aus:

```jsx
<template>
  <section class="main">
    <h1>Toasty-Vue Demo</h1>
    <p>Just click the Button to try it out 😃</p>
  </section>
  <section>
    <button class="primary" @click="addOne">Show me the Toast!</button>
  </section>
  <ToastyVue :toasts="toasts" @clear-one="clearOne" />
</template>

<script setup>
import { ref } from "vue";
import ToastyVue from "./components/ToastyVue.vue";
const toasts = ref([]);
function clearOne(id) {
  toasts.value = toasts.value.filter((item) => item.id !== id);
}
function addOne() {
  const fakeid = Date.now().toString();
  toasts.value.push({
    id: fakeid,
    title: "This is the Title",
    content: "This is the content",
  });
}
</script>

...
```

Die Grundlegende Funktionalität ist damit bereits fertig! Wenn wir jetzt den Button clicken, erscheint unser Toast und wenn wir das Kreuz in der Ecke anklicken, wird der Toast wieder geschlossen 😃

![toasty-vue-die-basis-toast-karte-mit-close.png](/article-imgs/toasty-vue-die-basis-toast-karte-mit-close.png)

## Es funktioniert, jetzt machen wir es noch geschmeidig

Mit Vue 3 kam auch der `watchEffect()` dazu. Damit kann einfach gesagt der Zustand einzelner Objekte überwacht werden. Sollte sich irgendwas am Zustand ändern, dann kann man selber darauf reagieren und zum Beispiel eigenen Code ausführen. Ich nutze `watchEffect()` in der ToastyVue-Komponente um das `prop` zu überwachen. Ich möchte nach einer Zeit von 5 Sekunden die Toasts wieder von selber schließen, ohne das man das `X` klicken muss.

Was mir ebenfalls noch nicht gefällt, ist das plötzliche erscheinen und verschwinden der Toasts. Hier möchte einen Effekt, der die Toasts von der Seite reinfährt und beim schließen auch wieder rausfährt.

On Top, fände ich es auch deutlich schöner wenn am Toast noch ein Icon vorne angezeigt würde.

Let’s do this!

## Mit watchEffect die props überwachen

Damit man den `watchEffect()` nutzen kann, muss man diesen zunächst oben in der Script Section importieren. Da ich zum entfernen eines Toasts auch hier einen Event feuern muss, muss ich zusätzlich auch noch den `emit` im script setup deklarieren.

Im `watchEffect()` überprüfe ich ob es Toasts gibt. Sobald ein Toast dazu kommt, soll ein Timer mit 5 Sekunden erzeugt werden, der dann die `id` von dem zuerst hinzugekommen Toast wieder zum löschen freigibt.

Unsere Script-Sektion in `ToastyVue.vue` schaut somit wie folgt aus:

```jsx
...
<script setup>
import { watchEffect } from "vue";
const emit = defineEmits(["clear-one"]);
const props = defineProps({
  toasts: {
    type: Array,
    default: () => [
      {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
      },
    ],
  },
});
watchEffect(() => {
  if (props.toasts.length > 0) {
    const addedItemId = props.toasts[0].id;
    setTimeout(() => {
      emit("clear-one", addedItemId);
    }, 50000);
  }
});
</script>
...
```

## Ein SVG in den Slot der Komponente laden

Den Slot haben wir ja bereits in `ToastyVue.vue` im Template drinnen, jetzt müssen wir diesen nur noch in `App.vue` beim Komponentenaufruf befüllen. Dazu muss lediglich der selfClosing-Tag in einen Open- und Closing-Tag abgeändert werden und dazwischen kommt dann das, was im Slot landen soll. Da es nur einen Slot in der Komponente gibt, landet das SVG damit automatisch an der richtigen Stelle in unserem Template. Easy AF!

```jsx
...
<ToastyVue :toasts="toasts" @clear-one="clearOne">
    <div class="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    </div>
  </ToastyVue>
...
```

## Wie man Elemente aus einem v-for Loop animieren kann

Da ich per `v-for` über die Toasts aus dem prop drüber loope, muss ich für die Animation der einzelnen Toasts die `TransitionGroup` von Vue verwenden. Die Standard-`Transition` von Vue kann nur von einzelnen fixen Elementen verwendet werden.

Durch die Nutzung von `TransitionGroup`, können wir in unserem CSS ein paar Anweisungen ergänzen und damit das Verhalten in 4 verschiedenen Phasen steuern:

- `enter-from`: Der Startzustand
- `enter-active`: Der Weg zum aktiven Zustand
- `leave-active`: Der Weg zum End-Zustand
- `leave-to`: Der End-Zustand

```jsx
// TranisitionGroup um das v-for herum
<template>
  <div class="toast-container">
    <TransitionGroup name="toastlist" tag="div">
      <div v-for="toast in toasts" :key="toast.id" class="toast">
        ...
      </div>
    </TransitionGroup>
  </div>
</template>

// Die Animationsanweisungen im CSS:
.toastlist-enter-from {
  opacity: 50%;
  transform: translateX(22em);
}
.toastlist-enter-active {
  transition: all 0.3s cubic-bezier(0.5, 1.5, 1, 1);
}
.toastlist-leave-active {
  transition: all 0.3s cubic-bezier(0.88, -0.33, 1, 1);
}
.toastlist-leave-to {
  opacity: 0;
  transform: translateX(22em);
}
```

## Round-Up - die finalen Files

Wenn wir nun alles bisherige in einen Topf werfen, dann kommen wir auf folgenden File Zustand:

```jsx
// App.vue
<template>
  <section class="main">
    <h1>Toasty-Vue Demo</h1>
    <p>Just click the Button to try it out 😃</p>
  </section>
  <section>
    <button class="primary" @click="addOne">Show me the Toast!</button>
  </section>
  <ToastyVue :toasts="toasts" @clear-one="clearOne">
    <div class="icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    </div>
  </ToastyVue>
</template>

<script setup>
import { ref } from "vue";
import ToastyVue from "./components/ToastyVue.vue";
const toasts = ref([]);
function clearOne(id) {
  toasts.value = toasts.value.filter((item) => item.id !== id);
}
function addOne() {
  const fakeid = Date.now().toString();
  toasts.value.push({
    id: fakeid,
    title: "This is the Title",
    content: "This is the content",
  });
}
</script>

<style>
body {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Helvetica, Arial, sans-serif;
  background-color: #f7f7f7;
  color: #222222;
}
h1 {
  font-size: 2em;
}
button {
  cursor: pointer;
  border: none;
  border-radius: 5px;
  padding: 0.5em 1em;
}
button.primary {
  background-color: #d78407;
  color: #ffffff;
  font-size: 1.5em;
  font-weight: bold;
}
button.primary:hover {
  background-color: #e6951d;
}
</style>
```

```jsx
// ToastyVue.vue
<template>
  <div class="toast-container">
    <TransitionGroup name="toastlist" tag="div">
      <div v-for="toast in toasts" :key="toast.id" class="toast">
        <slot></slot>
        <div class="wrapper">
          <div class="title">{{ toast.title.toUpperCase() }}</div>
          <div class="content">{{ toast.content }}</div>
        </div>
        <button class="close" @click="this.$emit('clear-one', toast.id)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { watchEffect } from "vue";
const emit = defineEmits(["clear-one"]);
const props = defineProps({
  toasts: {
    type: Array,
    default: () => [
      {
        title: {
          type: String,
        },
        content: {
          type: String,
        },
      },
    ],
  },
});
watchEffect(() => {
  if (props.toasts.length > 0) {
    const addedItemId = props.toasts[0].id;
    setTimeout(() => {
      emit("clear-one", addedItemId);
    }, 5000);
  }
});
</script>

<style>
.toast-container {
  width: 22em;
  position: absolute;
  top: 0.75em;
  right: 0.75em;
  z-index: 10;
}
.toast {
  background-color: #ffffff;
  border-radius: 5px;
  text-align: left;
  display: flex;
  align-items: stretch;
  overflow: hidden;
  justify-content: space-between;
  margin-bottom: 10px;
  box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
  -webkit-box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 0 8px 17px rgba(0, 0, 0, 0.2);
}
.icon {
  width: 3em;
  display: flex;
  background-color: #d78407;
  align-items: center;
  justify-content: center;
}
.icon > svg {
  stroke: #ffffff;
  width: 1.5em;
  height: 1.5em;
}
button.close {
  background-color: transparent;
  align-self: flex-start;
  padding: 0.5em;
}
button.close > svg {
  stroke: #666666;
  width: 1.5em;
  height: 1.5em;
}
.title {
  font-weight: bold;
  font-size: 1.2em;
  padding: 0.5em 0.75em 0.25em 0.75em;
}
.content {
  padding: 0.5em 0.75em;
}
.wrapper {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.toastlist-enter-from {
  opacity: 50%;
  transform: translateX(22em);
}
.toastlist-enter-active {
  transition: all 0.3s cubic-bezier(0.5, 1.5, 1, 1);
}
.toastlist-leave-active {
  transition: all 0.3s cubic-bezier(0.88, -0.33, 1, 1);
}
.toastlist-leave-to {
  opacity: 0;
  transform: translateX(22em);
}
</style>
```

Das alles führt uns zu folgenden Ergebnis:

![demo-toast.gif](/article-imgs/demo-toast.gif)

### Danke fürs lesen =)

Ich hoffe ich konnte dir mit diesem Beitrag bei einem deiner Projekte helfen, oder zumindest ein wenig Inspiration geben, wie man eine Toast-Komponente mit Vue 3 selber bauen kann 😃
