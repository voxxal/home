<script lang="ts">
  import "$lib/prism.css";
  import { Calendar, Clock } from "lucide-svelte";
  let { data } = $props();
</script>

<svelte:head><title>Aiden Shi | {data.title}</title></svelte:head>

{#if data.layout === "full" || data.layout === "header"}
  <header class="header">
    <h1 class="heading">
      {data.title}
    </h1>

    <div class="metadata">
      <Calendar class="inline-icon" />
      <span>{data.published}</span>
      <div class="metadata-divider"></div>
      <Clock class="inline-icon" />
      <span>{data.readingTime.toFixed(0)} min</span>
    </div>
    <div class="divider"></div>
  </header>
{/if}

{#if data.layout === "full"}
  <article class="prose">
    <data.content />
  </article>
{:else}
  <data.content />
{/if}

<style>
  .header {
    width: 65ch;
    margin: auto;
    margin-top: var(--navbar-offset);
  }

  .heading {
    font-size: 4rem;
    font-family: var(--font-display);
    color: var(--text-xem);
    line-height: 1.1;
    text-wrap: balance;
    margin-bottom: 0.5rem;
  }

  .metadata {
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .metadata-divider {
    background: var(--text-tertiary);
    height: 0.25rem;
    width: 0.25rem;
    margin: 0 0.25rem;
    border-radius: 100%;
  }

  :global(.inline-icon) {
    display: inline;
    height: 1rem;
    width: 1rem;
  }

  .metadata span {
    font-weight: 500;
  }
</style>
