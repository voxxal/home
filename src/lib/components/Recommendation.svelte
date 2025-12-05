<script lang="ts">
  import type { RecommendationMetadata } from "$lib/data/recommendations";
  import type { Snippet } from "svelte";
  interface Props extends RecommendationMetadata {
    children: Snippet;
  }
  const { children, rating, name, artist, medium, img }: Props = $props();
</script>

<div class="recommendation">
  <button>
    <img src={img} alt="{name} image" />
  </button>
  <div class="tooltip">
    <h2>
    {#if rating === "highly"}<span class="highly">Highly</span>{/if} Recommend
    <span class="rec-name">{name}</span>
    </h2>
    <h3>{medium} by <span class="rec-artist">{artist}</span></h3>
  </div>
</div>
<style>
  .recommendation {
    button img {
      border: 1px solid var(--surface-300);
      border-radius: var(--radius-half);
    }

    button:hover + .tooltip {
      opacity: 1;
      margin-top: 0.25rem;
    }

    .tooltip {
      user-select: none;
      margin-top: 0;
      padding: 0.5rem;
      opacity: 0;
      transition: 300ms;
      position: absolute;
      max-width: 24rem;
      background: var(--surface-200);
      border-radius: var(--radius-half);
    }
    
    h2 {
      font-size: 1.5rem;
      line-height: 1;
    }

    h3 {
      /* font-family: var(--font-display); */
      color: var(--text-tertiary);
      font-size: 1.1rem;
    }

    .highly {
      font-style: italic;
      font-family: var(--font-display);
      color: var(--text-em);
    }

    .rec-name {
      font-family: var(--font-display);
      color: var(--text-em);
    }

    .rec-artist {
      font-family: var(--font-display);
      color: var(--text-secondary);
    }

  }
</style>

<!--
<div class="recommendation">
  <h2>
    I {#if rating === "highly"}<span class="highly">Highly</span>{/if} Recommend
    <span class="rec-name">{name}</span>
  </h2>
  <h3>{medium} by <span class="rec-artist">{artist}</span></h3>
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
    font-weight: 700;
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
-->
