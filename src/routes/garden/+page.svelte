<script lang="ts">
  import state from "$lib/state";
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { slideInConf, slideInConfTo } from "$lib/util";

  import SplitText from "$lib/components/SplitText.svelte";

  $state.navbarColor = "from-emerald-800";
  let elements: HTMLSpanElement[] | undefined;
  onMount(() => {
    elements?.[0]?.classList.add("pl-1");
    const tl = gsap.timeline();
    tl.fromTo(".titleChar", slideInConf, slideInConfTo).from(
      "#subtitle",
      {
        duration: 1,
        yPercent: 100,
        opacity: 0,
        ease: "Power4.easeOut",
      },
      "-=0.5"
    );
  });
</script>

<div class="px-12 pt-28">
  <header>
    <h1 class="overflow-hidden font-medium text-7xl">
      <SplitText class="inline-block opacity-0 titleChar bubbled-lg from-emerald-600 to-60% pb-2" text="garden" bind:elements />
    </h1>
    <h2 class="text-2xl font-medium" id="subtitle">tending to the crops</h2>
  </header>
  <hr class="my-4 border-zinc-600/75" />
</div>
