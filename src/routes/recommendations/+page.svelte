<script lang="ts">
  import Recommendation from "$lib/components/Recommendation.svelte";
</script>

<svelte:head><title>Aiden Shi | recommendations</title></svelte:head>

<header class="page-header">
  <h1 class="page-heading">Recommendations</h1>
  <p class="prose">Media I like. No particular order.</p>
  <div class="divider"></div>
</header>
<article class="recommendations">
  <Recommendation
    name="Arcane"
    highly={true}
    artist="Fortiche"
    medium="tv show"
    img="/recommendations/arcane.jpg"
  >
    <p>Something will go here eventually</p>
  </Recommendation>
  <div class="divider"></div>
  <Recommendation
    name="Kaguya-sama: Love Is War"
    artist="Aka Akasaka"
    medium="manga"
    img="/recommendations/kaguya-sama.jpg"
  >
    <p>Silly romance 👍</p>

    <p>I dunno what else to say, it's just fun to read.</p>
  </Recommendation>
  <div class="divider"></div>
  <Recommendation name="BLÅHAJ" artist="IKEA" medium="thing" img="/recommendations/blahaj.avif">
    <p>
      No joke, one of the best purchases I've made. You have not felt comfort until you have
      squeezed a <em>BLÅHAJ Soft toy, shark, 39 ¼"</em>.
    </p>
  </Recommendation>
  <div class="divider"></div>
  <Recommendation
    name="Landmark"
    highly={true}
    artist="Hippo Campus"
    medium="album"
    img="/recommendations/landmark.jpg"
  >
    <p>
      Hippo Campus' debut album sounds like summer. It's their most cohesive album, almost to the
      point where the songs start to blur together. But that's part of the charm of this album.
    </p>
    <p>
      This is the album I turn to when I want to feel both happy and sad at the same time. It's the
      feeling of being alive.
    </p>
    <p>
      Also <em>Buttercup</em> is an absolute banger, even if you might not vibe with the rest of the
      album it's still a wonderful track, so upbeat you almost forget about the lyrics.
    </p>

    <p class="fav-track"><span>Favorite Track:</span> Buttercup</p>
  </Recommendation>
  <div class="divider"></div>
  <Recommendation
    name="LP3"
    highly={true}
    artist="Hippo Campus"
    medium="album"
    img="/recommendations/lp3.jpg"
  >
    <p>
      Like Hippo Campus' newer albums, it took me a while to warm up to this album, but when I did,
      it became one of my favorite albums of all time.
    </p>

    <p>
      This album feels like the best of living, knowing that these days will never come back. It's a
      testament to taking risks, not letting your life just pass you by. When I say this album
      changed my life, I don't lie. Its made me think long and hard about how I want to live my
      life.
    </p>

    <p>It's by far some of the emotional music I've listened to, give it a listen.</p>

    <p class="fav-track"><span>Favorite Track:</span> Boys</p>
  </Recommendation>
</article>

<style>
  .recommendations {
    max-width: 65ch;
    margin: auto;
  }

  .fav-track {
    color: var(--text-secondary);
    font-style: italic;

    span {
      font-weight: 600;
    }
  }
</style>
