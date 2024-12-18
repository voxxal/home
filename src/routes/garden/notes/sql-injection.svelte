<script module>
  export const metadata = { title: "sql injection", lastUpdated: "May 2023" };
</script>

<script lang="ts">
  import { run } from 'svelte/legacy';

  import Prism from "$lib/components/Prism.svelte";
  import Spoiler from "$lib/components/Spoiler.svelte";
  import "prismjs/components/prism-sql";
  import initSqlJs, { type Database } from "sql.js";
  import { onMount } from "svelte";

  let db: Database = $state();
  let boolPassword = $state("");
  let boolSolveState: "" | "solved" | "wrong" | `Error: ${string}` = $state("");
  let unionSearch = $state("");
  let unionSearchResult: { id: number; name: string; price: number; stock: number }[] = $state([]);
  let unionSolved = $state(false);
  run(() => {
    unionSolved = unionSearchResult.some((x) =>
      Object.values(x).some((v) => v === "you did it! you got me!")
    );
  });
  let unionSearchError = $state("");

  onMount(() => {
    const initSql = async () => {
      const SQL = await initSqlJs({
        locateFile: (file) => `https://sql.js.org/dist/${file}`,
      });
      db = new SQL.Database();

      db.run(`CREATE TABLE bool_injection (username VARCHAR, password VARCHAR);
      INSERT INTO bool_injection (username, password) 
      VALUES (
        'admin',
        'this_is_a_secure_password_that_you_shouldnt_crack_or_look_at_source_for_use_the_SQL_injection_ty'
      );`);
      db.run(`CREATE TABLE union_injection (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, price REAL, stock INTEGER);
      CREATE TABLE flag (flag VARCHAR);
      INSERT INTO flag (flag) VALUES ('you did it! you got me!');
      INSERT INTO union_injection (name, price, stock) VALUES
        ('BLÅHAJ Soft toy, shark, 39 ¼ "', 29.99, 406),
        ('BLÅVINGAD Soft toy, blue whale, 39 "', 29.99, 58),
        ('DJUNGELSKOG Soft toy, panda', 24.99, 102),
        ('JÄTTESTOR Soft toy, elephant/gray', 19.99, 269),
        ('DJUNGELSKOG Soft toy, lion', 14.99, 64),
        ('DJUNGELSKOG Soft toy, tiger', 12.99, 55),
        ('MORRHÅR Soft toy, leopard/beige, 31 "', 19.99, 22),
        ('DJUNGELSKOG Soft toy, orangutan', 9.99, 117),
        ('DJUNGELSKOG Glove puppet, snake/burmese python', 12.99, 106),
        ('JÄTTEMÄTT Soft toy, crocodile/green, 31 "', 19.99, 12),
        ('JÄTTELIK Soft toy, dinosaur/dinosaur/brontosaurus, 22 "', 9.99, 100),
        ('JÄTTELIK Soft toy, egg/dinosaur/dinosaur/ankylosaurus, 15 "', 12.99, 32)
      `);
      runUnionDemo();
    };
    initSql();
  });

  const runBoolDemo = () => {
    try {
      const res = db.exec(
        `SELECT * FROM bool_injection WHERE username = 'admin' AND password = '${boolPassword}'`
      );
      if (res.length > 0 && res[0].values.length > 0) {
        boolSolveState = "solved";
      } else {
        boolSolveState = "wrong";
      }
    } catch (e) {
      boolSolveState = (e as Error).toString() as `Error: ${string}`;
      console.warn(e);
    }
  };

  const runUnionDemo = () => {
    try {
      const res = db.exec(
        `SELECT id, name, price, stock FROM union_injection WHERE name LIKE '%${unionSearch}%'`
      );
      if (res.length > 0) {
        unionSearchResult = res[0].values.map((r) => ({
          id: r[0] as number,
          name: r[1] as string,
          price: r[2] as number,
          stock: r[3] as number,
        }));
      } else {
        unionSearchResult = [];
      }
      unionSearchError = "";
    } catch (e) {
      unionSearchError = (e as Error).toString();
      console.warn(e);
    }
  };
</script>

<h2>What is SQL Injection?</h2>

<img src="https://imgs.xkcd.com/comics/exploits_of_a_mom.png" alt="xkcd: exploits of a mom" />
<p>
  Most websites that need to store data often use SQL databases to store their data. When querying
  this database, you often need to include variables. All SQL interfaces provide you a safe way of
  including variables into the query, but sometimes developers will not use these sanitized way of
  including variables.
</p>

<Prism
  lang="js"
  code={`// Safely putting the variable productId into the query
client.query("SELECT product_name, price FROM products WHERE product_id = $1", [productId]);

// Unsafely putting the variable productId into the query by using string interpolation
client.query(\`SELECT product_name, price FROM products WHERE product_id = '\${productId}'';\`);`}
/>

