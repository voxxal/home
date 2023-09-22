<script lang="ts">
  import BumpLink from "./BumpLink.svelte";

  export let href: string;
  export let img: string;
  let className = "";
  export { className as class };
</script>

<div class="group">
  <div>
    <img
      src={img}
      class="fixed top-0 left-0 object-cover w-full h-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-25 group-hover:scale-105 -z-10 vignette-lg"
      alt="project link hover effect"
    />
  </div>
  <BumpLink {href} class={className}><slot /></BumpLink>
</div>
