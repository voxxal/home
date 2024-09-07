<script lang="ts">
  export let data;

  import state from "$lib/state";
  import gsap from "gsap";
  import { onMount } from "svelte";
  import { slideInConf, slideInConfTo } from "$lib/util";
  import "$lib/app.css";

  import SplitText from "$lib/components/SplitText.svelte";
  import BumpLink from "$lib/components/BumpLink.svelte";
  import { Calendar, Clock } from "lucide-svelte";

  $state.navbarColor = "from-purple-800";
</script>

<svelte:head><title>Aiden Shi | blog</title></svelte:head>

<header class="blog-header">
  <h1 class="blog-heading">Blog</h1>
  <p>I occasionally make blog posts about whatever is on my mind. Many of these are interactive.</p>
  <div class="divider"></div>
</header>
<div class="posts">
  {#each data.posts as post}
    <a href="/blog/{post.path}" class="post hover-highlight">
      <h2>{post.title}</h2>
      <!-- todo maybe include hours, also single element is a mess -->
      <div class="metadata">
        <Calendar class="inline-icon" />
        <span>{post.published}</span>
        <div class="metadata-divider"></div>
        <Clock class="inline-icon" />
        <span>{post.readingTime.toFixed(0)} min</span>
      </div>
      <!-- <h3> {post.published} • <Clock class="inline-icon"/> {(Math.max(post.wordCount, 225) / 225).toFixed(0)} min</h3> -->
      <p class="preview">{post.preview ?? ""}</p>
    </a>
  {/each}
</div>

<style>
  .blog-header {
    width: 65ch;
    margin: auto;
    margin-top: var(--navbar-offset);
  }

  .blog-heading {
    font-size: 4rem;
    font-family: var(--font-display);
    color: var(--text-em);
    line-height: 1;
    margin-bottom: 1rem;
  }

  .posts {
    width: calc(65ch + 2rem * 2);
    margin: auto;
  }

  .post {
    position: relative;
    padding: 1rem 2rem;
    margin: 1rem 0;
    display: block;
    border-radius: var(--radius-2);
  }
  
  .post h2 {
    font-size: 2rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .metadata {
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .metadata-divider {
    background: var(--text-secondary);
    height: 0.25rem;
    width: 0.25rem;
    margin: 0 0.25rem;
    border-radius: 100%;
  }

  .preview {
    margin-top: 1rem;
    mask-image: linear-gradient(to bottom, #fff 0, transparent 3lh);
    max-height: 3lh;
  }

  :global(.inline-icon) {
    display: inline;
    height: 1rem;
    width: 1rem;
  }
</style>
