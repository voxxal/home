import { html, render } from "https://unpkg.com/lit-html?module";

const footers = [
  html`
  <p class="footer-text">Made with 
    <span class="stardust-text">${"stardust"
      .split("")
      .map(
        (c, i) =>
          html`<span style="--i:${i}" class="stardust-letter">${c}</span>`
      )}
    <span>
  </p>`,
  html`
  <p class="footer-text">Made with <span class="love-text">❤️ Love</span></p>
  `
];

const footer = document.getElementById("footer");

render(footers[0], footer);
