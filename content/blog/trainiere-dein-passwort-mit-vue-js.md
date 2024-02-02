---
title: PW-Trainer - Trainiere dein Passwort mit Vue.js
description: "In diesem Beitrag baue ich eine kleine App mit der du dein neues Passwort üben kannst."
img: /article-imgs/trainiere-dein-passwort-mit-vue-js.jpg
tags: ["komponenten", "apps"]
createdAt: "2022-03-09T16:23:09.092Z"
updatedAt: "2022-03-09T16:23:09.092Z"
---

Hier kannst Du den Password Trainer direkt live ausprobieren! Am besten fügst Du diesen Blogeintrag zu deinen Lesezeichen hinzu, dann kannst du bei jedem Passwortwechsel zum trainieren vorbei schauen 😉

<the-password-trainer></the-password-trainer>

<div style="margin-bottom: 20px;">&nbsp;</div>

## Behind the Scenes

Die Idee zu dem Passwort-Trainer ist, dass man sein neues Passwort in das Finger-Muskel-Gedächtnis hinein trainiert, bis man es quasi im Schlaf runter tippen kann. Die Zutaten dafür sind im Grunde relativ überschaubar:

- ein Eingabefeld für das Passwort was trainiert werden soll
- ein Start-Button
- ein Kachelansicht um die Eingaben auszuwerten
- ein Eingabefeld in das man seine Übungsversuche eingibt
- eine Übersicht der korrekten und fehlerhaften Versuche
- einen Button zum zurücksetzen

Für dieses Projekt werde ich Tailwind CSS für das finale Styling benutzen, allerdings werden die Code-Auszüge in diesem Beitrag keinerlei Styling-Infos enthalten, damit das jeder nach seinem eigenen belieben ausschmücken kann.

## Der Quellcode

Die Code den du hier im Beitrag siehst, basiert auf der Options-API. Das selbe Projekt mit vue 3 und der Composition-API findest du zusätzlich hier auf github:

> [PW-Trainer auf github (vue 3 + composition API)](https://github.com/gue-codes/pw-trainer)

## Der Aufbau der App

Die ganze Spiellogik findet innerhalb einer SingleFile-Komponente statt. Hierzu hab ich in meinem Komponenten-Ordner ein neues File angelegt. Alles an Code wird in diesem File landen.

Ich erzeuge zunächst mal die Datenfelder, die ich für App benötige:

```html
<script>
  export default {
    data() {
      return {
        // Die Eingabedaten
        password: "",
        passwordGuess: "",

        // Hilfvariable für die Spieldynamik
        finalGuess: "",

        // Die Spielstatistiken
        round: 0,
        correctGuesses: 0,
        incorrectGuesses: 0,

        // Die Spielzustandssteuerung
        editing: true,
        glimpse: false,
      };
    },
  };
</script>
```

Als nächstes lege ich die benötigten `computed` Properties an:

```html
<script>
  export default {
    data() { ... },
  	computed: {
  	    // Beide Properties erzeugen ein Array, in dem alle eingegebenen
  	    // Zeichen einzeln abgelegt werden. Das ist nötig, um
  	    // bei der Überprüfung Feedback geben zu können, wo man
  	    // eine korrekte Eingabe gemacht hat, oder auch nicht.
  	    pwSpread() {
  	      return this.password.split('')
  	    },
  	    guessSpread() {
  	      return this.passwordGuess.split('')
  	    },
  	  },
  }
</script>
```

Jetzt kommen noch ein paar `methods` Properties hinzu, die sich um den Spielzustand und die Spielauswertung kümmern sollen:

```html
<script>
  export default {
    data() {},
    computed: {},
    methods: {
      // Diese Funktion toggelt den Spielmodus
      switchEditMode() {
        this.editing = !this.editing;
      },
      // Wenn man fertig mit dem erraten des Passworts ist,
      // dann findet hier in der Funktion die Überprüfung statt.
      checkGuess() {
        // Die Eingabefelder sollen während dem Raten nicht sichtbar sein.
        // Erst wenn man seine Eingabe abgibt, soll für zwei Sekunden
        // die Auswertung sichtbar sein. Die Sichtbarkeit steuer ich
        // mit "glimpse"
        this.glimpse = true;
        // Kleine Hilfsübertragung, damit die Auswertung optisch
        // ein wenig runder läuft. Sonst währen die Felder schon
        // rot, auch wenn man noch nichts eingeben hat.
        this.passwordGuess = this.finalGuess;
        // Spielrundenzähler
        this.round++;
        if (this.passwordGuess === this.password) {
          // richtiger Versuchszähler wird hochgezählt
          this.correctGuesses++;
        } else {
          // fehlerhafter Versuchszähler wird hochgezählt
          this.incorrectGuesses++;
        }
        // Die Ausweruntung des Eingabeversuchs soll für zwei Sekunden
        // sichtbar sein und anschließend soll direkt ein neuer
        // Eingabeversuchgestartet werden. Dazu müssen ein paar
        // Werte zurückgesetzt werden.
        setTimeout(() => {
          this.passwordGuess = "";
          this.finalGuess = "";
          this.glimpse = false;
        }, 2000);
      },
      // Diese Funktionien evaluiert den übergeben Index
      // mit dem Passwort und der Trainingseingabe und liefert
      // einen String zurück, den ich dynamisch an eine
      // Klasse binde (:class="...")
      addCheckClass(index) {
        if (this.guessSpread.length > 0) {
          return this.pwSpread[index] === this.guessSpread[index]
            ? "bg-teal-500"
            : "bg-red-500";
        } else {
          return "";
        }
      },
      // Beendet die komplette Versuchsrunde und ermöglicht
      // es ein neues Passwort zum Trainieren einzugeben.
      resetGame() {
        this.editing = true;
        this.round = 0;
        this.correctGuesses = 0;
        this.incorrectGuesses = 0;
      },
    },
  };
</script>
```

Nun müssen wir “nur noch” alles sinnvoll in das `template` einbauen und dann sind wir auch schon fertig - als zumindest ohne Styling, das muss man noch nach eigenem Geschmack ergänzen =)

```html
<template>
  <div>
    <input
      v-model="password"
      :type="editing ? 'text' : 'password'"
      placeholder="Passwort eingeben"
      :disabled="editing === false"
    />
    <button
      v-if="editing === true && password.length > 3"
      @click="switchEditMode"
    >
      Starte Training
    </button>
    <button v-if="editing === false" @click="resetGame">Beende Training</button>
    <div v-if="editing === false">
      <div
        v-for="(char, index) in pwSpread"
        :key="`char-${index}`"
        :class="addCheckClass(index)"
      >
        {{ glimpse === true ? char : '•' }}
      </div>
    </div>
    <div v-if="editing === false">
      <p>Trage hier dein Versuch ein und drück ENTER</p>
      <input
        v-model="finalGuess"
        :type="glimpse === false ? 'password' : 'text'"
        placeholder="Hier tippen"
        autofocus
        @keyup.enter="checkGuess"
      />
      <div>
        <div>Statistiken</div>
        <p>
          <span>Runden</span>
          <span>{{ round }}</span>
        </p>
        <p>
          <span>Richtig</span>
          <span>{{ correctGuesses }}</span>
        </p>
        <p>
          <span>Falsch</span>
          <span>{{ incorrectGuesses }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
```
