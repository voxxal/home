<script lang="ts">
  import state from "$lib/state";
  import "$lib/app.css";
  import SplitText from "$lib/components/SplitText.svelte";
  import { useLanyard } from "svelte-lanyard";
  import { slideInConf, slideInConfTo } from "$lib/util";
  import { onMount } from "svelte";
  import gsap from "gsap";
  $state.navbarColor = "from-dark-navy";
  const discord = useLanyard("290952090560364545");

  let elements: HTMLSpanElement[] | undefined;
  onMount(() => {
    elements?.[0]?.classList.add("pl-1");
    elements?.[elements.length-1]?.classList.add("pr-1");

    const tl = gsap.timeline();
    tl.fromTo(".titleChar", slideInConf, slideInConfTo);
  });
</script>

<svelte:head><title>voxal | home</title></svelte:head>

<section class="flex items-center justify-center h-screen">
  <div class="max-w-[50ch]">
    <h1 class="overflow-hidden text-6xl font-medium">
      <SplitText
        class="inline-block opacity-0 titleChar bubbled-lg from-navy to-60% pb-2 whitespace-pre"
        text="aiden shi"
        bind:elements
      />
    </h1>
    <p class="mb-2">hey, welcome to my humble abode.</p>
    <p class="mb-2">
      I develop an assortment of things and also design websites. I also play CTFs with
      <a href="https://amateurs.team" class="underline">les amateurs</a> and build robots with
      <a href="https://3fault.com" class="underline">triple fault</a>.
    </p>
    <p class="mb-2">
      I'm also a firm believer in interactive articles being one of the best ways to learn, and
      you'll find some in the <a href="/garden" class="underline">garden</a> in the coming months.
    </p>
    <p>
      {#if $discord?.spotify}
        I'm currently listening to <a
          href="https://open.spotify.com/track/{$discord.spotify.track_id}"
          class="underline"
          target="_blank">{$discord.spotify.song}</a
        >
        by {$discord.spotify.artist}.
      {:else}I'm currently not listening to anything{/if}
    </p>
  </div>
</section>
