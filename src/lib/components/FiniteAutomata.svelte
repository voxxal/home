<script lang="ts">
  import { isAccepting, type FaState, type TraversalTick } from "$lib/regex";
  import { blur } from "svelte/transition";

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
    traversalTick,
  } = $props<{
    nfa: FaState;
    radius?: number;
    width?: number;
    height?: number;
    traversalTick: TraversalTick;
  }>();
  interface TransitionNode {
    c: string;
    from: FaStateNode;
    to: FaStateNode;
    hash: number;
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
      const a = state.id;
      const b = sortedTrans[i][1].id;
      // TODO include information about whether it is curved or not
      transitions.push({
        c: sortedTrans[i][0],
        from: states[state.id],
        to: states[sortedTrans[i][1].id],
        hash: ((a + b) * (a + b + 1)) / 2 + a, // Cantor Pairing Function
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
    const rank = (trans.to.rank + trans.from.rank) / 2;
    // return height;
    if (rank % 1 > 0) {
      const low = Math.floor(rank);
      const high = Math.ceil(rank);
      const count = Math.max(rankCounts[low], rankCounts[high]);
      return targetHeightToControlHeight(trans, ((count - 0.4) / count) * height);
    } else {
      return targetHeightToControlHeight(
        trans,
        ((rankCounts[rank] - 0.4) / rankCounts[rank]) * height,
      );
    }
  };

  const getQuadraticBezierCenterY = (edge1: number, control: number, edge2: number) =>
    0.25 * edge1 + 0.5 * control + 0.25 * edge2;

  // should be good estimate
  const targetHeightToControlHeight = (trans: TransitionNode, targetHeight: number) =>
    2 * targetHeight - 0.5 * statePos(trans.from).y - 0.5 * statePos(trans.to).y;
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

  {#each traversalTick as trav}
    {@const pos = statePos(states[trav.state.id])}
    <circle
      cx={pos.x}
      cy={pos.y}
      r={radius}
      class={trav.accepting ? "fill-green-600/20" : "fill-blue-600/20"}
    />
  {/each}

  {#each states as state}
    {@const { x, y } = statePos(state)}
    <!-- {#key statePos(state).x} -->
    <g transition:blur={{ duration: 200 }}>
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
</svg>
