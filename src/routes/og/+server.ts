import satori from "satori";
import { html as toReactNode } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import { join } from "path";
import type { RequestHandler } from "./$types";
import OpenGraph from "$lib/components/OpenGraph.svelte";
import { render } from "svelte/server";

const fontPath = join(process.cwd(), "static/fonts/gambarino/Gambarino-Regular.ttf");
const fontData = readFileSync(fontPath);

const height = 480;
const width = 640;

export const GET: RequestHandler = async () => {
  const result = render(OpenGraph, {});
  console.log(result)
  const element = toReactNode(`${result.body}${result.head}`);
  const html = {
    type: "div",
    props: {
      children: "hello, world",
      style: { color: "red" },
    },
  };
  const svg = await satori(element, {
    fonts: [
      {
        name: "Gambarino",
        data: fontData,
        style: "normal",
      },
    ],
    height,
    width,
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      "content-type": "image/png",
    },
  });
};

export const config = {
  css: "injected"
}