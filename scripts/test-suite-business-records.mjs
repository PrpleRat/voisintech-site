/**
 * Unit checks for lib/suite/business-records.ts
 * Run: npx tsx scripts/test-suite-business-records.mjs
 */
import assert from "node:assert/strict";
import {
  isSuiteRecordKind,
  isSuiteRecordSource,
  parseKindFilter,
  parsePayload,
  parseRecordWriteBody,
  payloadToObject,
  recordToDTO,
} from "../lib/suite/business-records.ts";

assert.equal(isSuiteRecordKind("revenue"), true);
assert.equal(isSuiteRecordKind("crm"), false);
assert.equal(isSuiteRecordSource("trainca"), true);
assert.equal(isSuiteRecordSource("traincrm"), false);

assert.deepEqual(parseKindFilter("revenue,quote"), ["revenue", "quote"]);
assert.equal(parseKindFilter(null), null);
assert.throws(() => parseKindFilter("revenue,unknown"), /kind invalide/);

assert.equal(parsePayload({ amount: 100 }), '{"amount":100}');
assert.equal(parsePayload('{"amount":100}'), '{"amount":100}');
assert.throws(() => parsePayload("not-json"), /JSON invalide/);
assert.throws(() => parsePayload(undefined), /payload requis/);

const parsed = parseRecordWriteBody(
  {
    kind: "invoice",
    source: "factutrain",
    externalId: "abc-123",
    payload: { number: "FA-1" },
  },
  true
);
assert.equal(parsed.kind, "invoice");
assert.equal(parsed.source, "factutrain");
assert.equal(parsed.externalId, "abc-123");
assert.equal(parsed.payload, '{"number":"FA-1"}');

const dto = recordToDTO({
  id: "rec1",
  workspaceId: "ws1",
  kind: "revenue",
  source: "trainca",
  externalId: "key1",
  payload: '{"amount":50}',
  createdAt: new Date("2026-06-01T10:00:00.000Z"),
  updatedAt: new Date("2026-06-01T11:00:00.000Z"),
  deletedAt: null,
});
assert.equal(dto.id, "rec1");
assert.deepEqual(payloadToObject('{"amount":50}'), { amount: 50 });
assert.equal(dto.payload.amount, 50);
assert.equal(dto.deletedAt, null);

console.log("suite business-records: OK");
