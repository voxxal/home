<script>
  import { fade } from "svelte/transition";
  import Navbar from "$lib/components/Navbar.svelte";
  import state from "$lib/state";
  export let data;
</script>

<div class="min-w-full min-h-screen font-serif text-white selection:bg-navy/50">
  <Navbar glowColor={$state.navbarColor} />
  {#key data.pathname}
    <div in:fade={{ duration: 75, delay: 75 }} out:fade={{ duration: 75 }}>
      <main>
        <slot />
      </main>
    </div>
  {/key}
  <div class="bg-[url(/noise.png)] h-full w-full fixed top-0 left-0 opacity-5 -z-50"/>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.blot);
    width: 100%;
  }
</style>
