<script lang="ts">
  import { createState, Re } from "$lib/regex";
  import FiniteAutomata from "./FiniteAutomata.svelte";

  const { regex: defaultRegex } = $props<{ regex?: string }>();
  let regex = $state(defaultRegex);
  let testString = $state("");
  let tick = $state(0);
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

  const { matched, traversal } = $derived.by(() => {
    const matched = re?.matchNfa(testString);
    const traversal = re?.prevTraversal || [];
    return { matched, traversal };
  });
  $effect(() => {
    tick = Math.min(tick, traversal.length);
  })

</script>

<input bind:value={testString} class="text-black {matched ? 'text-green-800' : ''}" />

<FiniteAutomata nfa={re?.nfa ?? createState(0)} traversalTick={traversal[tick]} />
<input bind:value={tick} type="range" min={0} max={traversal.length - 1}/>
<input bind:value={regex} class="text-black" />
{#if err}
  {err}
{/if}

<style>
</style>
