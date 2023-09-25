<template>
  <div v-once class="p-6 text-gray-600">
    <p class="mb-6 text-gray-600">
      Verantwortliche Stelle im Sinne der Datenschutzrichtlinie, insbesondere
      der EU-Datenschutzgrundverordnung (DSGVO), ist:
      <br />
      <br />
      Tomisha<br />
      Thomas Hungerbühler<br />
      Brühlbergstrasse 11<br />
      8400 Winterthur<br />
      E-Mail: info@tomisha.com<br />
      WEBSEITE: http://www.tomisha.com
      <br />
      <br />
      Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder
      anderen Dateien auf der WEBSEITE, gehören ausschliesslich dem Betreiber
      dieser WEBSEITE oder den speziell genannten Rechteinhabern. Für die
      Reproduktion von sämtlichen Dateien, ist die schriftliche Zustimmung des
      Urheberrechtsträgers im Voraus einzuholen.
      <br />
      <br />
      Wer ohne Einwilligung des jeweiligen Rechteinhabers eine
      Urheberrechtsverletzung begeht, kann sich strafbar und allenfalls
      schadenersatzpflichtig machen.
    </p>

    <section class="mb-6">
      <h2 class="text-gray-700 text-center text-3xl mb-2">Änderungen</h2>

      <p>
        Wir können diese Datenschutzerklärung jederzeit ohne Vorankündigung
        anpassen. Es gilt die jeweils aktuelle, auf unserer WEBSEITE publizierte
        Fassung. Soweit die Datenschutzerklärung Teil einer Vereinbarung mit
        Ihnen ist, werden wir Sie im Falle einer Aktualisierung über die
        Änderung per E-Mail oder auf andere geeignete Weise informieren.
      </p>
    </section>

    <section class="mb-6">
      <h2 class="text-gray-700 text-center text-3xl mb-2">
        Fragen an den Datenschutzbeauftragten
      </h2>

      <p>
        Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine
        E-Mail oder wenden Sie sich direkt an die für den Datenschutz zu Beginn
        der Datenschutzerklärung aufgeführten, verantwortlichen Person in
        unserer Organisation.
      </p>
    </section>

    <div class="text-sm text-gray-400">Winterthur, 22. Januar 2020</div>
  </div>
</template>

<script>
export default {
  auth: false,
  layout: 'policy',
  head: {
    title: 'Urheberrechtsrichtlinie',
  },
}
</script>
