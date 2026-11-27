// The Oz Ledger — page views.
// One render function per route. Controls are wired by bind(): every button,
// toggle and search box on the page does something real, and re-renders only
// the part of the page it changes.

import {
  POPULATION, STATES, CITIES, ECONOMY, JOBS, PRICES, SOURCES,
  STATES_POP_SOURCE, STATES_UNEMP_SOURCE, STATES_AREA_SOURCE, CITIES_SOURCE,
  fmtInt,
} from "./data.js";
import { barChart, columnChart, lineChart, donut } from "./charts.js";

export const state = {
  gdpMode: "total",        // overview + economy GDP chart: "total" | "percapita"
  birthMode: "people",     // population birthplace chart: "people" | "share"
  jobsOrder: "desc",       // jobs state chart: "desc" | "asc"
  regionCode: "NSW",       // regions page: selected state
  regionQuery: "",
  popQuery: "",
  popSort: { key: "pop", dir: -1 },
  citySort: { key: "annual", dir: -1 },
};

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function srcLine(text) {
  return `<p class="src">Source: ${esc(text)}</p>`;
}

function statCard(value, label, note, href) {
  const inner = `<div class="stat-value">${value}</div><div class="stat-label">${label}</div><div class="stat-note">${note}</div>`;
  return href
    ? `<a class="card stat" href="${href}">${inner}<span class="card-link">See more →</span></a>`
    : `<div class="card stat">${inner}</div>`;
}

function toggleButtons(group, options, current) {
  return `<div class="toggle" role="group" aria-label="${esc(group)}">` +
    options.map(([v, l]) =>
      `<button type="button" data-action="toggle" data-group="${esc(group)}" data-value="${esc(v)}" class="${v === current ? "on" : ""}" aria-pressed="${v === current}">${esc(l)}</button>`
    ).join("") + `</div>`;
}

// ---------------------------------------------------------------- overview

export function renderOverview() {
  const gdpSeries = ECONOMY.annualGrowth.map((d) => ({
    label: d.year.replace("20", "’"),
    value: state.gdpMode === "total" ? d.gdp : d.perCapita,
  }));
  const gdpTitle = state.gdpMode === "total"
    ? "Real GDP growth, % a year"
    : "Real GDP per person, % a year";
  const top3 = [...STATES].sort((a, b) => b.pop - a.pop).slice(0, 3);
  return `
  <section class="hero">
    <p class="kicker">A national statistics site · Australia</p>
    <h1>Australia, in numbers.</h1>
    <p class="lede">One country, counted properly. Population, the economy, jobs, prices and
    the states — each figure checked against the publication it came from, and
    dated so you can see how fresh it is.</p>
    <p class="updated">Latest figures run to the ABS releases of late 2025. ${esc("Every figure shows its source.")}</p>
  </section>

  <section class="grid4" aria-label="Headline figures">
    ${statCard("27.61m", "People", "Estimated resident population, 30 June 2025", "#/population")}
    ${statCard("+2.1%", "GDP, year to Sep 2025", "Real GDP grew 0.4% in the September quarter", "#/economy")}
    ${statCard("4.3%", "Unemployment", "October 2025, seasonally adjusted", "#/jobs")}
    ${statCard("3.2%", "Inflation (CPI)", "Year to September quarter 2025", "#/prices")}
  </section>

  <section class="card">
    <div class="card-head">
      <h2>The economy at a glance</h2>
      ${toggleButtons("gdpMode", [["total", "Total GDP"], ["percapita", "Per person"]], state.gdpMode)}
    </div>
    <p class="chart-title">${gdpTitle}</p>
    <div id="gdp-chart">${columnChart(gdpSeries, { format: (v) => v.toFixed(1) + "%" })}</div>
    <p class="note">Growth slowed after the post-pandemic rebound: 1.4% in 2024–25, and
    GDP per person actually fell 0.3% that year as population growth outran output.</p>
    ${srcLine(ECONOMY.annualGrowthSource)}
  </section>

  <section class="split">
    <div class="card">
      <h2>Where the people are</h2>
      <ol class="ranked">
        ${top3.map((s) => `<li><span>${esc(s.name)}</span><strong>${fmtInt(s.pop)}</strong></li>`).join("")}
      </ol>
      <p class="note">New South Wales, Victoria and Queensland hold 21.3 million people —
      more than three in four Australians.</p>
      <a class="btn" href="#/regions">All eight states &amp; territories →</a>
    </div>
    <div class="card">
      <h2>This quarter, in one paragraph</h2>
      <p>In the September quarter 2025 the economy grew 0.4% and 2.1% over the year,
      while inflation jumped back to 3.2% — above the Reserve Bank's 2–3% target —
      mostly because state electricity rebates rolled off. Jobs kept growing
      (unemployment 4.3% in October) and the population reached 27.61 million,
      adding 420,100 people in the year to June 2025, three-quarters of them
      through migration.</p>
      <a class="btn" href="#/sources">How we count things →</a>
    </div>
  </section>

  <section class="card">
    <h2>Latest releases used here</h2>
    <ul class="releases">
      <li><strong>13 Nov 2025</strong> — Labour Force, Australia, October 2025 (ABS)</li>
      <li><strong>3 Dec 2025</strong> — Australian National Accounts, September 2025 (ABS)</li>
      <li><strong>18 Dec 2025</strong> — National, state and territory population, June 2025 (ABS)</li>
      <li><strong>29 Oct 2025</strong> — Consumer Price Index, September Quarter 2025 (ABS)</li>
      <li><strong>Nov 2025</strong> — Statement on Monetary Policy (Reserve Bank of Australia)</li>
    </ul>
  </section>`;
}

