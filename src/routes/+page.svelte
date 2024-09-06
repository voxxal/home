<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import state from "$lib/state";
  import { useLanyard } from "svelte-lanyard";
  $state.navbarColor = "from-dark-navy";
  const discord = useLanyard("290952090560364545");
  const titles = [
    "a computer person",
    "a kindred spirit",
    "searching for the north star",
    "following the compass",
    "a designer i hope",
    "creating a world of his own",
    "found, maybe lost",
    "beyond",
    "trying",
    "experimenting",
    "a painter of code",
    "something to someone",
    "temporal",
    "fleeting",
    "human?",
    "beyond help",
    "a senior",
    "growing",
    "finding himself",
    "a professional idiot",
    "a major in disappointment",
    "something else",
    "also known as voxal",
    "tending to something",
    "with you",
    "lonely",
    "resting",
    "meowing",
  ];
  const title = titles[Math.floor(Math.random() * titles.length)];
</script>

<svelte:head><title>Aiden Shi | home</title></svelte:head>
<section id="landing-intro">
  <div class="landing-logo">
    <div class="spinner">
      <Logo size="25rem" />
    </div>
  </div>

  <h1 class="name-heading"><canvas height="6rem"></canvas><span>Aiden Shi</span></h1>
  <h2 class="name-subheading">is {title}</h2>

  <div class="prose">
    <p>
      In 2007 Aiden Shi invented procrastination. This was widely regarded as a bad move. To this
      day, he seeks to right his wrong, but hasn't started yet. He says he'll start tomorrow.
    </p>
    <p>
      I design and develop things for automatic computational devices. While I'm best at making
      websites, my heart yearns to be closer to the bytes. I'm also incredibly interested in how we
      can use computers to <em>augment</em> our learning.
    </p>
    <p>
      This website is a catalogue of my different projects and experiments, but also an expression
      of myself. I hope you find something interesting here.
    </p>
    <p>If you are a human consider reaching out and having a chat.</p>
  </div>
</section>

<!-- <section id="websites-i-made">
  <h1>Websites I Made</h1>
  <p>I make websites for others.</p>
</section> -->

<style>
  #landing-intro {
    width: 65ch;
    margin: auto;
    margin-top: var(--navbar-offset);
    position: relative;
  }

  .landing-logo {
    position: absolute;
    z-index: -10;
    left: -12.5rem;
    top: -6.25rem;
    mask-image: linear-gradient(to bottom right, rgba(0 0 0 / 0.75), rgba(0 0 0 / 0.05) 75%);
  }

  .landing-logo .spinner {
    animation: rotate 600s linear infinite;
  }
  @keyframes rotate {
    from {
      rotate: 0;
    }
    to {
      rotate: 1turn;
    }
  }

  .name-heading {
    font-family: var(--font-display);
    color: var(--text-em);
    font-size: 6rem;
    line-height: 1;
    display: grid;
  }

  .name-heading canvas {
    width: 100%;
    height: 6rem;
  }

  .name-heading * {
    grid-row-start: 1;
    grid-column-start: 1;
  }

  .name-subheading {
    font-size: 1.5rem;
    color: var(--text-secondary);
    line-height: 1;
    font-weight: 500;
    font-style: italic;
    margin-bottom: 2rem;
  }
</style>
