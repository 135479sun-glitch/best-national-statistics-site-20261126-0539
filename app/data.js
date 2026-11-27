// The Oz Ledger — data file.
// Every figure below was checked against the publication named beside it.
// Each figure carries its own source and reference date; nothing here is
// estimated by us except where a line is explicitly marked "derived".
// Money is Australian dollars unless a line says otherwise.

export const SITE = {
  name: "The Oz Ledger",
  tagline: "Australia, in numbers — plainly told.",
  country: "Australia",
  updatedNote: "Figures as published by the ABS and the RBA. Every figure shows its source and reference date.",
};

export const POPULATION = {
  total: 27614400,
  totalLabel: "27.61 million",
  asAt: "30 June 2025",
  annualChange: 420100,
  annualChangePct: 1.5,
  naturalIncrease: 115000,
  netOverseasMigration: 306000,
  overseasBornPct: 32.0,
  overseasBornLabel: "8.8 million",
  medianAge: 38.5,
  source: "ABS, National, state and territory population, June 2025",
  history: [
    { year: 2015, pop: 23816000, note: "23.82m" },
    { year: 2019, pop: 25334826, note: "25.33m" },
    { year: 2020, pop: 25649248, note: "25.65m" },
    { year: 2024, pop: 27194300, note: "27.19m" },
    { year: 2025, pop: 27614400, note: "27.61m" },
  ],
  historySource: "ABS, Estimated Resident Population (annual); June 2024 derived from the June 2025 release",
  birthplaces: [
    { place: "India", people: 971020, pct: 3.5 },
    { place: "England", people: 970950, pct: 3.5 },
    { place: "China", people: 731540, pct: 2.7 },
    { place: "New Zealand", people: 637680, pct: 2.3 },
    { place: "Philippines", people: 412530, pct: 1.5 },
    { place: "Vietnam", people: 326630, pct: 1.2 },
  ],
  birthplaceSource: "ABS, Australia's population by country of birth, June 2025",
};

export const STATES = [
  { code: "NSW", name: "New South Wales", capital: "Sydney", pop: 8593900, growthPct: 1.2, growthPeople: 101800, areaKm2: 801150, unemp: 4.3 },
  { code: "VIC", name: "Victoria", capital: "Melbourne", pop: 7074500, growthPct: 1.8, growthPeople: 123500, areaKm2: 227444, unemp: 4.7 },
  { code: "QLD", name: "Queensland", capital: "Brisbane", pop: 5669800, growthPct: 1.8, growthPeople: 97900, areaKm2: 1729742, unemp: 4.2 },
  { code: "SA", name: "South Australia", capital: "Adelaide", pop: 1902300, growthPct: 1.1, growthPeople: 20200, areaKm2: 984321, unemp: 4.3 },
  { code: "WA", name: "Western Australia", capital: "Perth", pop: 3043700, growthPct: 2.2, growthPeople: 65600, areaKm2: 2527013, unemp: 4.1 },
  { code: "TAS", name: "Tasmania", capital: "Hobart", pop: 576000, growthPct: 0.2, growthPeople: 1200, areaKm2: 68401, unemp: 3.9 },
  { code: "NT", name: "Northern Territory", capital: "Darwin", pop: 264400, growthPct: 1.4, growthPeople: 3500, areaKm2: 1347791, unemp: 5.2 },
  { code: "ACT", name: "Australian Capital Territory", capital: "Canberra", pop: 484800, growthPct: 1.3, growthPeople: 6400, areaKm2: 2358, unemp: 4.5 },
];
export const STATES_POP_SOURCE = "ABS, National, state and territory population, June 2025";
export const STATES_UNEMP_SOURCE = "ABS, Labour Force, Australia, October 2025 (seasonally adjusted)";
export const STATES_AREA_SOURCE = "ABS, Regional population 2024–25; state and territory land areas";