// -------------------------------------------------------------- population

function popTableRows() {
  let rows = [...STATES];
  const q = state.popQuery.trim().toLowerCase();
  if (q) rows = rows.filter((s) => (s.name + " " + s.capital + " " + s.code).toLowerCase().includes(q));
  const k = state.popSort.key, d = state.popSort.dir;
  rows.sort((a, b) => {
    if (k === "name") return d * a.name.localeCompare(b.name);
    return d * (a[k] - b[k]);
  });
  if (!rows.length) return `<tr><td colspan="4" class="empty">No state matches “${esc(state.popQuery)}”.</td></tr>`;
  return rows.map((s) => `<tr>
    <td><strong>${esc(s.name)}</strong><br><span class="sub">Capital ${esc(s.capital)}</span></td>
    <td class="num">${fmtInt(s.pop)}</td>
    <td class="num">+${s.growthPct.toFixed(1)}%</td>
    <td class="num">+${fmtInt(s.growthPeople)}</td>
  </tr>`).join("");
}

export function renderPopulation() {
  const hist = POPULATION.history.map((d) => ({ label: String(d.year), value: d.pop / 1000000 }));
  const birth = POPULATION.birthplaces.map((b) => ({
    label: b.place,
    value: state.birthMode === "people" ? b.people : b.pct,
    note: state.birthMode === "people" ? fmtInt(b.people) + " people" : "",
  }));
  const growth = [
    { label: "Net overseas migration", value: POPULATION.netOverseasMigration, highlight: true },
    { label: "Natural increase (births minus deaths)", value: POPULATION.naturalIncrease },
  ];
  return `
  <section class="page-head">
    <p class="kicker">Population</p>
    <h1>27.61 million people, and still growing.</h1>
    <p class="lede">Australia added 420,100 people in the year to June 2025 — growth of 1.5%.
    Migration supplied most of it: 306,000 net arrivals against 115,000 from natural increase.</p>
  </section>

  <section class="grid4" aria-label="Population headline figures">
    ${statCard("27.61m", "Estimated resident population", "30 June 2025")}
    ${statCard("+420,100", "Added in a year", "+1.5% on June 2024")}
    ${statCard("38.5", "Median age", "Years, 30 June 2025")}
    ${statCard("32%", "Born overseas", "8.8 million residents")}
  </section>

  <section class="split">
    <div class="card">
      <h2>Ten years of growth</h2>
      <p class="chart-title">Estimated resident population, millions</p>
      ${lineChart(hist, { format: (v) => v.toFixed(1) + "m" })}
      ${srcLine(POPULATION.historySource)}
    </div>
    <div class="card">
      <h2>One in three was born overseas</h2>
      <div class="donut-wrap">${donut(POPULATION.overseasBornPct, "born overseas")}
      <p class="note">18.8 million residents were born in Australia; 8.8 million were born
      overseas. For the first time on record, India — 971,020 people — edged past
      England (970,950) as the largest overseas-born group, by just 70 people.</p></div>
      ${srcLine(POPULATION.birthplaceSource)}
    </div>
  </section>

  <section class="card">
    <div class="card-head">
      <h2>Where the overseas-born come from</h2>
      ${toggleButtons("birthMode", [["people", "People"], ["share", "Share of population"]], state.birthMode)}
    </div>
    <div id="birth-chart">${barChart(birth, { format: (v) => state.birthMode === "people" ? fmtInt(v) : v.toFixed(1) + "%" })}</div>
    ${srcLine(POPULATION.birthplaceSource)}
  </section>

  <section class="card">
    <h2>What drove the growth</h2>
    <p class="chart-title">Components of population change, year to June 2025</p>
    ${barChart(growth, { format: (v) => fmtInt(v) })}
    <p class="note">Net overseas migration has supplied roughly three-quarters of recent
    growth. Western Australia grew fastest of any state, at 2.2%.</p>
    ${srcLine(POPULATION.source)}
  </section>

  <section class="card">
    <div class="card-head">
      <h2>Population by state</h2>
      <label class="search">Search states
        <input type="search" id="pop-search" placeholder="e.g. Queensland" value="${esc(state.popQuery)}" autocomplete="off">
      </label>
    </div>
    <div class="table-wrap"><table class="data" id="pop-table">
      <thead><tr>
        <th><button type="button" data-action="sort-pop" data-key="name">State ${state.popSort.key === "name" ? (state.popSort.dir === 1 ? "▲" : "▼") : ""}</button></th>
        <th class="num"><button type="button" data-action="sort-pop" data-key="pop">Population ${state.popSort.key === "pop" ? (state.popSort.dir === 1 ? "▲" : "▼") : ""}</button></th>
        <th class="num"><button type="button" data-action="sort-pop" data-key="growthPct">Growth ${state.popSort.key === "growthPct" ? (state.popSort.dir === 1 ? "▲" : "▼") : ""}</button></th>
        <th class="num"><button type="button" data-action="sort-pop" data-key="growthPeople">People added ${state.popSort.key === "growthPeople" ? (state.popSort.dir === 1 ? "▲" : "▼") : ""}</button></th>
      </tr></thead>
      <tbody>${popTableRows()}</tbody>
    </table></div>
    ${srcLine(STATES_POP_SOURCE)}
  </section>`;
}

