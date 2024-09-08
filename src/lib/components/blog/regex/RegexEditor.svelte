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

  const { matched, nfaHeads, ticks } = $derived.by(() => {
    const matched = re?.matchNfa(testString);
    const nfaHeads = re?.nfaHeads ?? [];
    return { matched, nfaHeads, ticks: re?.nfaTicks ?? -1 };
  });

  $effect(() => {
    tick = Math.min(tick, ticks);
  });
</script>

<input bind:value={testString} class="text-black {matched ? 'text-green-800' : ''}" />

<FiniteAutomata nfa={re?.nfa ?? createState(0)} {nfaHeads} {tick} str={testString} />
<input bind:value={tick} type="range" min={0} max={ticks - 1} />
<input bind:value={regex} class="text-black" />
{#if err}
  {err}
{/if}

<style>
</style>
