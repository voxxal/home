<script lang="ts">
  import { isAccepting, type FaState, type NfaHead } from "$lib/regex";
  import { cantor } from "$lib/util";
  import { blur, fade } from "svelte/transition";

  interface Coord {
    rank: number;
    depth: number;
  }

  type FaStateNode = FaState & Coord;
  const {
    nfa,
    radius = 20,
    width = 800,
    height = 400,
    nfaHeads = [],
    tick = 0,
    str = "",
  }: {
    nfa: FaState;
    radius?: number;
    width?: number;
    height?: number;
    nfaHeads: NfaHead[];
    tick: number;
    str: string;
  } = $props();
  interface TransitionNode {
    c: string;
    from: FaStateNode;
    to: FaStateNode;
    hash: number;
    curved: boolean;
  }
  interface DiagramState {
    states: FaStateNode[];
    transitions: TransitionNode[];
    visited: FaState[];
  }
  const convertRec = (state: FaState, cursor: Coord, diagramState: DiagramState) => {
    const { states, transitions, visited } = diagramState;
    if (states[state.id]) return diagramState;

    states[state.id] = Object.assign(state, cursor);
    const sortedTrans = [
      ...state.eTrans.map<[string, FaState]>((x) => ["ε", x]),
      ...Object.entries(state.trans),
    ];
    sortedTrans.sort((a, b) => a[1].id - b[1].id);
    for (let i = 0; i < sortedTrans.length; i++) {
      // TODO determine rank on # of nodes that can branch from it
      // (postponed) i think this works fine it was just the silly bug
      if (!visited.find((s) => s === sortedTrans[i][1])) {
        visited.push(sortedTrans[i][1]);
        convertRec(sortedTrans[i][1], { rank: cursor.rank + 1, depth: -1 }, diagramState);
      }
      const a = state.id;
      const b = sortedTrans[i][1].id;
      // TODO include information about whether it is curved or not
      // this will need to be a seperate pass
      transitions.push({
        c: sortedTrans[i][0],
        from: states[state.id],
        to: states[sortedTrans[i][1].id],
        hash: cantor(a, b),
        curved: false,
      });
    }

    return diagramState;
  };

  const correctDepths = (diagramState: DiagramState) => {
    const statesByRank: FaStateNode[][] = [];
    for (const state of diagramState.states) {
      statesByRank[state.rank] ??= [];
      statesByRank[state.rank].push(state);
    }

    for (const rank of statesByRank) {
      if (!rank) continue;
      rank.sort((a, b) => a.id - b.id);
      for (let i = 0; i < rank.length; i++) rank[i].depth = i;
    }
  };

  const convert = (state: FaState) => {
    const diagramState = convertRec(
      state,
      { rank: 0, depth: 0 },
      { states: [], transitions: [], visited: [state] },
    );
    correctDepths(diagramState);
    diagramState.transitions.sort((a, b) => a.from.id - b.from.id);
    return diagramState;
  };

  const { states, transitions }: DiagramState = $derived(convert(nfa));
  const rankCounts = $derived.by(() => {
    const counts: number[] = [];
    for (const state of states) {
      counts[state.rank] ??= 0;
      counts[state.rank] += 1;
    }
    return counts;
  });

  const statePos = (state: { rank: number; depth: number }) => ({
    x: state.rank * 80 + radius + 2,
    y: ((state.depth + 1) / (1 + rankCounts[state.rank])) * height,
  });
  const controlHeight = (trans: TransitionNode) => {
    const left = Math.min(trans.to.rank, trans.from.rank);
    const right = Math.max(trans.to.rank, trans.from.rank);
    const count = Math.max(...rankCounts.slice(left, right));
    return targetHeightToControlHeight(trans, ((count - 0.4) / count) * height);

    // const rank = (trans.to.rank + trans.from.rank) / 2;
    // // return height;
    // if (rank % 1 > 0) {
    //   const count = Math.max(...rankCounts.slice(trans.to.rank, trans.from.rank))
    //   return targetHeightToControlHeight(trans, ((count - 0.4) / count) * height);
    // } else {
    //   return targetHeightToControlHeight(
    //     trans,
    //     ((rankCounts[rank] - 0.4) / rankCounts[rank]) * height,
    //   );
    // }
  };

  const getQuadraticBezierCenterY = (edge1: number, control: number, edge2: number) =>
    0.25 * edge1 + 0.5 * control + 0.25 * edge2;

  // should be good estimate
  const targetHeightToControlHeight = (trans: TransitionNode, targetHeight: number) =>
    2 * targetHeight - 0.5 * statePos(trans.from).y - 0.5 * statePos(trans.to).y;
  // TODO (c|a)* causes weird case as well, thinking cross depth with a horizontal check
  // TODO modify to check for diagonal overlap happens with a*b*c*d*
  const checkForOverlapStraight = (trans: TransitionNode) => {
    if (statePos(trans.from).y !== statePos(trans.to).y) return false;
    const stateHeight = statePos(trans.from).y;
    for (
      let i = Math.min(trans.from.rank, trans.to.rank) + 1;
      i < Math.max(trans.from.rank, trans.to.rank);
      i++
    ) {
      for (let d = 0; d < rankCounts[i]; d++) {
        if (Math.abs(statePos({ rank: i, depth: d }).y - stateHeight) < 25) {
          return true;
        }
      }
    }
  };

  const heads = $derived.by(() => {
    const currentTickHeads = nfaHeads.flatMap(({ start, path }) =>
      tick >= start && tick < start + path.length ? [path[tick - start]] : [],
    );

    const map: Record<
      number,
      {
        state: FaState;
        i: number;
      }
    > = {};
    for (const h of currentTickHeads) {
      const { state, i } = h;
      map[cantor(state.id, i)] = h;
    }

    return Object.values(map);
  });
  let hover: { state: FaState; i: number } | null = $state(null);
  let mouse = $state({ x: 0, y: 0 });

  $effect(() => {
    console.log("states", states);
    console.log("transitions", transitions);
    console.log("rank counts", rankCounts);
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
  viewBox="0 0 {width} {height}"
  {width}
  {height}
  onmousemove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }}