// ---------------------------------------------------------------- economy

export function renderEconomy() {
  const gdpSeries = ECONOMY.annualGrowth.map((d) => ({
    label: d.year.replace("20", "’"),
    value: state.gdpMode === "total" ? d.gdp : d.perCapita,
  }));
  const gdpTitle = state.gdpMode === "total"
    ? "Real GDP growth, % a year"
    : "Real GDP per person, % a year";
  return `
  <section class="page-head">
    <p class="kicker">Economy</p>
    <h1>A $2.86 trillion economy, growing slowly.</h1>
    <p class="lede">Real GDP rose 0.4% in the September quarter 2025 and 2.1% over the year.
    But per person, output fell in 2024–25 — the second year in a row.</p>
  </section>

  <section class="grid4" aria-label="Economy headline figures">
    ${statCard(ECONOMY.gdpQuarterLabel, "GDP, Sep quarter 2025", "Chain volume, seasonally adjusted")}
    ${statCard("+0.4%", "Growth in the quarter", "+2.1% over the year")}
    ${statCard(ECONOMY.nominalGdpLabel, "Nominal GDP, 2025", ECONOMY.nominalGdpPerCapitaLabel + " per person")}
    ${statCard(ECONOMY.netWorthLabel, "National net worth", "30 June 2025, up $0.8 trillion")}
  </section>

  <section class="card">
    <div class="card-head">
      <h2>Five years of growth</h2>
      ${toggleButtons("gdpMode", [["total", "Total GDP"], ["percapita", "Per person"]], state.gdpMode)}
    </div>
    <p class="chart-title">${gdpTitle}</p>
    <div id="gdp-chart">${columnChart(gdpSeries, { format: (v) => v.toFixed(1) + "%" })}</div>
    <p class="note">The 4.3% rebound in 2021–22 was the post-pandemic recovery. Since then
    growth has run at 1.4% a year — and population growth has eaten all of it,
    leaving GDP per person lower than two years ago.</p>
    ${srcLine(ECONOMY.annualGrowthSource)}
  </section>

  <section class="split">
    <div class="card">
      <h2>Households</h2>
      <p class="big">${ECONOMY.householdConsumptionLabel}</p>
      <p class="note">${ECONOMY.householdConsumptionNote}. Households saved
      ${ECONOMY.savingRatio}% of their income in the September quarter 2025, up as
      incomes outpaced spending.</p>
      ${srcLine(ECONOMY.householdConsumptionSource)}
    </div>
    <div class="card">
      <h2>Trade winds</h2>
      <p class="big">${ECONOMY.termsOfTrade.toFixed(1)}%</p>
      <p class="note">${ECONOMY.termsOfTradeNote}. Falling export prices relative to
      import prices trimmed national income even as volumes grew — one reason the
      economy feels tighter than the headline growth rate suggests.</p>
      ${srcLine(ECONOMY.annualGrowthSource)}
    </div>
  </section>

  <section class="card">
    <h2>Reading the numbers</h2>
    <p><strong>Chain volume</strong> means the figures are adjusted for inflation, so
    growth is real growth, not price rises. <strong>Seasonally adjusted</strong> means
    regular seasonal patterns (Christmas spending, harvests) have been removed so
    quarters can be compared. <strong>GDP per person</strong> divides output by the
    population — when it falls while total GDP rises, the average Australian is
    producing less, not more.</p>
    ${srcLine(ECONOMY.gdpSource)}
  </section>`;
}

