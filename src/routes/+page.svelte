<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import Tag from "$lib/components/Tag.svelte";
  import { useLanyard } from "svelte-lanyard";
  const discord = useLanyard("290952090560364545");
  const titles = [
    "a computer person",
    "a kindred spirit",
    "searching for that north star",
    "following the compass",
    "found, maybe lost",
    "a painter of code",
    "something to someone",
    "human?",
    "beyond help",
    "beyond saving",
    "finding himself",
    "a professional idiot",
    "a major in disappointment",
    "something else",
    "also known as voxal",
    "tending to something",
    "lonely",
    "denying the allegations",
    "not taking himself seriously",
    "at peace",
    "a problem",
    "a mess",
    "a cat person",
    "a dog person",
    "maker of things",
    "slowly losing it",
    "in no rush",
    "clueless",
    "at fault",  
    "an agent of chaos",
    "an outlander",
    "trying",
    "experimenting",
    "fleeting",
    "growing",
    "resting",
    "building",
    "wondering",
    "designing",
    "programming",
    "meowing",
  ];
  const websites = [
    {
      name: "voxal.dev",
      technologies: ["svelte"],
      description: "A personal website. Cherished.",
      link: "https://voxal.dev",
      image: "/images/projects/voxal-dev.png",
      video: "https://placedog.net/480/270",
    },
    {
      name: "Veria Labs",
      technologies: ["astro", "tailwind"],
      description: "Design work for Veria Labs (YC F25). Designed landing page.",
      link: "https://verialabs.com",
      image: "/images/projects/veria-labs.png",
    },
    {
      name: "Dabney House",
      technologies: ["astro", "svelte", "tailwind"],
      description: "Commission for CalTech's Dabney House. Designed and built the website.",
      link: "https://dabney.house",
      image: "/images/projects/dabney-house.png",
    },
    {
      name: "Triple Fault",
      technologies: ["svelte", "tailwind", "three.js"],
      description: "A page for my robotics team. Designed and built the website.",
      link: "https://3fault.com",
      image: "/images/projects/triple-fault.png",
    },
    {
      name: "CCA Club Hub",
      technologies: ["elm", "rust", "postgresql"],
      description:
        "A website for our high school ASB. Think of it as a club social media. Built most of the front and back end.",
      link: "https://github.com/coding-outreach",
      image: "/images/projects/ccaclubhub.png",
    },
    {
      name: "CyberClass Camp",
      technologies: ["svelte", "tailwind", "figma"],
      description:
        "CyberClass Camp is a cybersecurity camp that me and my friends ran. Designed and built the website.",
      link: "https://cyberclasscamp.com",
      image: "/images/projects/cyberclass.png",
    },
    {
      name: "CCA Aerospace Club",
      technologies: ["eleventy"],
      description:
        "CCA Aerospace Club is a club me and some friends co-founded. Designed and built the website",
      link: "https://cca-aerospace.club",
      image: "/images/projects/cca-aerospace.png",
    },
    {
      name: "syscalls",
      technologies: ["svelte", "tailwind"],
      description:
        "Linux syscalls. My friend wrote a script that extracted syscalls details from the linux kernel. I designed and built the front-end.",
      link: "https://syscalls.pages.dev",
      image: "/images/projects/syscalls.png",
    },
    {
      name: "CCA Math Bonanza",
      technologies: ["svelte"],
      description:
        "A math competition ran by our high school math club. Designed and built the website.",
      link: "https://ccamb.org",
      image: "/images/projects/ccamb.png",
    },
    {
      name: "FurfSky Reborn",
      technologies: ["next.js", "tailwind", "figma"],
      description:
        "Website for downloading the FurfSky Reborn texture pack for Hypixel Skyblock. Built the site.",
      link: "https://furfsky.net",
      image: "/images/projects/fsr.png",
    },
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

  <h1 class="name-heading">Aiden Shi</h1>
  <h2 class="subheading">is {title}</h2>

  <div class="prose">
    <p>
      Hey, I'm Aiden, designer and developer from California. I mess around with computers, making
      websites, small programs, games, and whatever interests me at the time. I'm especially
      interested in how we can use computers to <em>augment</em> our learning.
    </p>
    <p>
      This website is a catalogue of my different projects and experiments. I hope you find
      something interesting here.
    </p>
    <p>
      Feel free to reach out, Discord is the best way to reach me. Details are in the footer. Pardon
      the dust, this place is still in construction.
    </p>
  </div>
</section>

<section id="websites">
  <div class="websites-header">
    <h2 class="websites-heading">Websites I Made</h2>
    <h3 class="subheading">My fragments of the internet.</h3>
  </div>
  <div class="websites-carousel">
    {#each websites as { description, name, technologies, link, image, video }}
      <div class="websites-carousel-item hover-highlight">
        <a href={link} target="_blank">
          <img src={image} alt={description} />
          <h3>{name}</h3>
          <div class="technologies">
            {#each technologies as tag}
              <Tag {tag} />
            {/each}
          </div>

          <p>{description}</p>
        </a>
      </div>
    {/each}
  </div>
</section>

<style>
  #landing-intro {
    max-width: 65ch;
    margin: auto;
    margin-top: var(--navbar-offset);
    position: relative;
    animation: intro-slide-in 500ms ease-out;
  }

  @keyframes intro-slide-in {
    from {
      opacity: 0;
      transform: translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .landing-logo {
    position: absolute;
    z-index: -10;
    left: -12.5rem;
    top: -6.25rem;
    mask-image: linear-gradient(to bottom right, rgba(0 0 0 / 0.5), rgba(0 0 0 / 0.05) 75%);
    animation: grow-in 1s;
  }

  @keyframes grow-in {
    from {
      left: -8rem;
      top: -4rem;
      height: 1rem;
      width: 1rem;
      /* mask-image: linear-gradient(to bottom right, rgba(0 0 0 / 0.75), rgba(0 0 0 / 0) 50%); */
    }
    to {
      rotate: 0deg;
      left: -12.5rem;
      height: 25rem;
      width: 25rem;
    }
  }

  .landing-logo .spinner {
    animation:
      rotate 600s linear infinite 2s,
      rotate-in 2s ease-out;
  }

  @keyframes rotate {
    from {
      rotate: 0;
    }
    to {
      rotate: 1turn;
    }
  }

  @keyframes rotate-in {
    from {
      rotate: -5deg;
    }
    to {
      rotate: 0;
    }
  }

  .name-heading {
    font-family: var(--font-display);
    color: var(--text-xem);
    font-size: 6rem;
    line-height: 1;
    display: grid;

    canvas {
      width: 100%;
      height: 6rem;
    }
    
    @media (width < 40rem) {
      font-size: 4rem;
    }
  }

  .name-heading * {
    grid-row-start: 1;
    grid-column-start: 1;
  }

  .subheading {
    font-size: 1.5rem;
    @media (width < 40rem) {
      font-size: 1.25rem;
    }
    color: var(--text-tertiary);
    line-height: 1;
    font-weight: 500;
    font-style: italic;
    margin-bottom: 2rem;
  }

  #websites {
    margin-top: 8rem;

    animation:
      do-not-exist-for-a-certain-period-of-time 250ms,
      intro-slide-in 500ms 250ms ease-out;
  }

  @keyframes do-not-exist-for-a-certain-period-of-time {
    from {
      opacity: 0;
    }
    to {
      opacity: 0;
    }
  }

  .websites-header {
    max-width: 65ch;
    margin: auto;

    & > .subheading {
      font-size: 1.25rem;
    }

    @media (width < 40rem) {
      font-size: 1rem;
    }
  }

  .websites-heading {
    font-family: var(--font-display);
    color: var(--text-em);
    font-size: 3rem;
    line-height: 1;

    @media (width < 40rem) {
      font-size: 2.25rem;
    }
  }

  .websites-carousel {
    /* TODO chrome cant do math apparently */
    --space-from-left: calc((100vw - 65ch - var(--scrollbar-width)) / 2 - 1rem);
    width: 100%;
    display: flex;
    
    gap: 2rem;
    overflow: scroll visible;
    scrollbar-width: thin;
    scrollbar-color: var(--surface-400) transparent;
    scroll-snap-type: x proximity;
    padding-bottom: 0.5rem;
    /* padding left + difference between the two */
    /* idk what the 2rem is here for the math needs to be reexplained (but it works :D) */
    padding-right: calc(var(--space-from-left) + 65ch - 30rem + 2rem);

    @media (width < 40rem) {
      flex-direction: column;
      gap: 3rem;
      padding-right: 0;
    }
  }

  .websites-carousel::-webkit-scrollbar {
    display: none;
  }

  .websites-carousel-item {
    min-width: 30rem;
    padding: 1rem;
    position: relative;
    scroll-margin-left: var(--space-from-left);
    scroll-snap-align: start;

    &:first-child {
      margin-left: var(--space-from-left);
    }

    a {
      display: block;
    }

    .technologies {
      display: flex;
      gap: 0.5rem;
      margin: 0.25rem 0 0.75rem 0;
      :global(& > *) {
        margin-bottom: 0.5rem;
      }
    }

    img {
      border: 2px solid var(--surface-300);
      border-radius: var(--radius-2);
      margin-bottom: 1rem;
      width: 30rem;
      aspect-ratio: 16 / 9;
    }

    h3 {
      font-size: 2rem;
      font-weight: 500;
    }
    
    @media (width < 40rem) {
      padding: 0;
      min-width: 0rem;

      &:first-child {
        margin-left: 0;
      }

      img {
        width: auto;
      }
    }
  }
</style>
