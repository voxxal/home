<script lang="ts">
  import { page } from "$app/stores";
  import Logo from "./Logo.svelte";
  const routes = [
    { url: "/", title: "home", color: "from-navy" },
    { url: "/blog", title: "blog", color: "from-purple-600" },
    { url: "/garden", title: "garden", color: "from-emerald-600" },
  ];
  const isHomePage = $derived(`/${$page.url.pathname.split("/")[1]}` === "/");
</script>

<nav class="navbar">
  <div class="navbar-content">
    <a href="/">
      <div class="logo {isHomePage && 'large'}">
        <Logo size={isHomePage ? "25rem" : "2rem"} />
      </div>
    </a>
    <ul class="navbar-items">
      {#each routes as route}
        <li>
          <a href={route.url}>
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
    /* z-index: 1000; */
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
    position: relative;
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
    position: absolute;
    left: 2rem;
    top: 0.5rem;
    transition: 0s;
    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .logo.large {
    z-index: -10;
    height: 25rem;
    width: 25rem;
    left: -12.5rem;
    top: 0rem;
    /* TODO might be able to animate this nicely using @property, also can fix animation by pointing based on rotationn */
    mask-image: linear-gradient(to bottom right, rgba(0 0 0 / 0.75), rgba(0 0 0 / 0) 75%);
    animation: rotate 60s linear infinite;
    transition: 2s;
  }

  @keyframes rotate {
    from {
      rotate: 0;
    }
    to {
      rotate: 1turn;
    }
  }

  .logo:not(.large):hover {
    rotate: 45deg;
  }
</style>
