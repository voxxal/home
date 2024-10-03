// ==UserScript==
// @name         Aeries Grade Exporter
// @namespace    https://voxal.dev/blog/capp-grade-importer
// @version      1
// @description  Exports grades from Aeries for use in common app. FOR CANYON CREST ACADEMY USAGE ONLY.
// @author       Aiden Shi
// @match        https://sandieguito.aeries.net/student/Transcripts.aspx
// @grant        none
// ==/UserScript==

(() => {
  "use strict";
  console.log("hello world");
  const main = async (e) => {
    e.preventDefault();
    const table = document.querySelector(".CourseHistory tbody");
    const result = {};
    let current = null;
    for (const row of table.children) {
      if (row.id.includes("trSectionTitle")) {
        const header = row.querySelector(".SectionHeader").innerText;
        const [year, _sep1, schoolName, _sep2, grade, _sep3, term] = header.split(/( \| |\n)/);
        if (schoolName.toLowerCase() != "Canyon Crest Academy".toLowerCase()) continue;
        current = { year, term };
        result[year] ??= { grade: +grade.substring("Grade ".length), courses: {} };
      } else if (row.id.includes("trSectionSpacer")) {
        current = null;
      } else if (row.id.includes("ReadRow1")) {
        if (current == null) continue;
        const [_null, _scId, yr, _mbQtr, grade, courseId, title, rt, cp, nh, mark, credMax, cred] =
          row.innerText.split("\t");
        result[current.year].courses[courseId] ??= { title, marks: [], credits: [] };
        result[current.year].courses[courseId].marks.push(mark[0]);
        result[current.year].courses[courseId].credits.push(parseInt(cred[0]));
      }
    }
    console.log(result);
    navigator.clipboard
      .writeText(btoa(JSON.stringify(result)))
      .then(() => alert("Copied to clipboard!"));
  };
  const div = document.createElement("div");
  div.innerHTML = `<h2>CommonApp Grade Importer</h2>`;
  div.style =
    "position: fixed; bottom: 2rem; left: 2rem; background: white; padding: 1rem; z-index: 1000";
  div.id = "cagi";
  const btn = document.createElement("button");
  btn.onclick = main;
  btn.innerHTML = "Export Grades";
  div.appendChild(btn);
  document.body.appendChild(div);
})();
