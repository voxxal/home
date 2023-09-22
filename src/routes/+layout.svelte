<script>
  import { fade } from "svelte/transition";
  import Navbar from "$lib/components/Navbar.svelte";
  import state from "$lib/state";
  export let data;
</script>

<div class="min-w-full min-h-screen font-serif text-white selection:bg-navy/50">
  <Navbar glowColor={$state.navbarColor} />
  {#key data.pathname}
    <div in:fade={{ duration: 150, delay: 150 }} out:fade={{ duration: 150 }}>
      <main>
        <slot />
      </main>
    </div>
  {/key}
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.blot);
    width: 100%;
  }
</style>
