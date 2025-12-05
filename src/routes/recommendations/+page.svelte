<script lang="ts">
  import Recommendation from "$lib/components/Recommendation.svelte";

  const { data } = $props();
  const recommendations = data.recommendations;
  $inspect(recommendations);
</script>

<svelte:head><title>Aiden Shi | media recommendations</title></svelte:head>

<header class="page-header">
  <h1 class="page-heading">Media Recommendations</h1>
  <p class="prose">Recommendations to media I like. No particular order.</p>
  <div class="divider"></div>
</header>
<article class="recommendations">
  {#each recommendations as rec}
    <Recommendation {...rec}>
      {@html rec.html}
    </Recommendation>
  {/each}
</article>

<style>
  .recommendations {
    width: 40rem;
    margin: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 0.5rem;
  }

  .fav-track {
    color: var(--text-secondary);
    font-style: italic;

    span {
      font-weight: 600;
    }
  }
</style>
