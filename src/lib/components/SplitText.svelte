<script lang="ts">
  interface Props {
    text?: string;
    elements?: any;
    class?: string;
  }

  let { text = "", elements = $bindable(Array<HTMLSpanElement>(text.length)), class: className = "" }: Props = $props();
  
</script>

{#each text.split("") as c, i}
  <span class={className} bind:this={elements[i]}>{c}</span>
{/each}