export const CITIES = [
  { name: "Melbourne", pop: 5328274, state: "VIC" },
  { name: "Sydney", pop: 5219674, state: "NSW" },
  { name: "Perth", pop: 2430757, state: "WA" },
  { name: "Adelaide", pop: 1470938, state: "SA" },
];
export const CITIES_SOURCE = "ABS, Regional population 2024–25 (greater capital city areas, 30 June 2025)";

export const ECONOMY = {
  gdpQuarterLabel: "$687.8 billion",
  gdpQuarter: "September quarter 2025",
  gdpQuarterGrowth: 0.4,
  gdpYearGrowth: 2.1,
  gdpSource: "ABS, Australian National Accounts: National Income, Expenditure and Product, September 2025",
  annualGrowth: [
    { year: "2020–21", gdp: 2.0, perCapita: 1.6 },
    { year: "2021–22", gdp: 4.3, perCapita: 3.7 },
    { year: "2022–23", gdp: 3.6, perCapita: 1.4 },
    { year: "2023–24", gdp: 1.4, perCapita: -1.0 },
    { year: "2024–25", gdp: 1.4, perCapita: -0.3 },
  ],
  annualGrowthSource: "ABS, Australian System of National Accounts, 2024–25",
  nominalGdpLabel: "A$2.86 trillion",
  nominalGdpYear: "2025",
  nominalGdpPerCapitaLabel: "about A$103,000",
  nominalGdpSource: "IMF World Economic Outlook via FRED (series NGDPXDCAUA); per-capita figure derived from that total and the ABS June 2025 population",
  householdConsumptionLabel: "$353.8 billion",
  householdConsumptionNote: "Household consumption, September quarter 2025, up 0.5% on the quarter",
  householdConsumptionSource: "ABS, Australian National Accounts, September 2025",
  savingRatio: 6.4,
  savingRatioNote: "Household saving ratio, September quarter 2025",
  netWorthLabel: "$21.4 trillion",
  netWorthNote: "National net worth, 30 June 2025, up $0.8 trillion on the year",
  netWorthSource: "ABS, Australian System of National Accounts, 2024–25",
  termsOfTrade: -4.0,
  termsOfTradeNote: "Terms of trade, change in 2024–25",
};

export const JOBS = {
  unempRate: 4.3,
  unempTrend: 4.4,
  asAt: "October 2025",
  unempPrevMonth: 4.5,
  unempYearAgo: 4.1,
  employed: 14683200,
  employedLabel: "14.68 million",
  employedChange: 42200,
  fullTimeChange: 55300,
  participation: 67.0,
  underemployment: 5.7,
  underemploymentTrend: 5.8,
  youthUnemp: 9.8,
  source: "ABS, Labour Force, Australia, October 2025",
  awoteLabel: "$2,051.10 a week",
  awoteNote: "Full-time adult average weekly ordinary time earnings, November 2025, up 3.8% on the year",
  awoteSource: "ABS, Average Weekly Earnings, Australia, November 2025",
  medianEarningsLabel: "$1,436 a week",
  medianEarningsNote: "Median weekly earnings, all employees, May 2025",
  medianEarningsSource: "ABS, Employee Earnings and Hours, Australia, May 2025",
};

export const PRICES = {
  cpiQuarter: 1.3,
  cpiAnnual: 3.2,
  cpiAsAt: "September quarter 2025",
  cpiPrevQuarterAnnual: 2.1,
  cpiYearAgoAnnual: 3.8,
  trimmedMean: 3.0,
  trimmedMeanPrev: 2.7,
  source: "ABS, Consumer Price Index, Australia, September Quarter 2025",
  groupsQuarter: [
    { group: "Electricity", change: 9.0, note: "+23.6% over the year" },
    { group: "Housing", change: 2.5, note: "largest group contributor" },
    { group: "Recreation & culture", change: 1.9, note: "" },
    { group: "All groups (CPI)", change: 1.3, note: "highest quarterly rise since March 2023" },
    { group: "Transport", change: 1.2, note: "" },
  ],
  cities: [
    { city: "Brisbane", annual: 4.7, quarterly: 1.3 },
    { city: "Perth", annual: 4.5, quarterly: 1.3 },
    { city: "Hobart", annual: 4.3, quarterly: 1.4 },
    { city: "Sydney", annual: 2.9, quarterly: 1.5 },
    { city: "Canberra", annual: 2.8, quarterly: 1.5 },
    { city: "Melbourne", annual: 2.6, quarterly: 1.2 },
    { city: "Darwin", annual: 2.5, quarterly: 1.1 },
    { city: "Adelaide", annual: 2.4, quarterly: 1.1 },
  ],
  citiesSource: "ABS, Consumer Price Index, Australia, September Quarter 2025 (capital city indexes)",
  cashRate: 3.6,
  cashRateAsAt: "4 November 2025",
  cashRateNote: "Held unchanged by the Reserve Bank's Monetary Policy Board",
  cashRateSource: "Reserve Bank of Australia, Statement on Monetary Policy, November 2025",
  targetBand: "2–3%",
};

