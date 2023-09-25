<script lang="ts">
  export const ssr = false;
  import state from "$lib/state";
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { slideInConf, slideInConfTo } from "$lib/util";
  import { ChevronDown, Music } from "lucide-svelte";
  import { useLanyard } from "svelte-lanyard";
  import "$lib/app.css";

  import SplitText from "$lib/components/SplitText.svelte";
  import Third from "$lib/components/Third.svelte";
  import ProjectLink from "$lib/components/ProjectLink.svelte";

  $state.navbarColor = "from-dark-navy";

  let time = Date.now();
  const discord = useLanyard("290952090560364545");
  $: songTime = (() => {
    if (!$discord?.spotify) return null;
    const totalTime = ($discord.spotify.timestamps.end - $discord.spotify.timestamps.start) / 1000;
    const currTime = (time - $discord.spotify.timestamps.start) / 1000;
    const totalMin = Math.floor(totalTime / 60);
    const currMin = Math.floor(currTime / 60);
    return (currMin + ":" + Math.floor(currTime - currMin * 60).toString().padStart(2, 0) +
        " / " + totalMin + ":" + Math.floor(totalTime - totalMin * 60).toString().padStart(2, 0))
    
  })()
  $: percentageThroughSong = (() => {
    if (!$discord?.spotify) return null;
    return (time - $discord.spotify.timestamps.start) / ($discord.spotify.timestamps.end - $discord.spotify.timestamps.start)
  })()
  onMount(() => {
    const interval = setInterval(() => {
			time = Date.now();
		}, 1000);
    const tl = gsap.timeline();

    tl.fromTo(
      "#heyIm",
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, ease: "Power4.easeOut", duration: 1 }
    )
      .fromTo(".developerIn", slideInConf, slideInConfTo, "-=0.7")
      .fromTo(".designerIn", slideInConf, slideInConfTo, "-=0.7")
      .fromTo(".thirdIn", slideInConf, slideInConfTo, "-=0.7")
      .to(".final-fade-in", { opacity: 1 });
    return () => {
			clearInterval(interval);
		};
  });
</script>

<header class="flex flex-col min-h-screen px-12 pt-28">
  <div>
    <h2 class="pb-2 text-5xl opacity-0" id="heyIm">
      hey, i'm <span class="bubbled-md from-navy to-60% px-1">aiden.</span>
    </h2>
    <h1 class="overflow-hidden font-medium text-8xl">
      <SplitText class="inline-block opacity-0 developerIn bubbled-lg from-navy to-70% pb-4" text="developer," />
    </h1>
    <h1 class="overflow-hidden font-medium text-8xl">
      <SplitText class="inline-block opacity-0 designerIn bubbled-lg from-navy to-70% pb-4 " text="designer," />
    </h1>
    <Third />
    <p class="mt-auto text-xl max-w-[65ch] opacity-0 final-fade-in">
      i'm a highschooler from california who's interested in programming languages, cybersecurity,
      and designing websites. on this website you'll find some of my projects and interactive
      explainations of things i find interesting.
    </p>
  </div>
  <ChevronDown class="self-center mt-auto mb-8 text-white opacity-0 final-fade-in" />
</header>
<section class="px-12 mt-8">
  <h1 class="text-8xl font-medium bubbled-lg from-navy to-70% pb-2">projects</h1>
  <hr class="pb-8 my-4 border-zinc-600/75" />
  <div class="flex flex-col gap-2 w-fit">
    <ProjectLink
      class="text-8xl bubbled-lg from-[#6350B6] to-0% hover:to-70%"
      href="/projects/cyberclass"
      img="/images/projects/cyberclass.png"
    >
      cyberclass
    </ProjectLink>
    <ProjectLink
      class="text-8xl bubbled-lg from-orange-300 to-0% hover:to-70%"
      href="/projects/triple-fault"
      img="/images/projects/triple-fault.png"
    >
      triple fault
    </ProjectLink>
    <ProjectLink
      class="text-8xl bubbled-lg from-[#DB3033] to-0% hover:to-70%"
      href="/projects/club-hub"
      img="/images/projects/ccaclubhub.png"
    >
      cca club hub
    </ProjectLink>
    <ProjectLink
      class="text-8xl bubbled-lg from-[#FBCC6C] to-0% hover:to-70%"
      href="/projects/fsr"
      img="/images/projects/fsr.png"
    >
      furfsky reborn
    </ProjectLink>
  </div>
</section>
<section class="px-12 mt-16">
  <h1 class="text-8xl font-medium bubbled-lg from-[#1DB954] to-70% pb-2">spotify</h1>
  <h2 class="text-2xl font-medium" id="subtitle">my terrible music taste exposed</h2>
  <hr class="pb-8 my-4 border-zinc-600/75" />
  <div 
    class="bg-gradient-to-t from-[#1DB954] to-zinc-900 p-4 rounded-lg max-w-[70rem]" 
    style="--tw-gradient-to-position: {(percentageThroughSong || 0) * 100}%"
  >
    <div class="bg-zinc-800 p-8 rounded-lg">
      {#if $discord?.spotify}
        <div class="flex gap-8">
          <img src={$discord.spotify.album_art_url} class="w-64 h-64 rounded-md border-2 border-zinc-600" />
          <div class="w-full flex flex-col">
            <div> 
              <h2 class="text-4xl font-medium">{$discord.spotify.song}</h2>
              <h3 class="text-2xl text-zinc-400">by <span class="text-zinc-300">{$discord.spotify.artist}</span></h3>
              <h4 class="text-zinc-400 mt-2">{songTime}</h4>
            </div>
            <a 
              href="https://open.spotify.com/track/{$discord.spotify.track_id}" 
              class="mt-auto w-full block active:translate-y-1 hover:translate-y-0.5 group transition-all"
              target="_blank"
            >
              <button 
                class="bg-[#1DB954] rounded-md w-full py-2 text-zinc-900 text-xl font-bold"
              >
                <Music class="inline group-hover:scale-105 group-hover:-rotate-12 transition-all"/>
                listen
              </button>
            </a>
          </div>
        </div>
      {:else}
        <h2 class="text-4xl font-medium">nothing is playing right now</h2>
      {/if}
    </div>
  </div>
</section>
