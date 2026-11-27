// The Oz Ledger — router and boot.
// Hash routes only: #/ , #/population, #/economy, #/jobs, #/prices,
// #/regions, #/sources. The nav is built from data.js so the header and the
// views can never disagree about the routes.

import { NAV, SITE } from "./data.js";
import { renderRoute, bind } from "./views.js";

const view = document.getElementById("view");
const nav = document.getElementById("nav");

nav.innerHTML = NAV.map((n) =>
  `<a href="${n.hash}" data-route="${n.hash.slice(2) || "/"}">${n.label}</a>`).join("");

function pathFromHash() {
  const h = window.location.hash || "#/";
  const p = h.slice(1).split("?")[0];
  return p.startsWith("/") ? p : "/" + p;
}

function render(keepSearchFocus = false) {
  const path = pathFromHash();
  view.innerHTML = renderRoute(path);
  const label = (NAV.find((n) => n.hash === "#" + path) || NAV[0]).label;
  document.title = `${label} — ${SITE.name}`;
  nav.querySelectorAll("a").forEach((a) => {
    const on = a.dataset.route === path;
    a.classList.toggle("on", on);
    if (on) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  // A re-render triggered by typing in a search box must not yank the page
  // back to the top; only a real navigation does that.
  if (!keepSearchFocus) window.scrollTo(0, 0);
  if (keepSearchFocus) {
    const input = document.getElementById("region-search");
    if (input) {
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }
}

bind(view, (keepFocus) => render(keepFocus));
window.addEventListener("hashchange", () => render());
render();