// -------------------------------------------------------------------- jobs

export function renderJobs() {
  const rows = [...STATES].sort((a, b) =>
    state.jobsOrder === "desc" ? b.unemp - a.unemp : a.unemp - b.unemp);
  const chartData = rows.map((s) => ({
    label: s.code, value: s.unemp, highlight: s.code === "NT" || s.code === "TAS",
  }));
  return `
  <section class="page-head">
    <p class="kicker">Jobs</p>
    <h1>14.68 million people at work.</h1>
    <p class="lede">Unemployment fell back to 4.3% in October 2025 after a surprise 4.5% in
    September. Employment rose 42,200 in the month — the strongest monthly
    jobs growth in six months — and participation held at 67.0%.</p>
  </section>

  <section class="grid4" aria-label="Jobs headline figures">
    ${statCard("4.3%", "Unemployment rate", "October 2025, seasonally adjusted; 4.4% in trend terms")}
    ${statCard(JOBS.employedLabel, "People employed", "+42,200 in October 2025")}
    ${statCard("67.0%", "Participation rate", "Share of adults in the labour force")}
    ${statCard("5.7%", "Underemployment", "Part-timers wanting more hours")}
  </section>

  <section class="card">
    <div class="card-head">
      <h2>Unemployment by state</h2>
      ${toggleButtons("jobsOrder", [["desc", "Highest first"], ["asc", "Lowest first"]], state.jobsOrder)}
    </div>
    <p class="chart-title">Unemployment rate, %, October 2025 (seasonally adjusted)</p>
    <div id="jobs-chart">${barChart(chartData, { format: (v) => v.toFixed(1) + "%" })}</div>
    <p class="note">Tasmania had the lowest rate at 3.9%; the Northern Territory the highest
    at 5.2%. Victoria sat highest among the big states at 4.7%.</p>
    ${srcLine(STATES_UNEMP_SOURCE)}
  </section>

  <section class="split">
    <div class="card">
      <h2>What the average worker earns</h2>
      <p class="big">${JOBS.awoteLabel}</p>
      <p class="note">${JOBS.awoteNote}. That is the average for full-time adults on
      ordinary hours, before tax, excluding overtime.</p>
      ${srcLine(JOBS.awoteSource)}
    </div>
    <div class="card">
      <h2>What the typical worker earns</h2>
      <p class="big">${JOBS.medianEarningsLabel}</p>
      <p class="note">${JOBS.medianEarningsNote}. The median sits well below the average
      because a small number of very high earners pull the average up — half of
      all employees earn less than $1,436 a week.</p>
      ${srcLine(JOBS.medianEarningsSource)}
    </div>
  </section>

  <section class="card">
    <h2>Young workers</h2>
    <p>Youth unemployment (15–24 year olds) was <strong>${JOBS.youthUnemp}%</strong> in
    trend terms in October 2025 — more than double the overall rate. It is the
    figure to watch when the labour market turns: young workers are hired first
    in a boom and let go first in a downturn.</p>
    ${srcLine(JOBS.source)}
  </section>`;
}