>
  <defs>
    <marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="5"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      fill="white"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" />
    </marker>
  </defs>

  {#each heads as { state, i }}
    {@const pos = statePos(states[state.id])}
    <circle
      cx={pos.x}
      cy={pos.y}
      r={radius}
      class={isAccepting(state) ? "fill-green-600/20" : "fill-blue-600/20"}
      onmouseover={() => (hover = { state, i })}
      onmouseleave={() => (hover = null)}
      onfocus={() => {}}
    />
  {/each}

  {#each states as state}
    {@const { x, y } = statePos(state)}
    <!-- {#key statePos(state).x} -->
    <g transition:blur={{ duration: 200 }} class="pointer-events-none">
      <circle cx={x} cy={y} r={radius} fill="transparent" stroke="white" stroke-width={2} />
      {#if isAccepting(state)}
        <circle
          cx={x}
          cy={y}
          r={radius - 4}
          fill="transparent"
          stroke="white"
          stroke-width={2}
          transition:blur={{ duration: 200 }}
        />
      {/if}
      <text {x} {y} fill="white" dominant-baseline="central" text-anchor="middle">
        {state.id}
      </text>
    </g>
    <!-- {/key} -->
  {/each}
  {#each transitions as trans, i}
    {@const fromPos = statePos(trans.from)}
    {@const toPos = statePos(trans.to)}

    <g transition:blur={{ duration: 200 }}>
      <!-- TODO check if depth & rank count are equal and if there are any ranks with odd rank count in between. -->
      {#if transitions
        .slice(0, i)
        .find((t) => t.hash === trans.hash) || checkForOverlapStraight(trans)}
        {@const midRank = (trans.to.rank + trans.from.rank) / 2}
        {@const controlPos = { x: midRank * 80 + radius + 2, y: controlHeight(trans) }}
        {@const fromAngle = Math.atan2(controlPos.y - fromPos.y, controlPos.x - fromPos.x)}

        {@const toAngle = Math.atan2(controlPos.y - toPos.y, controlPos.x - toPos.x)}
        <!-- {@const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x)} -->
        {@const fromEdge = {
          x: fromPos.x + Math.cos(fromAngle) * (radius + 3),
          y: fromPos.y + Math.sin(fromAngle) * (radius + 3),
        }}
        {@const toEdge = {
          x: toPos.x + Math.cos(toAngle) * (radius + 6),
          y: toPos.y + Math.sin(toAngle) * (radius + 6),
        }}

        <path
          d="M {fromEdge.x} {fromEdge.y} Q {controlPos.x} {controlPos.y}, {toEdge.x} {toEdge.y}"
          stroke="white"
          fill="transparent"
          marker-end="url(#arrow)"
          data-identifier="FROM: {trans.from.id}, TO: {trans.to.id}"
        />
        {@const textY = getQuadraticBezierCenterY(fromEdge.y, controlPos.y, toEdge.y)}
        <text
          x={controlPos.x}
          y={textY + 15}
          font-size={16}
          fill="white"
          dominant-baseline="central"
          text-anchor="middle"
        >
          {trans.c}
        </text>
      {:else}
        {@const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x)}
        {@const fromEdge = {
          x: fromPos.x + Math.cos(angle) * (radius + 3),
          y: fromPos.y + Math.sin(angle) * (radius + 3),
        }}
        {@const toEdge = {
          x: toPos.x + Math.cos(Math.PI + angle) * (radius + 6),
          y: toPos.y + Math.sin(Math.PI + angle) * (radius + 6),
        }}
        {@const midpoint = { x: (toEdge.x + fromEdge.x) / 2, y: (toEdge.y + fromEdge.y) / 2 }}
        <line
          x1={fromEdge.x}
          y1={fromEdge.y}
          x2={toEdge.x}
          y2={toEdge.y}
          stroke="white"
          marker-end="url(#arrow)"
        />
        <text
          x={midpoint.x}
          y={midpoint.y - 20}
          font-size={16}
          fill="white"
          dominant-baseline="central"
          text-anchor="middle"
        >
          {trans.c}
        </text>
      {/if}
    </g>
  {/each}

  {#if hover}
    <!-- TODO recalculate CH -->
    {@const ch = 8}
    {@const textLeft = Math.max(mouse.x - (str.length / 2) * ch, 8)}
    <g transition:fade={{ duration: 100 }}>
      <rect
        fill="white"
        x={textLeft - 8}
        y={mouse.y - 36}
        height={32}
        width={str.length * ch + 16}
        class="font-mono"
      >
      </rect>
      <text
        x={textLeft}
        y={mouse.y - 28}
        font-size={16}
        class="font-mono pointer-events-none"
        fill="black"
        dominant-baseline="hanging"
      >
        {str}
      </text>

      <rect
        fill={isAccepting(hover.state) && hover.i === str.length ? "#080" : "#000"}
        x={textLeft - 4}
        y={mouse.y - 28 - 4}
        height={16 + 8}
        width={hover.i * ch +
          4 +
          +(hover.i === str.length && str.length) * 4 +
          +(hover.i === 0) * -4}
      >
      </rect>

      <text
        x={textLeft}
        y={mouse.y - 28}
        font-size={16}
        class="font-mono pointer-events-none"
        fill="white"
        dominant-baseline="hanging"
      >
        {str.substring(0, hover.i)}
      </text>
    </g>
  {/if}
</svg>
