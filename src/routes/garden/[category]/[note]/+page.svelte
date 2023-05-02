<script lang="ts">
  export let data;
  import "$lib/app.css";
  import "$lib/prism.css"

  import Body from "$lib/components/Body.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
</script>

<Body>
  <Navbar glowColor="from-emerald-800" />
  <main class="px-12 mt-4">
    <header>
      <h1 class="text-7xl font-medium bubbled-lg from-emerald-600 to-60% pb-2 overflow-hidden">{data.title}</h1>
      <p><span class="font-bold">Last Tended:</span> {data.lastUpdated}</p>
    </header>
    <hr class="my-4 border-zinc-600/75" />
    <article class="mb-16 prose lg:prose-xl prose-invert">
      <svelte:component this={data.content} />
    </article>
  </main>
</Body>
