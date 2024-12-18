<script lang="ts">
	import { type Snippet } from "svelte"

	let { children }: { children: Snippet } = $props();
</script>

<kbd class="px-1 font-mono border rounded-md border-zinc-600 bg-blot shadow-[0px_2px_theme(colors.zinc.600)]">
    {@render children()}
</kbd>