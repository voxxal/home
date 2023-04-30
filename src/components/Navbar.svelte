<script lang="ts">
  import { page } from "$app/stores";
  const routes = [{ url: "/", title: "home" }];
</script>

<nav
  class="flex items-center justify-center h-24 px-12 bg-gradient-radial-navbar from-dark-navy to-70% text-lg after:flex-1 font-medium"
>
  <div class="flex-1 logo"><a href="/">voxal</a></div>
  <div>
    <ul class="flex-1 p-0 m-0 list-none">
      {#each routes as route}
        <li class="inline-block mx-2">
          <a
          href={route.url}
          class="p-2 {$page.url.pathname === route.url ? 'bubbled-md from-navy to-75%' : ''}">
            {route.title}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
