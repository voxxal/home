// ==UserScript==
// @name         CommonApp Grade Importer
// @namespace    https://voxal.dev/blog/capp-grade-importer
// @version      1
// @description  Imports grades from Aeries for use in common app. FOR CANYON CREST ACADEMY USAGE ONLY.
// @author       Aiden Shi
// @match        https://apply.commonapp.org/common/*
// @grant        none
// ==/UserScript==

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const selectFrom = async (selector, option, exact = false, timeout = 200) => {
  const select =
    selector instanceof HTMLElement ? selector : document.querySelector(`${selector} mat-select`);
  if (exact && select.innerText === option) return false;
  select.click();
  await sleep(200);
  const options = [...document.querySelectorAll("mat-option")];
  options.find((x) => (exact ? x.innerText === option : x.innerText.includes(option)))?.click();
};

const fireChangeEvents = (element) => {
  var changeEvent = null;
  changeEvent = document.createEvent("HTMLEvents");
  changeEvent.initEvent("input", true, true);
  element.dispatchEvent(changeEvent);
  changeEvent = document.createEvent("HTMLEvents");
  changeEvent.initEvent("keyup", true, true);
  element.dispatchEvent(changeEvent);
  changeEvent = document.createEvent("HTMLEvents");
  changeEvent.initEvent("change", true, true);
  element.dispatchEvent(changeEvent);
};

const putInput = (input, value) => {
  input.focus();
  input.click();
  input.value = value;
  fireChangeEvents(input);
};

const fillGrade = async (year, data, details) => {
  const titles = [...document.querySelectorAll(".accordion-header__title")];
  const accordElement = titles.find((x) => x.innerText.includes(`${data.grade}th Grade`));
  console.log(accordElement);
  if (accordElement.parentElement.parentElement.ariaExpanded !== "true") {
    accordElement.click();
    await sleep(1500);
  }

  const btn = document.getElementById("addCG");
  btn.click();

  await sleep(1000);

  await selectFrom(".transcript__school", "Canyon Crest Academy", true);

  await selectFrom(".transcript__year", year, true);

  await selectFrom(".transcript__scale", "A-F", true);

  await selectFrom(".transcript__schedule", "Semesters", true);

  let courseBoxes = [...document.querySelectorAll("ca-cng-course")];
  const courses = Object.values(data.courses);
  if (courseBoxes.length < courses.length) {
    for (let i = 0; i < courses.length - courseBoxes.length; i++) {
      const btn = document.querySelector("ca-cng-course + .action-bar .button--primary");
      btn.click();
      await sleep(100);
    }

    courseBoxes = [...document.querySelectorAll("ca-cng-course")];
  }

  const zipped = courses.map((x, i) => [x, courseBoxes[i]]);

  for (const i in zipped) {
    const [course, box] = zipped[i];
    box.id = `course-box-${i}`;

    const title = course.title;
    const sub = async (t, exact = false) =>
      await selectFrom(`#${box.id} .course__subject`, t, exact);
    if (
      title.includes("Chinese") ||
      title.includes("French") ||
      title.includes("Spanish") ||
      title.includes("Japanese")
    )
      await sub("Foreign/World Language", true);
    else if (title.includes("PE") || title.includes("Walking") || title.includes("Training"))
      await sub("Physical Education/Health", true);
    else if (title.includes("English") || title.includes("Lang")) await sub("English", true);
    else if (title.includes("AP Calculus")) await sub("Calculus", true);
    else if (title.includes("Calculus")) await sub("Pre-Calculus", true);
    else if (title.includes("Math 1")) await sub("Algebra", true);
    else if (title.includes("Math 2")) await sub("Geometry", true);
    else if (title.includes("Math 3")) await sub("Trigonometry", true);
    else if (title.includes("Comp")) await sub("Computer Science", true);
    else if (title.includes("History")) await sub("History/Social Science", true);
    else if (title.includes("Physics")) await sub("Physics", true);
    else if (title.includes("Chem")) await sub("Chemistry", true);
    else if (title.includes("Bio")) await sub("Biology", true);
    else if (
      title.includes("Art") ||
      title.includes("Video") ||
      title.includes("Draw") ||
      title.includes("EVA") ||
      title.includes("Sculpt")
    )
      await sub("Art (Visual or Performing)", true);
    else if (title.includes("Psych")) await sub("Science (Other)", true);

    putInput(box.querySelector(".course__info input[maxlength='100']"), title);

    if (title.includes("AP"))
      await selectFrom(`#${box.id} .course__level`, "Advanced Placement (AP)", true);
    else if (title.includes("Hon") || title.includes("HP"))
      await selectFrom(`#${box.id} .course__level`, "Honors", true);
    else await selectFrom(`#${box.id} .course__level`, "Regular/Standard", true);

    const markSelects = box.querySelectorAll(".course__grades mat-select");

    // in case its a pass fail class
    if (course.marks[0] === "P" || course.marks[1] === "P") {
      const sfx = " - (Pass/Fail)";
      await selectFrom(markSelects[0], (course.marks[0] === "P" ? "Pass" : "Fail") + sfx, true);
      await sleep(200);
      await selectFrom(markSelects[1], (course.marks[1] === "P" ? "Pass" : "Fail") + sfx, true);
    } else {
      await selectFrom(markSelects[0], course.marks[0], true);
      await sleep(200);
      await selectFrom(markSelects[1], course.marks[1], true);
    }

    const creditInputs = box.querySelectorAll(".course__credits input");
    putInput(creditInputs[0], course.credits[0]);
    await sleep(200);
    putInput(creditInputs[1], course.credits[1]);
    await sleep(200);
    putInput(creditInputs[2], course.credits[0] + course.credits[1]);

    if (creditInputs[3].checked) creditInputs[3].click();
  }
};

const populateButtons = (details) => {
  window.details = details;
  const btnParent = document.getElementById("cagi-buttons");
  btnParent.innerHTML = "";
  for (const [year, data] of Object.entries(details)) {
    const [y1, y2] = year.split("-");
    const correctedYear = `${y1}-${y2.substring(2)}`;
    const btn = document.createElement("button");
    btn.innerText = `Fill in ${data.grade}th Grade`;
    btn.onclick = () => fillGrade(correctedYear, data);
    btnParent.appendChild(btn);
    const br = document.createElement("br");
    btnParent.appendChild(br);
  }
};

(() => {
  "use strict";
  console.log("hello world");
  let details = null;
  const div = document.createElement("div");
  div.innerHTML = `
    <h2>CommonApp Grade Importer</h2>
    <div id="cagi-buttons" style="margin-top: 1rem;"></div>
    `;
  div.style = "position: fixed; bottom: 2rem; left: 2rem; background: white; padding: 1rem;";
  div.id = "cagi";
  const btn = document.createElement("button");
  btn.innerHTML = "Import Grades";
  btn.onclick = () => {
    details = JSON.parse(atob(prompt("Paste from clipboard.")));
    if (details) populateButtons(details);
  };
  div.appendChild(btn);
  document.body.appendChild(div);
})();

const id = setInterval(() => {
  try {
    if (document.getElementById("scrnTitle").innerText !== "Courses & Grades")
      document.getElementById("cagi").style.display = "none";
    else document.getElementById("cagi").style.display = "block";
  } catch (e) {
    document.getElementById("cagi").style.display = "none";
  }
}, 500);
