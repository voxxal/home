<script lang="ts">
  export let href: string;
  let className = "";
  export { className as class };
</script>

<a {href} class="{className} hover:translate-x-8 transition-all block ease-out"><slot /></a>
