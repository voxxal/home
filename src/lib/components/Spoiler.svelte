<script lang="ts">
  interface Props {
    shown?: boolean;
    children?: import('svelte').Snippet;
  }

  let { shown = $bindable(false), children }: Props = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<p class="{shown ? '' : 'blur-md cursor-pointer'} transition-all" onclick={() => (shown = true)}>
  {@render children?.()}
</p>
