<script lang="ts">
  export let data;
  
  import state from "$lib/state";
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { slideInConf, slideInConfTo } from "$lib/util";
  import "$lib/app.css";

  import SplitText from "$lib/components/SplitText.svelte";
    import BumpLink from "$lib/components/BumpLink.svelte";

  $state.navbarColor = "from-purple-800";
  let elements: HTMLSpanElement[] | undefined;
  onMount(() => {
    elements?.[0]?.classList.add("ml-1");
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
<svelte:head><title>voxal | blog</title></svelte:head>

<div class="px-12 pt-28">
  <header>
    <h1 class="overflow-hidden font-medium text-7xl">
      <SplitText class="inline-block opacity-0 titleChar bubbled-lg from-purple-600 to-60% pb-2" text="blog" bind:elements />
    </h1>
    <h2 class="text-2xl font-medium" id="subtitle">ramblings of a lunatic</h2>
  </header>
  <hr class="my-4 border-zinc-600/75" />
  <div class="flex flex-col gap-4">
    {#each data.posts as post} 
      <BumpLink href="/blog/{post.path}" class="text-8xl bubbled-lg from-purple-600 to-0% hover:to-70%">{post.title}</BumpLink>
    {/each}
  </div>
</div>
