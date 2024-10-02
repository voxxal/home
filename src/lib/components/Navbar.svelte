<script lang="ts">
  export let glowColor = "from-dark-navy";
  import { page } from "$app/stores";
  import Logo from "./Logo.svelte";
  const routes = [
    { url: "/", title: "home" },
    { url: "/blog", title: "blog" },
    // { url: "/garden", title: "garden", color: "from-emerald-600" },
  ];
</script>

<nav class="navbar">
  <div class="navbar-content">
    <div class="logo-wrapper">
      {#if $page.url.pathname.split("/")[1] !== ""}
        <a href="/" class="logo">
          <Logo size="2rem" />
        </a>
        <div class="logo-wordmark">Aiden Shi</div>
      {/if}
    </div>
    <ul class="navbar-items">
      {#each routes as route}
        <li>
          <a
            href={route.url}
            class={`/${$page.url.pathname.split("/")[1]}` === route.url ? "selected-item" : ""}
          >
            {route.title}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>

<style>
  .navbar {
    top: var(--navbar-top);
    width: 100%;
    z-index: 1000;
    position: absolute;
  }
  .navbar-content {
    /* TODO im gonna have to decide whether to have the star hang off the side or not */
    max-width: calc(65ch + 4rem);
    min-height: var(--navbar-height);
    padding: 0.5rem 2rem;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: var(--radius-4);
    /* background: oklch(from var(--surface-200) l c h / 0.8); */
  }

  .navbar-items {
    font-size: 1.25rem;
    display: flex;
    gap: 1rem;
  }

  .selected-item {
    font-weight: 600;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .logo {
    height: 2rem;
    width: 2rem;
    transition: rotate 200ms var(--ease-out-back);
    z-index: 10;
  }

  .logo-wordmark {
    font-family: var(--font-display);
    color: var(--text-em);
    font-size: 2rem;
    display: block;
    line-height: 1;
    transition: 200ms var(--ease-out-back);
    translate: -15% 0;
    opacity: 0;
  }

  .logo:hover {
    rotate: 45deg;
  }

  .logo:hover + .logo-wordmark {
    display: block;
    pointer-events: none;
    translate: 0% 0;
    opacity: 1;
  }
</style>
