<script lang="ts">
  import state from "$lib/state";
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { slideInConf, slideInConfTo } from "$lib/util";
  import "$lib/app.css";

  import SplitText from "$lib/components/SplitText.svelte";
  import Third from "$lib/components/Third.svelte";

  $state.navbarColor = "from-dark-navy";
  onMount(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      "#heyIm",
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: "Power4.easeOut", duration: 1 }
    )
      .fromTo(".developerIn", slideInConf, slideInConfTo, "-=0.7")
      .fromTo(".designerIn", slideInConf, slideInConfTo, "-=0.7")
      .fromTo(".thirdIn", slideInConf, slideInConfTo, "-=0.7")
      .to("#unfinished", { opacity: 1 });
  });
</script>

<header>
  <h2 class="pb-2 text-5xl opacity-0" id="heyIm">
    hey, i'm <span class="bubbled-md from-navy to-60% px-1">aiden.</span>
  </h2>
  <h1 class="text-8xl font-medium bubbled-lg from-navy to-70% pb-4 overflow-hidden">
    <SplitText class="inline-block opacity-0 developerIn" text="developer," />
  </h1>
  <h1 class="text-8xl font-medium bubbled-lg from-navy to-70% pb-4 overflow-hidden">
    <SplitText class="inline-block opacity-0 designerIn" text="designer," />
  </h1>
  <Third />
  <p id="unfinished" class="max-w-3xl text-2xl opacity-0">
    This website is pretty unfinished. You are probably looking for my
    <a
      href="/garden/web-exploitation/sql-injection"
      class="text-blue-500 underline transition-colors hover:text-blue-400">
      one single garden entry right
    </a> now.
  </p>
</header>
