<script lang="ts">

  import "$lib/prism.css";
  let { data } = $props();

</script>

<svelte:head><title>Aiden Shi | {data.title}</title></svelte:head>

{#if data.defaultLayout}
  <header class="header">
    <h1 class="heading">
      {data.title}
    </h1>

    <!-- TODO get reading time in here one day -->
    <h3 class="metadata"><span>Published: </span>{data.published}</h3>
    <div class="divider"></div>
  </header>
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
    color: var(--text-em);
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

  .metadata span {
    font-weight: 500;
  }
</style>
