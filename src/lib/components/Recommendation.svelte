<script lang="ts">
  import type { Snippet } from "svelte";
  interface Props {
    children: Snippet;
    highly?: boolean;
    name: string;
    medium: "album" | "song" | "game" | "manga" | "tv show" | "book" | "thing";
    artist: string;
    img: string;
  }

  const { children, highly = false, name, artist, medium, img }: Props = $props();
</script>

<div class="recommendation">
  <h2>
    I {#if highly}<span class="highly">Highly</span>{/if} Recommend
    <span class="rec-name">{name}</span>
  </h2>
  <h3>{medium} by <span class="rec-artist">{artist}</span></h3>
  <!-- TODO: dont call it cover art always -->
  <img src={img} alt="{name} cover art" /> 
  <div class="prose clear-end">
    {@render children()}
  </div>
</div>

<style>
  .recommendation {
    margin: 2rem 0;
  }

  .recommendation h2 {
    font-size: 1.5rem;
    line-height: 1;
  }

  .recommendation h3 {
    /* font-family: var(--font-display); */
    color: var(--text-tertiary);
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .recommendation img {
    float: left;
    width: 10rem;
    margin-right: 0.5rem;
    border: 1px solid var(--surface-300);
    border-radius: var(--radius-half);
  }

  .highly {
    font-style: italic;
    font-family: var(--font-display);
    color: var(--text-em);
  }

  .rec-name {
    font-weight: bold;
    font-family: var(--font-display);
    color: var(--text-em);
  }

  .rec-artist {
    font-family: var(--font-display);
    color: var(--text-secondary);
  }

  /* https://stackoverflow.com/questions/16568272/ -- Fascinating! */
  .clear-end:after {
    content: "";
    clear: both;
    display: block;
  }
</style>