// ------------------------------------------------------------------ prices

function cityTableRows() {
  const rows = [...PRICES.cities];
  const k = state.citySort.key, d = state.citySort.dir;
  rows.sort((a, b) => (k === "city" ? d * a.city.localeCompare(b.city) : d * (a[k] - b[k])));
  return rows.map((c) => `<tr>
    <td><strong>${esc(c.city)}</strong></td>
    <td class="num">+${c.quarterly.toFixed(1)}%</td>
    <td class="num"><strong>+${c.annual.toFixed(1)}%</strong></td>
  </tr>`).join("");
}

export function renderPrices() {
  return `
  <section class="page-head">
    <p class="kicker">Prices</p>
    <h1>Inflation is back above target.</h1>
    <p class="lede">Consumer prices rose 1.3% in the September quarter 2025 — the biggest
    quarterly rise since March 2023 — taking annual inflation to 3.2%, outside
    the Reserve Bank's 2–3% target band.</p>
  </section>

  <section class="grid4" aria-label="Prices headline figures">
    ${statCard("3.2%", "CPI, year to Sep 2025", "Up from 2.1% to the June quarter")}
    ${statCard("3.0%", "Trimmed mean inflation", "The RBA's preferred underlying measure")}
    ${statCard("3.60%", "Cash rate", "Held by the RBA, 4 November 2025")}
    ${statCard("2–3%", "RBA target band", "Annual CPI inflation target")}
  </section>

  <section class="card">
    <h2>What pushed prices up</h2>
    <p class="chart-title">Change in the September quarter 2025, %</p>
    ${barChart(PRICES.groupsQuarter.map((g) => ({ label: g.group, value: g.change, note: g.note })), { format: (v) => "+" + v.toFixed(1) + "%" })}
    <p class="note">Electricity rose 9.0% in the quarter and 23.6% over the year as state
    electricity rebates rolled off — the single biggest driver of the jump.
    Housing rose 2.5% in the quarter.</p>
    ${srcLine(PRICES.source)}
  </section>

  <section class="split">
    <div class="card">
      <h2>Inflation by capital city</h2>
      <div class="table-wrap"><table class="data" id="city-table">
        <thead><tr>
          <th><button type="button" data-action="sort-city" data-key="city">City ${state.citySort.key === "city" ? (state.citySort.dir === 1 ? "▲" : "▼") : ""}</button></th>
          <th class="num"><button type="button" data-action="sort-city" data-key="quarterly">Quarter ${state.citySort.key === "quarterly" ? (state.citySort.dir === 1 ? "▲" : "▼") : ""}</button></th>
          <th class="num"><button type="button" data-action="sort-city" data-key="annual">Year ${state.citySort.key === "annual" ? (state.citySort.dir === 1 ? "▲" : "▼") : ""}</button></th>
        </tr></thead>
        <tbody>${cityTableRows()}</tbody>
      </table></div>
      <p class="note">Brisbane's 4.7% annual rise was the highest of any capital; Adelaide's
      2.4% the lowest.</p>
      ${srcLine(PRICES.citiesSource)}
    </div>
    <div class="card">
      <h2>Interest rates</h2>
      <p class="big">${PRICES.cashRate.toFixed(2)}%</p>
      <p class="note">${PRICES.cashRateNote} (${PRICES.cashRateAsAt}), after three cuts
      earlier in 2025. With inflation back above target, the Board said further
      cuts were not on the table in the near term.</p>
      ${srcLine(PRICES.cashRateSource)}
    </div>
  </section>`;
}

