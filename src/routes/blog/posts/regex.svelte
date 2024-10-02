<script context="module">
  export const metadata = {
    title: "how regex works",
    published: "2024-08-22",
    hidden: true,
  };
</script>

<script lang="ts">
  import RegexEditor from "$lib/components/blog/regex/RegexEditor.svelte";
  import CodeBlock from "$lib/components/CodeBlock.svelte";
    import { AlignCenter } from "lucide-svelte";
</script>

<p>
  Regular Expressions are an incredibly powerful tool. Whether its use in text editors or input
  validation, regex is very useful.
</p>
<p>For the uninitiated... (is this nessasary? )</p>
<p>
  While modern Regex engines have fancy bells and whistles like backtracking and capture groups,
  under the formal defintion of "regular expressions," these features do not exist. For that reason
  we will not implement them here.
</p>
<h2>The Building Blocks of Regular Expressions</h2>
<p>There are 4 major building blocks of regular expressions:</p>
<div class="building-blocks">
  <div class="building-block">
    <h3>Literals</h3>
    <div class="example">a</div>
    <p class="description">
      Matches a single character.<br/> Example would match <span class="set">{`{ a }`}</span>
    </p>
  </div>
  <div class="building-block">
    <h3>Concatination</h3>
    <div class="example">AB</div>
    <p class="description">
      Matches the left, then the right. Example would match <span class="set">{`{ AB }`}</span>
    </p>
  </div>
  <div class="building-block">
    <h3>Alternation</h3>
    <div class="example">A|B</div>
    <p class="description">
      Matches the left or the right.<br/> Example would match <span class="set">{`{ A, B }`}</span>
    </p>
  </div>
  <div class="building-block">
    <h3>Kleen Star</h3>
    <div class="example">A*</div>
    <p class="description">
      Matches left 0 or more times. Example would match<br />
      <span class="set">{`{ ε, A, AA, AAA, ... }`}</span>
    </p>
  </div>
</div>

<p>
  Capital letters denote that those symbols could be another regex. For example <code>ab|cd</code> is
  perfectly legal and is a combination of alternation and concatination.
</p>

<p>
  Together with these 4 structures, you can construct any regular expression. Some structures can be
  derived from these base 4. For example <code>A?</code> is the same as <code>A|ε</code> (ε denotes
  an empty string) or <code>A+</code> is the same as <code>AA*</code>.
</p>

<p>Now that we know what structures we have, we can write a parser.</p>

<h2>Writing a Parser</h2>

<p>
  There are many different ways to parse regex. I decided to use a
  <a href="https://en.wikipedia.org/wiki/Recursive_descent_parser">recursive descent parser</a>.
  Another notable algorithm is the one outlined Thompson's 1968 paper. Using the
  <a href="https://en.wikipedia.org/wiki/Shunting_yard_algorithm">shunting yard algorithm</a>, then
  using the postfix output to construct the regular expression.
</p>

<p>
  Recursive descent parsers are pretty simple. We'll build a really simple one before diving into
  the full regex parser. Lets say you wanted to parse a simple expression with only digits, addition,
  and multiplcation, <code>2+3*4</code>, into:
</p>

<CodeBlock
  code={`{
  // op stands for operation
  op: "mul",
  // stands for left hand side
  lhs: {
    op: "add",
    lhs: 2, 
    rhs: 3
  },
  // stands for right hand side
  rhs: 4,
}`}
  lang="ts"
  file=""
/>

<p>Our parser would look something like this:</p>
<CodeBlock
  code={`const str = "2+3*4";
// keep track of what character we are looking at
let i = 0;
const parse = () => {
  return matchAdd();
}

const matchAdd = () => {
  const lhs = matchMul();
  if (str[i] == "+") {
    i += 1;
    const rhs = matchMul();
    return { type: "add", lhs, rhs }
  }

  return lhs;
}

const matchMul = () => {
  const lhs = matchDigit();
  if (str[i] == "*") {
    i += 1;
    const rhs = matchDigit();
    return { type: "mul", lhs, rhs }
  }

  return lhs;
}

const matchDigit = () => {
  if ("0" >= str[i] <= "9") {
    const num = parseInt(str[i]);
    i += 1;
    return num;
  }
  
  throw new Error("Invalid expression")
}`}
  lang="ts"
  file="mathParser.ts"
  maxHeight="20lh"
/>

<RegexEditor regex="cow"></RegexEditor>

<style>
  .building-blocks {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 3.2rem 0;
    gap: 1rem;
    row-gap: 2rem;
  }

  .building-block {
    h3 {
      margin-top: 0;
      text-align: center;
      color: var(--accent-500);
    }

    .example {
      font-size: 4rem;
      font-family: var(--font-mono);
      text-align: center;
      line-height: 1;
      margin-bottom: 1rem;
    }

    .description {
      text-align: center;
    }

    .set {
      font-family: var(--font-mono);
    }
  }
</style>
