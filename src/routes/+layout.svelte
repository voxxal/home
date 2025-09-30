<script lang="ts">
  import "$lib/app.css";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
  let scrollbarWidth = $state(0);
  $effect(() => {
    const setSBW = () =>
      (scrollbarWidth = window.innerWidth - document.documentElement.clientWidth);
    window.addEventListener("resize", setSBW, false);
    setSBW();
  });
</script>

<div class="page-wrapper" style="--scrollbar-width: {scrollbarWidth}px;">
  <div class="grain"></div>
  <Navbar />
  <main>
    {@render children?.()}
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

  .grain {
    background-image: url(/noise.png);
    content: "";
    height: 100%;
    left: 0;
    opacity: 0.1;
    pointer-events: none;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
  }
  
  main {
    flex-grow: 1;
    @media (width < 40rem) {
      padding: 0 1.5rem;
    }
    padding-bottom: 4rem;
  }
</style>
