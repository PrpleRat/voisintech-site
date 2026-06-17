import { suiteApps } from "./train-suite";

export type SuiteAppId = (typeof suiteApps)[number]["id"];

const ENV_BY_APP_ID: Record<SuiteAppId, string> = {
  agendatrain: "TESTFLIGHT_URL_AGENDA",
  factutrain: "TESTFLIGHT_URL_FACTURE",
  trainca: "TESTFLIGHT_URL_COMPTA",
  traincrm: "TESTFLIGHT_URL_CLIENTS",
};

export type TestFlightLinks = Partial<Record<SuiteAppId, string>>;

export function getTestFlightLinks(): TestFlightLinks {
  const links: TestFlightLinks = {};
  for (const app of suiteApps) {
    const envKey = ENV_BY_APP_ID[app.id as SuiteAppId];
    const url = process.env[envKey]?.trim();
    if (url) links[app.id as SuiteAppId] = url;
  }
  return links;
}

export function getTestFlightStatus() {
  const links = getTestFlightLinks();
  const missing = suiteApps
    .filter((app) => !links[app.id as SuiteAppId])
    .map((app) => app.marketingName);
  const configured = suiteApps
    .filter((app) => links[app.id as SuiteAppId])
    .map((app) => ({
      id: app.id,
      name: app.marketingName,
      url: links[app.id as SuiteAppId]!,
    }));

  return { links, allConfigured: missing.length === 0, missing, configured };
}
