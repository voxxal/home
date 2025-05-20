<script lang="ts">
  const defaultArtFn = (x: number, y: number) => {
    const dist = Math.hypot(x, y);
    return {
      size: Math.max(Math.min(Math.max((5 - dist) / 3, 0.25) + (Math.random() - 0.5) / 2, 1), 0.1),
      radius: Math.max(1 - dist / 5, 0),
    };
  };
  const { title = "Lorem Ipsum", artFn = defaultArtFn } = $props();
</script>

<div class="container">
  <h1 class="title">{title}</h1>
  <div class="divider"></div>
  <div class="grid">
    {#each { length: 13 }, y}
      <div class="grid-row">
        {#each { length: 9 }, x}
          {@const res = artFn(y - 6, x - 4)}
          {@const size = `${res.size * 100}%`}
          {@const radius = `${res.radius * 100}%`}
          <div class="grid-cell">
            <!-- --accent-600 -->
            <div
              class="cell-insides"
              style="height:{size};width:{size};background:#C7E662;border-radius:{radius}"
            ></div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
<div class="grain"></div>

<style>
  /* does not support oklch :( */
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #2e3726 /* --surface-200 */;
    padding: 1rem;
  }

  .title {
    /* TODO update xem */
    color: #fffbc1 /* --text-em */;
    font-size: 3rem;
    margin: 0;
  }

  .grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 1rem;
  }

  .grid-row {
    display: flex;
    gap: 4px;
  }

  .grid-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem;
    height: 1.5rem;
  }
  .cell-insides {
    display: flex;
  }

  .grain {
    display: flex;
    background-image: url(https://upload.wikimedia.org/wikipedia/commons/5/5c/Image_gaussian_noise_example.png);
    content: "";
    height: 100%;
    left: 0;
    opacity: 0.1;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .divider {
    display: flex;
    /* margin: 1rem; */
    height: 1px;
    width: 100%;
    background: #485140 /* --surface-300 */;
  }
</style>