// ----------------------------------------------------------------- regions

function regionDetail() {
  const s = STATES.find((x) => x.code === state.regionCode) || STATES[0];
  const density = (s.pop / s.areaKm2).toFixed(s.areaKm2 < 10000 ? 1 : 2);
  const share = ((s.pop / POPULATION.total) * 100).toFixed(1);
  return `<div class="detail" id="region-detail">
    <h3>${esc(s.name)} <span class="code">${esc(s.code)}</span></h3>
    <dl class="facts">
      <div><dt>Population</dt><dd>${fmtInt(s.pop)} <span class="sub">(${share}% of Australia)</span></dd></div>
      <div><dt>Capital</dt><dd>${esc(s.capital)}</dd></div>
      <div><dt>Grew by</dt><dd>+${fmtInt(s.growthPeople)} people (+${s.growthPct.toFixed(1)}%) in the year to June 2025</dd></div>
      <div><dt>Land area</dt><dd>${fmtInt(s.areaKm2)} km²</dd></div>
      <div><dt>Density</dt><dd>${density} people per km²</dd></div>
      <div><dt>Unemployment</dt><dd>${s.unemp.toFixed(1)}% (October 2025)</dd></div>
    </dl>
    <p class="note">Density is our own division of the ABS population by the state's land area.</p>
  </div>`;
}

export function renderRegions() {
  const q = state.regionQuery.trim().toLowerCase();
  const cards = STATES.filter((s) =>
    !q || (s.name + " " + s.capital + " " + s.code).toLowerCase().includes(q));
  return `
  <section class="page-head">
    <p class="kicker">Regions</p>
    <h1>Eight states and territories.</h1>
    <p class="lede">Three states hold more than three-quarters of the country. Western
    Australia is the fastest growing and the emptiest — 3.04 million people
    across 2.53 million square kilometres. Pick a state to see its numbers.</p>
  </section>

  <section class="card">
    <div class="card-head">
      <h2>Pick a state or territory</h2>
      <label class="search">Search
        <input type="search" id="region-search" placeholder="e.g. Perth, Tasmania, NT" value="${esc(state.regionQuery)}" autocomplete="off">
      </label>
    </div>
    <div class="state-grid" role="list">
      ${cards.length ? cards.map((s) => `
        <button type="button" role="listitem" class="state-card ${s.code === state.regionCode ? "on" : ""}" data-action="region" data-code="${esc(s.code)}" aria-pressed="${s.code === state.regionCode}">
          <span class="state-code">${esc(s.code)}</span>
          <span class="state-name">${esc(s.name)}</span>
          <span class="state-pop">${fmtInt(s.pop)} people</span>
          <span class="state-growth">+${s.growthPct.toFixed(1)}% a year</span>
        </button>`).join("") : `<p class="empty">No state matches “${esc(state.regionQuery)}”.</p>`}
    </div>
    ${regionDetail()}
    ${srcLine(STATES_POP_SOURCE + "; " + STATES_UNEMP_SOURCE + "; " + STATES_AREA_SOURCE)}
  </section>

  <section class="card">
    <h2>The biggest cities</h2>
    <p class="chart-title">Greater capital city populations, 30 June 2025</p>
    ${barChart(CITIES.map((c) => ({ label: c.name, value: c.pop })), { format: (v) => fmtInt(v) })}
    <p class="note">Melbourne (5.33 million) overtook Sydney (5.22 million) as Australia's
    largest city — and kept the lead in 2025.</p>
    ${srcLine(CITIES_SOURCE)}
  </section>`;
}

