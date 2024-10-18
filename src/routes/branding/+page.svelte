<script lang="ts">
  import "$lib/app.css";
  // lea is so real for this
  import FileDownload from "$lib/components/FileDownload.svelte";
  const colorSpace = "hex";
  const colorCopy = (e: MouseEvent) => {
    if (!e.target) alert("failed to copy");
    navigator.clipboard.writeText(
      getComputedStyle(e.target as Element).getPropertyValue("background-color"),
    );
  };
</script>

<svelte:head><title>Aiden Shi | branding</title></svelte:head>

<header class="header">
  <h1 class="heading">Branding</h1>
  <div class="divider"></div>
</header>
<article class="prose">
  <h2>Logos</h2>
  <p>
    Feel free to edit, change, remix, transform, or mutilate these logos and use them in any senario
    you want. Licenced under
    <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC BY-SA 4.0</a>.
  </p>
  <div class="logos">
    <figure class="showcase" style="--showcase-background: var(--surface-200)">
      <img src="/branding/logo.svg" alt="wordmark" />
      <figcaption>
        Logo, Colored.
        <span class="not-italic">
          <FileDownload path="/branding/logo.svg">Download</FileDownload>
        </span>
      </figcaption>
    </figure>
    <figure class="showcase" style="--showcase-background: white">
      <img src="/branding/logo-grayscale.svg" alt="wordmark" />
      <figcaption>
        Logo, Grayscale.
        <span class="not-italic">
          <FileDownload path="/branding/logo-grayscale.svg">Download</FileDownload>
        </span>
      </figcaption>
    </figure>
  </div>
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

  <h2>Pallete</h2>
  <p>Click to copy.</p>
  <figure>
    <div class="pallete">
      {#each [100, 150, 200, 300, 400, 500, 600] as i}
        <button style="background-color: var(--surface-{i})" onclick={colorCopy}></button>
      {/each}
    </div>
    <figcaption>Surface colors.</figcaption>
  </figure>

  <figure>
    <div class="pallete">
      {#each { length: 7 } as _, i}
        <button style="background-color: var(--accent-{(i + 1) * 100})" onclick={colorCopy}>
        </button>
      {/each}
    </div>
    <figcaption>Accent colors.</figcaption>
  </figure>
  <figure>
    <div class="pallete">
      {#each ["primary", "secondary", "em", "link"] as i}
        <button style="background-color: var(--text-{i})" onclick={colorCopy}>
          {i}
        </button>
      {/each}
    </div>
    <figcaption>Text colors.</figcaption>
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

  .logos {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  ._88x31 {
    margin: 0;
    border: 1px solid var(--surface-100);
  }
  .pallete {
    display: flex;
    width: 100%;
    height: 8rem;
    border: 1px solid var(--surface-100);
    border-radius: var(--radius-2);
    isolation: isolate;
    background: var(--surface-100);

    & > button {
      flex: 1;
      transition: 150ms ease-out;
      color: black;
      font-family: var(--font-display);

      &:hover {
        scale: 1.05;
        z-index: 10;
      }

      &:active {
        scale: 0.95;
      }

      &:first-child {
        border-radius: var(--radius-2) 0 0 var(--radius-2);
      }

      &:last-child {
        border-radius: 0 var(--radius-2) var(--radius-2) 0;
      }
    }
  }
</style>