<p>
  If the variables are handled usafely, and you have control over the variables, you are able to
  write your own SQL into the query.
</p>

<Prism
  lang="sql"
  code={`SELECT product_name, price FROM products WHERE product_id = ''
--                                                                  payload
--                                                            |----------------|
 SELECT product_name, price FROM products WHERE product_id = '' AND price = 1 --'`}
/>

<h2>Boolean Based SQL Injection</h2>

<p>
  A boolean based SQL Injection is where you use boolean comparisions to match rows that generally
  wouldn't be matched. For example, using <code>OR 1=1</code> in order to fufill the password requirement,
  without having the password. Try injecting some SQL to pass the following check.
</p>

<div class="py-8 font-sans text-center rounded-md not-tw-prose width-full bg-zinc-800">
  <h1 class="mb-2 text-xl font-bold">Sign Up</h1>
  <input
    type="text"
    placeholder="Username"
    class="px-2 py-1 mb-2 rounded bg-zinc-500 text-zinc-400"
    disabled
    value="admin"
  />
  <br />
  <input
    type="text"
    placeholder="Password"
    class="px-2 py-1 mb-1 rounded bg-zinc-700 placeholder:text-zinc-400"
    bind:value={boolPassword}
  />
  <br />
  <button
    class="px-4 py-1 font-bold bg-purple-700 rounded hover:bg-purple-800 disabled:bg-slate-400 text-zinc-100"
    disabled={!db}
    onclick={runBoolDemo}>Sign Up</button
  >
</div>

<Prism
  lang="sql"
  code={`SELECT * FROM users WHERE username = 'admin' AND password = '${boolPassword}'`}
/>

<button
  class="px-4 py-1 font-bold rounded bg-emerald-700 hover:bg-emerald-800 text-zinc-100"
  onclick={() => (boolPassword = "' OR 1=1; --")}>Solve</button
>
<br />
{#if boolSolveState === "solved"}
  <span class="text-green-500">solved!</span>
{:else if boolSolveState.startsWith("Error: ")}
  <span class="text-red-500">{boolSolveState}</span>
{:else if boolSolveState === "wrong"}
  <span class="text-red-500">wrong!</span>
{/if}

<p>
  Because the database has a user with username admin and 1 = 1, the query selects the admin user
  meaning that the server would log us into the admin account, even though we don't know the admin
  password!
</p>

<h2>Union Attacks</h2>

<p>
  You can get fields from other tables by using the <code>UNION</code> SQL statement to query other
  tables. In the example below, try using <code>UNION</code> in order to get the flag from the table
  called <code>flag</code>. The table consists of one row and one column called flag with the flag
  inside.
</p>

<p>Note that when using <code>UNION</code>, both tables need to have the same number of columns</p>

<div class="py-8 font-sans text-center rounded-md not-tw-prose width-full bg-zinc-800">
  <h1 class="mb-2 text-xl font-bold">Products</h1>
  <input
    type="text"
    placeholder="Search"
    class="w-4/6 px-2 py-1 mb-2 rounded bg-zinc-700 placeholder:text-zinc-400"
    bind:value={unionSearch}
  />
  <button
    class="px-4 py-1 font-bold bg-purple-700 rounded hover:bg-purple-800 disabled:bg-slate-400 text-zinc-100"
    disabled={!db}
    onclick={runUnionDemo}>Search</button
  >
  <table class="w-5/6 m-auto table-auto">
    <thead class="border-b-2 border-zinc-600/75">
      <tr>
        <th>Id</th>
        <th>Name</th>
        <th>Price</th>
        <th>Stock</th>
      </tr>
    </thead>
    <tbody>
      {#each unionSearchResult as product}
        <tr class="even:bg-zinc-700/25">
          <td class="py-1 pr-1 border-r-2 border-zinc-600/75">{product.id}</td>
          <td class="pl-4 text-left">{product.name}</td>
          <td>${product.price}</td>
          <td>{product.stock}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if unionSearchError}
    <span class="text-red-500">{unionSearchError}</span>
  {/if}
</div>

<Prism
  lang="sql"
  code={`SELECT (id, name, price, stock) FROM products WHERE name LIKE '%${unionSearch}%'`}
/>

<button
  class="px-4 py-1 font-bold rounded bg-emerald-700 hover:bg-emerald-800 text-zinc-100"
  onclick={() => (unionSearch = "' UNION SELECT 0, (SELECT flag FROM flag), 0, 0 --")}
  >Solve</button
>

<p hidden={unionSolved}>
  Below is an explaination of how the attack works. If you haven't solved it yet, I encourage you to
  give it a try! If you just want to see the explaination, press the blurry part below.
</p>

<Spoiler shown={unionSolved}>
  This has the same number of columns and type as the products table. When the SQL query is
  executed, it combines our results from the products table with a table with 1 row that has the
  elements 0, the flag, 0, and 0, and when the server gives us our result, we can see the flag
</Spoiler>
