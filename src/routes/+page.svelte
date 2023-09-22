<script lang="ts">
  import state from "$lib/state";
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { slideInConf, slideInConfTo } from "$lib/util";
  import { ChevronDown } from "lucide-svelte";
  import "$lib/app.css";

  import SplitText from "$lib/components/SplitText.svelte";
  import Third from "$lib/components/Third.svelte";
  import ProjectLink from "$lib/components/ProjectLink.svelte";

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
      .to(".final-fade-in", { opacity: 1 });
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
  <div class="flex flex-col gap-2">
    <ProjectLink
      class="text-8xl bubbled-lg from-[#6350B6] to-0% hover:to-70% w-fit"
      href="/projects/cyberclass"
      img="/images/projects/cyberclass.png"
    >
      cyberclass
    </ProjectLink>
    <ProjectLink
      class="text-8xl bubbled-lg from-orange-300 to-0% hover:to-70% w-fit"
      href="/projects/triple-fault"
      img="/images/projects/triple-fault.png"
    >
      triple fault
    </ProjectLink>
    <ProjectLink
      class="text-8xl bubbled-lg from-[#DB3033] to-0% hover:to-70% w-fit"
      href="/projects/club-hub"
      img="/images/projects/ccaclubhub.png"
    >
      cca club hub
    </ProjectLink>
    <ProjectLink
      class="text-8xl bubbled-lg from-[#FBCC6C] to-0% hover:to-70% w-fit"
      href="/projects/fsr"
      img="/images/projects/fsr.png"
    >
      furfsky reborn
    </ProjectLink>
  </div>
</section>