export const SOURCES = [
  { figure: "Population, states and territories", release: "ABS, National, state and territory population, June 2025", released: "18 December 2025", what: "Estimated resident population at 30 June 2025 and the year to June 2025: +420,100 people (+1.5%), natural increase 115,000, net overseas migration 306,000." },
  { figure: "Population by country of birth", release: "ABS, Australia's population by country of birth, June 2025", released: "April 2026", what: "8.8 million residents born overseas (32.0% of the population); India the largest overseas-born group for the first time." },
  { figure: "Population history and cities", release: "ABS, Estimated Resident Population (annual) and Regional population 2024–25", released: "2025–26", what: "Annual population totals back to 2015 and greater capital city populations at 30 June 2025." },
  { figure: "GDP and national accounts", release: "ABS, Australian National Accounts: National Income, Expenditure and Product, September 2025", released: "3 December 2025", what: "GDP $687.8 billion in the September quarter 2025 (chain volume, seasonally adjusted), +0.4% on the quarter and +2.1% over the year." },
  { figure: "GDP, annual", release: "ABS, Australian System of National Accounts, 2024–25", released: "October 2025", what: "Annual chain-volume GDP growth and GDP per capita growth for 2020–21 to 2024–25; national net worth $21.4 trillion at 30 June 2025." },
  { figure: "Nominal GDP", release: "IMF World Economic Outlook, via FRED series NGDPXDCAUA", released: "2025", what: "Nominal GDP A$2,856,570 million in 2025. The per-capita figure (about A$103,000) is our own division of that total by the ABS June 2025 population." },
  { figure: "Jobs", release: "ABS, Labour Force, Australia, October 2025", released: "13 November 2025", what: "Unemployment 4.3% (seasonally adjusted), employment 14,683,200, participation 67.0%, underemployment 5.7%." },
  { figure: "Earnings", release: "ABS, Average Weekly Earnings, Australia, November 2025; and Employee Earnings and Hours, Australia, May 2025", released: "February 2026; January 2026", what: "Full-time adult average weekly ordinary time earnings $2,051.10 (November 2025); median weekly earnings for all employees $1,436 (May 2025)." },
  { figure: "Prices", release: "ABS, Consumer Price Index, Australia, September Quarter 2025", released: "29 October 2025", what: "CPI +1.3% in the quarter and +3.2% over the year; trimmed mean +3.0% over the year; electricity +9.0% in the quarter." },
  { figure: "Interest rates", release: "Reserve Bank of Australia, Statement on Monetary Policy, November 2025", released: "November 2025", what: "Cash rate target held at 3.60% at the November 2025 meeting." },
];

export const NAV = [
  { hash: "#/", label: "Overview" },
  { hash: "#/population", label: "Population" },
  { hash: "#/economy", label: "Economy" },
  { hash: "#/jobs", label: "Jobs" },
  { hash: "#/prices", label: "Prices" },
  { hash: "#/regions", label: "Regions" },
  { hash: "#/sources", label: "Sources" },
];

export function fmtInt(n) {
  return n.toLocaleString("en-AU");
}
export function fmtMillions(n) {
  return (n / 1000000).toFixed(2) + "m";
}
