<script lang="ts">
  export let glowColor = "from-dark-navy";
  import { page } from "$app/stores";
  const routes = [
    { url: "/", title: "home", color: "from-navy" },
    { url: "/blog", title: "blog", color: "from-purple-600" },
    { url: "/garden", title: "garden", color: "from-emerald-600" },
  ];
</script>

<nav
  class="absolute z-50 flex items-center justify-center h-24 px-12 bg-navbar transition duration-200 {glowColor} to-70% text-lg after:flex-1 font-medium w-full"
>
  <div class="flex-1 logo"><a href="/">voxal</a></div>
  <div>
    <ul class="flex-1 p-0 m-0 list-none">
      {#each routes as route}
        <li class="inline-block mx-2">
          <a
            href={route.url}
            class="p-2 bubbled-md {route.color} {`/${$page.url.pathname.split('/')[1]}` ===
            route.url
              ? `to-60%`
              : `hover:to-50% to-0%`}"
          >
            {route.title}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
