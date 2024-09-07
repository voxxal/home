<script lang="ts">
  const { tag }: { tag: string } = $props();
  let color = $state("");
  $effect(() => {
    // prettier-ignore
    switch (tag) {
      // Technology & Brand Tags
      case "tailwind": color = "#06B6D4"; break;
      case "svelte": color = "#FF3E00"; break;
      case "next.js":
      case "three.js":
         color = "#000000"; 
         break;
      case "figma": color = "#F24E1E"; break;
      case "elm": color = "#1293D8"; break;
      case "postgresql": color = "#4169E1"; break;
      case "rust": color = "#CE422B"; break;
      
    }
  });
</script>

<div class="tag" style="--color: {color}">{tag}</div>

<style>
  .tag {
    background-color: color-mix(in oklch, var(--color), rgba(0 0 0 / 0) 60%);
    color: color-contrast(var(--color) vs #fff, #000);
    font-family: var(--font-mono-display);
    padding: 0.25rem 0.4rem;
    line-height: 1;
    border-radius: var(--radius-half);
  }
</style>