// ----------------------------------------------------------------- sources

export function renderSources() {
  return `
  <section class="page-head">
    <p class="kicker">Methodology &amp; sources</p>
    <h1>Where every number comes from.</h1>
    <p class="lede">The Oz Ledger is an independent site. It is not affiliated with the
    Australian Bureau of Statistics, the Reserve Bank of Australia, or any
    government. Every figure on this site names the publication it came from
    and the date it refers to.</p>
  </section>

  <section class="card">
    <h2>How we count</h2>
    <dl class="methods">
      <div><dt>Estimated resident population (ERP)</dt><dd>The ABS's official population
      count, built from the Census and adjusted for births, deaths and migration.
      Figures after June 2021 are preliminary and will be revised after the 2026 Census.</dd></div>
      <div><dt>Seasonally adjusted</dt><dd>Regular seasonal patterns removed, so a quarter
      can be compared with the one before it. Labour force and national accounts
      figures on this site are seasonally adjusted unless they say “trend”.</dd></div>
      <div><dt>Trend</dt><dd>A smoothed series that averages out month-to-month noise. The ABS
      recommends caution with trend estimates around the COVID-19 period.</dd></div>
      <div><dt>Chain volume</dt><dd>Values adjusted for price changes, so growth is real growth.
      The reference year for the national accounts here is 2023–24.</dd></div>
      <div><dt>Trimmed mean inflation</dt><dd>Underlying inflation: the CPI with the largest
      price rises and falls cut away, so one-off spikes (like electricity rebates
      ending) do not dominate. The Reserve Bank watches it most closely.</dd></div>
      <div><dt>Derived figures</dt><dd>Any figure we calculated ourselves — density, shares,
      GDP per person in dollars — is labelled “derived” beside its source.</dd></div>
    </dl>
  </section>

  <section class="card">
    <h2>Sources</h2>
    <div class="table-wrap"><table class="data sources">
      <thead><tr><th>Figures</th><th>Publication</th><th>Released</th></tr></thead>
      <tbody>
        ${SOURCES.map((s) => `<tr>
          <td><strong>${esc(s.figure)}</strong><br><span class="sub">${esc(s.what)}</span></td>
          <td>${esc(s.release)}</td>
          <td>${esc(s.released)}</td>
        </tr>`).join("")}
      </tbody>
    </table></div>
    <p class="note">Figures are shown as published. Where a later release revises an earlier
    one, the revised figure is used and the revision is noted in the source line.</p>
  </section>

  <section class="card">
    <h2>Corrections</h2>
    <p>Found a figure that looks wrong? Every page names its source, so you can
    check it against the original publication. This site carries no advertising
    and no tracking: it is plain files, and it loads nothing from anywhere else.</p>
  </section>`;
}

// ------------------------------------------------------------------- wiring

const ROUTES = {
  "/": renderOverview,
  "/population": renderPopulation,
  "/economy": renderEconomy,
  "/jobs": renderJobs,
  "/prices": renderPrices,
  "/regions": renderRegions,
  "/sources": renderSources,
};

