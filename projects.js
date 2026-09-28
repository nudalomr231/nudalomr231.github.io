"use strict";

/*
  HOW TO ADD A PROJECT

  1. Copy one complete project object inside the projects array.
  2. Paste the copy after another project and separate the objects with a comma.
  3. Give the project a unique lowercase id using letters, numbers, or hyphens.
  4. Set category to "cybersecurity", "it", or "other".
  5. Change the title, summary, technologies, phases, and links.
  6. Set featured to true to show the project on the Home page.
  7. Leave a documentation or video value empty when that link is not ready.
  8. Never place passwords, API keys, private credentials, or sensitive data here.

  The renderer creates the HTML safely and applies the shared classes from styles.css.
  You should not need to edit index.html or styles.css when adding a normal project.
*/

const projects = [
  {
    id: "active-directory-lab",
    category: "it",
    featured: true,
    title: "Active Directory Practice Lab",
    summary: "A complete Windows domain environment for identity, policy, support, and administration practice.",
    technologies: "Windows Server 2022, Windows 11, Hyper-V, Active Directory, DNS, PowerShell, RSAT, and administrative delegation.",
    phases: [
      { title: "Planning and environment design", description: "Defined the domain, network, virtual machines, naming standards, and intended administrative model.", documentation: "", video: "" },
      { title: "Domain services and DNS", description: "Built the domain controller, configured internal DNS, and validated directory and name-resolution services.", documentation: "", video: "" },
      { title: "Users, groups, and delegation", description: "Created the workforce structure, security groups, manager relationships, and least-privilege model.", documentation: "", video: "" },
      { title: "Client onboarding and verification", description: "Joined client systems, tested standard-user access, verified administration, and documented results.", documentation: "", video: "" }
    ]
  },
  {
    id: "project-playbook",
    category: "cybersecurity",
    featured: true,
    title: "Project Playbook",
    summary: "A cybersecurity education platform built around practical guidance, structured lessons, and incident readiness.",
    technologies: "A practical cybersecurity education project designed for clear learning, organizational readiness, and incident guidance.",
    phases: [
      { title: "Research and product planning", description: "Defined the audience, information architecture, lesson standards, and project requirements.", documentation: "", video: "" },
      { title: "Learning experience design", description: "Developed practical lesson structures and role-aware learning experiences for nontechnical users.", documentation: "", video: "" },
      { title: "Application development", description: "Implemented the interface, content system, playbook experience, and organizational features.", documentation: "", video: "" }
    ]
  },
  {
    id: "security-operations-lab",
    category: "cybersecurity",
    featured: true,
    title: "Security Operations Lab",
    summary: "A developing environment for log collection, alert investigation, documentation, and response practice.",
    technologies: "A hands-on environment for practicing visibility, investigation, evidence handling, and incident communication.",
    phases: [
      { title: "Architecture and telemetry", description: "Planned monitored systems, log sources, network placement, and baseline activity.", documentation: "", video: "" },
      { title: "Detection and investigation", description: "Built a process for validating alerts, enriching indicators, and documenting analyst decisions.", documentation: "", video: "" }
    ]
  }
];

const categoryNames = { cybersecurity: "Cybersecurity", it: "Information Technology", other: "Other" };
const views = [...document.querySelectorAll(".view")];
const navLinks = [...document.querySelectorAll(".nav a")];
const categoryButtons = [...document.querySelectorAll(".category")];
const categoryStatus = document.querySelector("#category-status");
const projectLibrary = document.querySelector("#project-library");
const featuredProjects = document.querySelector("#featured-projects");

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function safeUrl(value) {
  if (!value || typeof value !== "string") return null;
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function makeResourceLink(label, value) {
  const url = safeUrl(value);
  if (!url) {
    const unavailable = element("span", "disabled", label);
    unavailable.setAttribute("aria-disabled", "true");
    unavailable.title = label + " link has not been added yet";
    return unavailable;
  }

  const link = element("a", "", label);
  link.href = url;
  if (new URL(url).origin !== window.location.origin) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  return link;
}

function showView(name, updateHistory = true) {
  const validName = views.some((view) => view.id === name) ? name : "home";
  views.forEach((view) => view.classList.toggle("active", view.id === validName));
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.view === validName));
  if (updateHistory) history.pushState(null, "", "#" + validName);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createPhase(phase, index) {
  const details = element("details", "phase");
  if (index === 0) details.open = true;
  const summary = document.createElement("summary");
  summary.append(element("span", "phase-no", String(index + 1).padStart(2, "0")), element("span", "phase-title", phase.title));
  const body = element("div", "phase-body");
  body.append(element("p", "", phase.description));
  const actions = element("div", "phase-actions");
  actions.append(makeResourceLink("Documentation", phase.documentation), makeResourceLink("Video", phase.video));
  body.append(actions);
  details.append(summary, body);
  return details;
}

function createProject(project, index) {
  const article = element("article", "project");
  article.id = "project-" + project.id;
  article.dataset.category = project.category;
  article.hidden = true;
  const information = document.createElement("div");
  information.append(element("p", "kicker", "Project " + String(index + 1).padStart(2, "0")), element("h2", "", project.title), element("p", "", project.technologies));
  const phases = element("div", "phases");
  project.phases.forEach((phase, phaseIndex) => phases.append(createPhase(phase, phaseIndex)));
  article.append(information, phases);
  return article;
}

function renderProjectLibrary() {
  projectLibrary.replaceChildren();
  projects.forEach((project, index) => projectLibrary.append(createProject(project, index)));
}

function renderFeaturedProjects() {
  featuredProjects.replaceChildren();
  projects.filter((project) => project.featured).forEach((project, index) => {
    const button = element("button", "project-row open-project");
    button.type = "button";
    button.dataset.project = project.id;
    button.dataset.category = project.category;
    button.append(element("span", "num", String(index + 1).padStart(2, "0")), element("h3", "", project.title), element("p", "", project.summary), element("span", "open", "View phases"));
    button.addEventListener("click", () => {
      showView("projects");
      selectCategory(project.category);
      requestAnimationFrame(() => document.querySelector("#project-" + project.id)?.scrollIntoView({ behavior: "smooth" }));
    });
    featuredProjects.append(button);
  });
}

function selectCategory(name) {
  const projectElements = [...projectLibrary.querySelectorAll(".project")];
  let count = 0;
  categoryButtons.forEach((button) => {
    const active = button.dataset.category === name;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  projectElements.forEach((project) => {
    const visible = project.dataset.category === name;
    project.hidden = !visible;
    if (visible) count += 1;
  });

  if (!name) categoryStatus.textContent = "Choose a category above to browse projects.";
  else if (count) categoryStatus.textContent = count + " project" + (count === 1 ? "" : "s") + " in " + categoryNames[name] + ".";
  else categoryStatus.textContent = "No projects have been added to this category yet.";
}

renderProjectLibrary();
renderFeaturedProjects();
categoryButtons.forEach((button) => button.addEventListener("click", () => selectCategory(button.dataset.category)));
document.querySelectorAll(".route").forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  showView(link.dataset.view);
  if (link.dataset.view === "projects") selectCategory(null);
}));
document.querySelectorAll(".placeholder").forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));
window.addEventListener("popstate", () => showView(window.location.hash.slice(1) || "home", false));
showView(window.location.hash.slice(1) || "home", false);
selectCategory(null);

