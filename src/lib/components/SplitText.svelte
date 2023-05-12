<script lang="ts">
  export let text = "";
  export let elements = Array<HTMLSpanElement>(text.length);
  let className = "";
  export { className as class };
</script>

{#each text.split("") as c, i}
  <span class={className} bind:this={elements[i]}>{c}</span>
{/each}
