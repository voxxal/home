<script>
  export let shown = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<p class="{shown ? '' : 'blur-md cursor-pointer'} transition-all" on:click={() => (shown = true)}>
  <slot />
</p>
