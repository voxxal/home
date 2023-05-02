<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { slideInConf } from "$lib/util";
  import "$lib/app.css";

  import Body from "$lib/components/Body.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import SplitText from "$lib/components/SplitText.svelte";
  import Third from "$lib/components/Third.svelte";

  onMount(() => {
    const tl = gsap.timeline();

    tl.from("#heyIm", { duration: 1, yPercent: 100, opacity: 0, ease: "Power4.easeOut" })
      .from(".developerIn", slideInConf, "-=0.7")
      .from(".designerIn", slideInConf, "-=0.7")
      .from(".thirdIn", slideInConf, "-=0.7");
  });
</script>

<Body>
  <Navbar />
  <main class="px-12 mt-4">
    <header>
      <h2 class="pb-2 text-5xl" id="heyIm">
        hey, i'm <span class="bubbled-md from-navy to-60% px-1">aiden.</span>
      </h2>
      <h1 class="text-8xl font-medium bubbled-lg from-navy to-70% pb-4 overflow-hidden">
        <SplitText class="inline-block developerIn" text="developer," />
      </h1>
      <h1 class="text-8xl font-medium bubbled-lg from-navy to-70% pb-4 overflow-hidden">
        <SplitText class="inline-block designerIn" text="designer," />
      </h1>
      <Third />
    </header>
  </main>
</Body>
