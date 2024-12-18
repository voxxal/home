<script lang="ts">

  import "$lib/app.css";
  import { Calendar, Clock } from "lucide-svelte";
  let { data } = $props();

</script>

<svelte:head><title>Aiden Shi | blog</title></svelte:head>

<header class="page-header">
  <h1 class="page-heading">Blog</h1>
  <p class="prose">I occasionally make blog posts about whatever is on my mind. Many of these are interactive.</p>
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
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .metadata-divider {
    background: var(--text-tertiary);
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
