<script lang="ts">
	import { type Snippet } from "svelte"

	let { children }: { children: Snippet } = $props();
</script>

<span class="bg-[#5865F2]/30 text-[#C9CDFB] rounded py-0.5 px-1">@{@render children()}</span>