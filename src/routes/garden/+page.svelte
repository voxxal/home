<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { slideInConf } from "$lib//util";
  import "$lib/app.css";

  import Body from "$lib/components/Body.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import SplitText from "$lib/components/SplitText.svelte";
  let elements: HTMLSpanElement[] | undefined;
  onMount(() => {
    elements?.[0]?.classList.add("ml-1")
    const tl = gsap.timeline();
    tl.from(".titleChar", slideInConf).from("#subtitle", {
      duration: 1,
      yPercent: 100,
      opacity: 0,
      ease: "Power4.easeOut",
    }, "-=0.5");
  });
</script>

<Body>
  <Navbar glowColor="from-emerald-800" />
  <main class="px-12 mt-4">
    <header>
      <h1 class="text-7xl font-medium bubbled-lg from-emerald-600 to-60% pb-2 overflow-hidden">
        <SplitText class="inline-block titleChar" text="garden" bind:elements />
      </h1>
      <h2 class="text-2xl font-medium" id="subtitle">tending to the crops</h2>
    </header>
    <hr class="my-4 border-zinc-600/75" />
  </main>
</Body>
