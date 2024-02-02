---
title: "Eine mobile App für iOS und Android mit NuxtIonic"
description: "Mit Nuxt 3 und NuxtIonic kann man auch eine mobile App für iOS und Android erstellen!"
img: /article-imgs/native-app-entwicklung-mit-nuxt-ionic.jpg
tags: ["nuxt", "apps"]
createdAt: "2023-01-08T13:10:37.151Z"
updatedAt: "2023-01-08T13:38:20.657Z"
---

## Von der Webentwicklung zur nativen App-Entwicklung mit NuxtIonic

Nuxt 3 ist ein großartiges Framework für Vue 3 und bietet für Entwickler ein breites Spektrum an Möglichkeiten. Eine dieser Möglichkeiten ist zum Beispiel die Entwicklung von mobilen Apps für iOS und Android, mit einer Codebase basierend auf Nuxt. Möglich wird das mit dem Nuxt-Modul [NuxtIonic](https://ionic.nuxtjs.org/).

### Installation

Damit wir das Modul NuxtIonic benutzen können, brauchen wir natürlich eine Nuxt-App und das Modul NuxtIonic:

```bash
# ein neues Nuxt-Projekt erzeugen
npx nuxi init PodNuxt
cd PodNuxt

# das Modul NuxtIonic installieren
npm install @nuxtjs/ionic -D
```

Als nächstes muss das Modul in der `nuxt.config.ts` registriert werden und wir deaktivieren in dem Zug auch gleich das ServerSide-Rendering:

```tsx
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxtjs/ionic"],
});
```

<aside>
💡 Ich muss die `app.vue` komplett löschen, da ich mit dem empfohlenen Template aus der NuxtIonic Dokumentation Fehlermeldungen erhalten habe. Das IonRouterOutlet hat Probleme verursacht. Aber das ist kein Problem. Einfach einen `pages`-Ordner anlegen und dort eine `index.vue` anlegen, das wird der Einstiegspunkt für die App.

</aside>

### Capacitor Unterstützung aktivieren

Für die Entwicklung von mobilen Apps - bzw. um JavaScript-basierende Apps auf einem Smartphone laufen zu lassen - nutzt Ionic die Runtime von [Capacitor](https://capacitorjs.com/). Capacitor zapft die nativen Geräte-APIs an, wie zum Beispiel Kamera, Bewegungssensoren und vieles mehr.

Mit unserem Modul NuxtIonic bekommen wir bereits die Capacitor Unterstützung mitgeliefert. Allerdings müssen wir Capacitor noch aktivieren, damit wir es nutzen können.

Dafür kann man sich entweder die `ionic/cli` installieren, oder einfach mit npx die Befehle direkt ausführen:

```bash
# capacitor aktivieren
npx @ionic/cli integrations enable capacitor
# ios unterstützung aktivieren
npx @ionic/cli capacitor add ios
# android unterstützung aktivieren
npx @ionic/cli capacitor add android
```

💡 Ich nutze das für VSCode verfügbare Ionic Plugin, was die Arbeit mit Capacitor sehr vereinfacht → [VSCode Ionic Plugin](https://marketplace.visualstudio.com/items?itemName=ionic.ionic).

Um die Ersteinrichtung abzuschließen, würde ich jetzt empfehlen einmal den folgenden Befehl auszuführen, da damit dann die `capacitor.config.ts` und `ionic.config.json` erzeugt werden:

```bash
npx nuxi generate
```

### Wichtige Anpassungen und Ergänzungen

Damit ihr die App zum Laufen bekommt, müsst ihr in der package.json noch die zwei Felder “name” und “version” ergänzen, sonst erhaltet ihr eine Fehlermeldung:

```json
{
	"name": "podnuxt",
	"version": "0.0.1"
	...
}
```

In der `capacitor.config.ts` müsst ihr ebenfalls Anpassungen vornehmen:

```tsx
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "codes.gue.podnuxt", // Umgedrehte Domainschreibweise + AppName
  appName: "podnuxt",
  webDir: "dist", // Hier landet mit npx nuxi generate der Code für die App
  bundledWebRuntime: false,
};

export default config;
```

Erzeugt einen `public`-Folder und legt dort ein `icon.png` ab. Wenn dieses File nicht existiert, meckert der Android Simulator.

### Die Einstiegsseite der App

Wir haben vorher die `index.vue` im `pages`-Ordner angelegt. Dort packe ich jetzt den folgenden Inhalt rein, den ich mir aus der [Vue-Dokumentation](https://ionicframework.com/docs/vue/quickstart) rauskopiert habe;

```jsx
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>Ready to create an app?</strong>
        <p>
          Start with Ionic
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://ionicframework.com/docs/components"
            >UI Components</a
          >
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
```

Dank NuxtIonic können wir uns den Script-Abschnitt aus der Dokumentation komplett sparen, da wir hier von AutoImports profitieren 🥳

Jetzt nur noch folgenden Befehl im Terminal ausführen und schon haben wir eine laufende App:

```jsx
npm run ionic:serve
```

Wie gewohnt könnt ihr die App im Browser unter localhost:3000 betrachten!

### Wie man die App in Simulatoren ausführen kann

Damit man die App auch auf mobilen Geräten betrachten/testen kann, benötigt man für Android das Programm Android Studio und für iOS benötigt man XCode. Der Wermutstropfen → Beide Programme benötigen relativ viel GB an Festplattenspeicher leider 😕

<aside>
💡 Apps für iOS kann man nur auf Apple-Geräten erzeugen/kompilieren lassen.
</aside>

Für die Apple-Nutzer, die ihre App auch für iOS bauen und testen wollen, empfehle ich vorab XCode einmal direkt zu starten und das Ganze mit einem Apple-Developer Account einzurichten.

Auch bei Android Studio würde ich das Programm einmal starten und in den Virtual Device Manager reingehen und die gewünschten Geräte runterladen und installieren.

**Anschließend ist der Ablauf wie folgt:**

1. `npx nuxi generate` Ausführen
2. im ionic Plugin unter “Capacitor” auf `Sync` klicken
3. im ionic Plugin unter “Run” die gewünschte Zielplattform anklicken

![vscode-ionic-plugin.png](/article-imgs/vscode-ionic-plugin.png)

VSCode wird euch 1-2 Eingabeaufforderungen anzeigen. Dort wählt ihr einfach das gewünschte aus (In meinem Fall die lokale IP über die die App auch im Netzwerk aufgerufen werden kann, sowie das gewünschte virtuelle Gerät).

<aside>
💡 Mir passiert es manchmal, das eine Fehlermeldung auftaucht und die App nicht gestartet werden kann. Meisten liegt es daran, das im `dist`-Ordner eine `index.html` fehlt. Hier nochmal `npx nuxi generate` ausführen und danach nochmal beim gewünschten Gerät auf Play drücken.
</aside>

Nun sollte ihr einen Simulator laufen haben, der euch eure App anzeigt:

![nuxt-ionic-vorschau-in-virtuellen-geraeten.jpg](/article-imgs/nuxt-ionic-vorschau-in-virtuellen-geraeten.jpg)

Ich empfehle ab hier die [Ionic-Dokumentation](https://ionicframework.com/docs/vue/overview) für die die verschiedenen UI-Komponenten und Geräte-API-Anbindungen. Viel Spaß bei der nativen App-Enwicklung mit Nuxt 3 für iOS und Android 😎

### Der Code auf github

Ihr findet das gezeigte Beispiel auch in diesem Github-Repo:

https://github.com/gue-codes/nuxt-3-ionic-example
