<script>
    export let text = "";
</script>

{#each text.split("") as c, i}
    <span style="--index: {i}">{c}</span>
{/each}