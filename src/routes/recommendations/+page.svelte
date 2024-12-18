<script lang="ts">
  import Recommendation from "$lib/components/Recommendation.svelte";
</script>

<header class="page-header">
  <h1 class="page-heading">Recommendations</h1>
  <p class="prose">
    Media I like. Because star ratings are too hard, everything here is classified as recommended or
    highly recommended.
  </p>
  <div class="divider"></div>
</header>
<article class="recommendations">
  <Recommendation
    name="For Cryin' Out Loud"
    artist="FINNEAS"
    medium="album"
    img="https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1e/f6/6a/1ef66a49-98ed-b22d-eb90-56e5640e09dd/24UMGIM79281.rgb.jpg/600x600bb.jpg"
  >
    <p>
      An incredible album by FINNEAS that goes in a different direction as compared to his previous
      two albums. It's got a much more viberant energy opposed to the sadder tones of his previous
      works.
    </p>
    <p>
      This album has definitely cemented itself as a Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Aliquid ducimus, ab minus quo enim quos dolor sint quaerat maxime sunt nihil
      quod accusamus eaque veniam repudiandae dicta suscipit alias error.
    </p>

    <p class="fav-track"><span>Favorite Track:</span> For Cryin' Out Loud</p>
  </Recommendation>
  <div class="divider"></div>
  <Recommendation
    name="LP3"
    highly={true}
    artist="Hippo Campus"
    medium="album"
    img="https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/7d/e3/0c/7de30c48-b139-2253-9b92-67aa65ea6542/196292441680.jpg/600x600bb.jpg"
  >
    <p>
      Like Hippo Campus' newer albums, it took me a while to warm up to this album, but when I did,
      it became one of my favorite albums of all time.
    </p>
    <p>
      Each of their albums take a drastic turn in how their band sounds, and this album was no
      different, completly changing the formula from previous albums like <em>Bambi</em> and
      <em>Landmark</em> with a new sound. Its combination of trumpets and synths really grew on me, and
      its nostolgic mood unmatched by any other album.
    </p>

    <p class="fav-track"><span>Favorite Track:</span> Boys</p>
  </Recommendation>
</article>

<style>
  .recommendations {
    width: 65ch;
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
