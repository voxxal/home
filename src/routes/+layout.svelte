<script>
  import "$lib/app.css";
  import { fade } from "svelte/transition";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import state from "$lib/state";
  export let data;
</script>

<!-- <div class="min-w-full min-h-screen font-serif text-white selection:bg-navy/50">
  <Navbar glowColor={$state.navbarColor} />
  {#key data.pathname}
    <div in:fade={{ duration: 75, delay: 75 }} out:fade={{ duration: 75 }} class="h-[calc(100vh-7rem)]">
      <main class="h-full">
        <slot />
      </main>
    </div>
  {/key}
  <div class="bg-[url(/noise.png)] h-full w-full fixed top-0 left-0 opacity-5 -z-50"/>
</div> -->

<div class="page-wrapper">
  <Navbar />
  <main>
    <slot />
  </main>
  <Footer />
</div>

<style lang="postcss">
  .page-wrapper {
    min-width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex-grow: 1;
    padding-bottom: 4rem;
  }
</style>
