<script context="module">
  export const metadata = {
    title: "march (of improvement)",
    published: "2024-03-01",
  };
  const DAY = 4;
  const habits = {
    sleep: [
      0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    read: [
      1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    walk: [
      1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    code: [
      1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    journal: [
      1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    blog: [1, 0, 0, 0, 0],
  };
</script>

<p>
  My life has been a little bit of a mess for the past couple months. I guess you could say that
  this little project of mine is an attempt to improve myself. For the next 30 days I am planning to
  track a host of habits in the pursuit of improving myself.
</p>

<p>
  This page should be updated daily over the course of march. The last time it was updated was
  2024-03-{DAY.toString().padStart(2, "0")}.
</p>
<div class="max-w-[calc(1.25rem*31+31px)] m-auto grid grid-cols-1">
  <a class="grid grid-cols-[repeat(31,minmax(0,1fr))] h-5 grid-rows-1" href="#sleep" title="Sleep">
    {#each habits.sleep as day}
      <div class={day ? "bg-blue-500" : "bg-blue-950"}></div>
    {/each}
  </a>
  <a class="grid grid-cols-[repeat(31,minmax(0,1fr))] h-5 grid-rows-1" href="#read" title="Read">
    {#each habits.read as day}
      <div class={day ? "bg-emerald-500" : "bg-emerald-950"}></div>
    {/each}
  </a>
  <a
    class="grid grid-cols-[repeat(31,minmax(0,1fr))] h-5 grid-rows-1"
    href="#journal"
    title="Journal"
  >
    {#each habits.journal as day}
      <div class={day ? "bg-pink-500" : "bg-pink-950"}></div>
    {/each}
  </a>
  <a class="grid grid-cols-[repeat(31,minmax(0,1fr))] h-5 grid-rows-1" href="#walk" title="Walk">
    {#each habits.walk as day}
      <div class={day ? "bg-rose-500" : "bg-rose-950"}></div>
    {/each}
  </a>

  <a
    class="grid grid-cols-[repeat(31,minmax(0,1fr))] h-5 grid-rows-1"
    href="#program"
    title="Program"
  >
    {#each habits.code as day}
      <div class={day ? "bg-amber-500" : "bg-amber-950"}></div>
    {/each}
  </a>
  <a class="grid grid-cols-[repeat(5,minmax(0,1fr))] h-5 grid-rows-1" href="#blog" title="Blog">
    {#each habits.blog as day}
      <div
        class="{day
          ? 'bg-violet-500 border-r-violet-600'
          : 'bg-violet-950 border-r-violet-900'} last:border-0 border-r"
      ></div>
    {/each}
  </a>
</div>
<p>And now a quick overview of each of these habits I'm tracking...</p>
<h2 id="sleep" class="text-blue-500">Sleep ({habits.sleep.filter(Boolean).length}/{DAY})</h2>
<p>
  Prety self explanatory. Recently my sleep schedule has been a little screwed over so this is to
  help remedy it. Rules for this one are simple, just go to sleep before 11.
</p>

<h2 id="read" class="text-emerald-500">Read ({habits.read.filter(Boolean).length}/{DAY})</h2>
<p>
  Read something! I have a couple books from the library that I should finish, as well as <a
    href="https://suif.stanford.edu/dragonbook/">Dragon Book</a
  >, which if I read 33 pages of a day, I can get done in March! Although 33 pages is quite a lot
  and I'll be aiming to read 15 pages a day.
</p>

<h2 id="journal" class="text-pink-500">Journal ({habits.journal.filter(Boolean).length}/{DAY})</h2>
<p>
  I stopped journalling after school started. I should start again, I think it was very helpful
  (plus it makes the graph view look better :). I use <a href="https://obsidian.md">Obsidian</a> for
  journalling and note taking. Taking notes also qualifies for this.
</p>

<h2 id="walk" class="text-rose-500">Walk ({habits.walk.filter(Boolean).length}/{DAY})</h2>
<p>
  The joke about programmers never leaving their room is true, I definitely do not get enough
  exercise. Although the name of this habit is walk, any type of exercise counts.
</p>

<h2 id="program" class="text-amber-500">Program ({habits.code.filter(Boolean).length}/{DAY})</h2>
<p>
  Recreational programming! Work on something I enjoy (like making this funny webpage), this one
  should be plenty easy but I want to make it a consistant habit.
</p>

<h2 id="blog" class="text-violet-500">
  Blog ({habits.blog.filter(Boolean).length}/{Math.floor((DAY - 1) / 7 + 1)})
</h2>
<p>
  I want to post on this blog more, random rants and stuff. The reason why this bar is split into 5
  is because I'm only planning to post one a week, each friday. This post counts.
</p>

<p>That's all for now, see you tomorrow!</p>