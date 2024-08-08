<script lang="ts">
  import { isAccepting, type FaState } from "$lib/regex";
  import { fade } from "svelte/transition";

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
  }: { nfa: FaState; radius?: number; width?: number; height?: number } = $props();
  interface TransitionNode {
    c: string;
    from: FaStateNode;
    to: FaStateNode;
  }
  interface DiagramState {
    states: FaStateNode[];
    transitions: TransitionNode[];
    visited: FaState[];
  }
  const convertRec = (state: FaState, cursor: Coord, diagramState: DiagramState) => {
    const { states, transitions, visited } = diagramState;

    states[state.id] = Object.assign(state, cursor);
    const sortedTrans = [
      ...state.eTrans.map<[string, FaState]>((x) => ["ε", x]),
      ...Object.entries(state.trans),
    ];
    sortedTrans.sort((a, b) => a[1].id - b[1].id);
    for (let i = 0; i < sortedTrans.length; i++) {
      // TODO determine rank on # of nodes that can branch from it
      if (!visited.find((s) => s === sortedTrans[i][1])) {
        visited.push(sortedTrans[i][1]);
        convertRec(sortedTrans[i][1], { rank: cursor.rank + 1, depth: -1 }, diagramState);
      }
      transitions.push({
        c: sortedTrans[i][0],
        from: states[state.id],
        to: states[sortedTrans[i][1].id],
      });
    }

    return diagramState;
  };

  const correctDepths = (diagramState: DiagramState) => {
    const statesByRank: FaStateNode[][] = [];
    for (const state of diagramState.states) {
      console.log(diagramState.states);
      statesByRank[state.rank] ??= [];
      statesByRank[state.rank].push(state);
    }

    for (const rank of statesByRank) {
      if (!rank) continue;
      rank.sort();
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

  const statePos = (state: FaStateNode) => ({
    x: state.rank * 80 + radius + 2,
    y: (height / (1 + rankCounts[state.rank])) * (state.depth + 1),
  });

  $effect(() => {
    console.log("states", states);
    console.log("transitions", transitions);
    console.log("rank counts", rankCounts);
  });
</script>

<svg viewBox="0 0 {width} {height}" {width} {height}>
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

  {#each states as state}
    {@const { x, y } = statePos(state)}
    {#key state.id}
      <g in:fade={{ duration: 150 }} out:fade={{ duration: 150 }}>
        <circle cx={x} cy={y} r={radius} fill="transparent" stroke="white" stroke-width={2} />
        {#if isAccepting(state)}
          <circle cx={x} cy={y} r={radius - 4} fill="transparent" stroke="white" stroke-width={2} />
        {/if}
        <text {x} {y} fill="white" dominant-baseline="central" text-anchor="middle">
          {state.id}
        </text>
      </g>
    {/key}
  {/each}

  {#each transitions as trans}
    {@const fromPos = statePos(trans.from)}
    {@const toPos = statePos(trans.to)}
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
  {/each}
</svg>