export function renderRoute(path) {
  const fn = ROUTES[path] || renderOverview;
  return fn();
}

// Re-render one named container after a control changes (keeps scroll spot).
function refreshGdp(root) {
  const el = root.querySelector("#gdp-chart");
  if (!el) return;
  const series = ECONOMY.annualGrowth.map((d) => ({
    label: d.year.replace("20", "’"),
    value: state.gdpMode === "total" ? d.gdp : d.perCapita,
  }));
  el.innerHTML = columnChart(series, { format: (v) => v.toFixed(1) + "%" });
  const title = root.querySelector("#gdp-chart")?.previousElementSibling;
  if (title && title.classList.contains("chart-title")) {
    title.textContent = state.gdpMode === "total"
      ? "Real GDP growth, % a year" : "Real GDP per person, % a year";
  }
}

export function bind(root, rerender) {
  root.addEventListener("click", (ev) => {
    const btn = ev.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "toggle") {
      const group = btn.dataset.group;
      const value = btn.dataset.value;
      if (group === "gdpMode") { state.gdpMode = value; }
      else if (group === "birthMode") { state.birthMode = value; }
      else if (group === "jobsOrder") { state.jobsOrder = value; }
      // Update the pressed state on this toggle group, then refresh its chart.
      root.querySelectorAll(`[data-group="${group}"]`).forEach((b) => {
        const on = b.dataset.value === value;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      if (group === "gdpMode") refreshGdp(root);
      if (group === "birthMode") {
        const el = root.querySelector("#birth-chart");
        if (el) {
          const birth = POPULATION.birthplaces.map((b) => ({
            label: b.place,
            value: state.birthMode === "people" ? b.people : b.pct,
          }));
          el.innerHTML = barChart(birth, {
            format: (v) => state.birthMode === "people" ? fmtInt(v) : v.toFixed(1) + "%",
          });
        }
      }
      if (group === "jobsOrder") {
        const el = root.querySelector("#jobs-chart");
        if (el) {
          const rows = [...STATES].sort((a, b) =>
            state.jobsOrder === "desc" ? b.unemp - a.unemp : a.unemp - b.unemp);
          el.innerHTML = barChart(rows.map((s) => ({
            label: s.code, value: s.unemp,
            highlight: s.code === "NT" || s.code === "TAS",
          })), { format: (v) => v.toFixed(1) + "%" });
        }
      }
    }
    if (action === "sort-pop") {
      const key = btn.dataset.key;
      if (state.popSort.key === key) state.popSort.dir *= -1;
      else state.popSort = { key, dir: key === "name" ? 1 : -1 };
      rerender();
    }
    if (action === "sort-city") {
      const key = btn.dataset.key;
      if (state.citySort.key === key) state.citySort.dir *= -1;
      else state.citySort = { key, dir: key === "city" ? 1 : -1 };
      rerender();
    }
    if (action === "region") {
      state.regionCode = btn.dataset.code;
      root.querySelectorAll(".state-card").forEach((c) => {
        const on = c.dataset.code === state.regionCode;
        c.classList.toggle("on", on);
        c.setAttribute("aria-pressed", String(on));
      });
      const holder = root.querySelector("#region-detail");
      if (holder) holder.outerHTML = regionDetail();
    }
  });

  root.addEventListener("input", (ev) => {
    const t = ev.target;
    if (t.id === "pop-search") {
      state.popQuery = t.value;
      const tbody = root.querySelector("#pop-table tbody");
      if (tbody) {
        const keepFocus = t.selectionStart;
        const scrollY = window.scrollY;
        tbody.innerHTML = popTableRows();
        const again = root.querySelector("#pop-search");
        again.focus();
        again.setSelectionRange(keepFocus, keepFocus);
        window.scrollTo(0, scrollY);
      }
    }
    if (t.id === "region-search") {
      state.regionQuery = t.value;
      rerender(true);
    }
  });
}
