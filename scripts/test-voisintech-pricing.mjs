import assert from "node:assert/strict";
import {
  defaultInvoiceAmount,
  suggestIntervention,
  suggestQuoteLines,
  voisintechPricingCatalog,
} from "../lib/voisintech-pricing.ts";

const pcLines = suggestQuoteLines("PC Windows", "ordinateur lent");
assert.equal(pcLines[0].label, "Diagnostic complet");
assert.equal(pcLines[0].unitPrice, 30);
assert.equal(pcLines[1].label, "Dépannage à domicile");
assert.equal(pcLines[1].unitPrice, 50);

const phoneLines = suggestQuoteLines("Smartphone", "transfert photos");
assert.equal(phoneLines[1].label, "Configuration smartphone");
assert.equal(phoneLines[1].unitPrice, 50);

const virusLines = suggestQuoteLines("PC Windows", "j ai un virus");
assert.equal(virusLines[1].label, "Pack sécurité");
assert.equal(virusLines[1].unitPrice, 60);

const intervention = suggestIntervention("Smartphone");
assert.equal(intervention.serviceName, "Configuration smartphone");
assert.equal(intervention.price, 50);

assert.equal(defaultInvoiceAmount("PC Windows"), "30.00");
assert.equal(voisintechPricingCatalog.diagnostic, 30);

console.log("voisintech-pricing OK");
