<script lang="ts">
  export let glowColor = "from-dark-navy";
  import { page } from "$app/stores";
  import Logo from "./Logo.svelte";
  const routes = [
    { url: "/", title: "home", color: "from-navy" },
    { url: "/blog", title: "blog", color: "from-purple-600" },
    { url: "/garden", title: "garden", color: "from-emerald-600" },
  ];
</script>

<nav class="navbar">
  <div class="navbar-content">
    <a href="/">
      {#if `/${$page.url.pathname.split('/')[1]}` !== "/"}
      <div class="logo">
        <Logo size="2rem" />
      </div>
      {/if}
    </a>
    <ul class="navbar-items">
      {#each routes as route}
        <li>
          <a href={route.url} target="_self">
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

  .logo {
    margin-right: 1rem;
    height: 2rem;
    width: 2rem;
    transition: rotate 200ms;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .logo:hover {
    rotate: 45deg;
  }
</style>
