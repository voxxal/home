<script lang="ts">
  import { onMount } from "svelte";

  import SplitText from "$lib/components/SplitText.svelte";

  let elements: HTMLSpanElement[] | undefined = $state();
  onMount(() => {
    elements?.[0]?.classList.add("pl-1");
  });
</script>

<div class="px-12 pt-28">
  <header>
    <h1 class="overflow-hidden font-medium text-7xl">
      <SplitText class="inline-block opacity-0 titleChar bubbled-lg from-emerald-600 to-60% pb-2" text="garden" bind:elements />
    </h1>
    <h2 class="text-2xl font-medium" id="subtitle">tending to the crops</h2>
  </header>
  <hr class="my-4 border-zinc-600/75" />
</div>
