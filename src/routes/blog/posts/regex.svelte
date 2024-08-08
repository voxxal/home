<script context="module">
  export const metadata = {
    title: "how regex works",
    published: "2024-08-07",
  };
</script>

<script lang="ts">
  import FiniteAutomata from "$lib/components/FiniteAutomata.svelte";
  import { createState, Re } from "$lib/regex";

  const a = "c(ow|at)";
  const b = "a(bb)+a";
  const c = "plac(.*)holder";
  let regex = $state("cow");
  const { re, err } = $derived.by(() => {
    let re = null;
    let err = null;

    try {
      re = new Re(regex);
      (window as any).re = re;
    } catch (e) {
      err = e;
    }

    return { re, err };
  });
</script>

<FiniteAutomata nfa={re?.nfa ?? createState(0)} />
<input bind:value={regex} class="text-black" />
{#if err}
  {err}
{/if}
