<script lang="ts">
  import "$lib/app.css";

  import FileDownload from "$lib/components/FileDownload.svelte";
</script>

<svelte:head><title>Aiden Shi | branding</title></svelte:head>

<header class="header">
  <h1 class="heading">Branding</h1>
  <div class="divider"></div>
</header>
<article class="prose">
  <p>
    Feel free to edit, change, remix, transform, or mutilate these logos and use them in any senario
    you want. Licenced under
    <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC BY-SA 4.0</a>.
  </p>
  <figure class="showcase" style="--showcase-background: var(--surface-200)">
    <img src="/branding/wordmark.svg" alt="wordmark" />
    <figcaption>
      Wordmark, Colored.
      <span class="not-italic">
        <FileDownload path="/branding/wordmark.svg">Download</FileDownload>
      </span>
    </figcaption>
  </figure>

  <figure class="showcase" style="--showcase-background: white">
    <img src="/branding/wordmark-grayscale.svg" alt="wordmark" />
    <figcaption>
      Wordmark, Grayscale.
      <span class="not-italic">
        <FileDownload path="/branding/wordmark-grayscale.svg">Download</FileDownload>
      </span>
    </figcaption>
  </figure>

  <figure class="showcase" style="--showcase-background: black">
    <img src="/branding/wordmark-grayscale-dark.svg" alt="wordmark" />
    <figcaption>
      Wordmark, Grayscale (Dark).
      <span class="not-italic">
        <FileDownload path="/branding/wordmark-grayscale-dark.svg">Download</FileDownload>
      </span>
    </figcaption>
  </figure>

  <figure>
    <img src="/branding/88x31.png" class="preserve-width _88x31" alt="88x31" />
    <figcaption>
      88x31.
      <span class="not-italic">
        <FileDownload path="/branding/88x31.svg">Download</FileDownload>
      </span>
    </figcaption>
  </figure>
</article>

<style>
  .header {
    width: 65ch;
    margin: auto;
    margin-top: var(--navbar-offset);
  }

  .heading {
    font-size: 4rem;
    font-family: var(--font-display);
    color: var(--text-em);
    line-height: 1;
    margin-bottom: 1rem;
  }

  .not-italic {
    font-style: normal;
  }

  figure {
    margin: 2rem 0;
  }

  .showcase img {
    padding: 2rem;

    border: 1px solid var(--surface-100);
    background: var(--showcase-background);
    border-radius: var(--radius-2);
  }

  ._88x31 {
    margin: 0;
    border: 1px solid var(--surface-100);
  }
</style>
