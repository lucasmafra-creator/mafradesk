const test = require('node:test');
const assert = require('node:assert/strict');
const {
  TEMP_CODE_TTL_MS,
  createSessionIdentity,
  isTemporaryCodeValid,
  rotateTemporaryCode,
} = require('../src/sessionIdentity');

test('creates a 12-digit ID and a 128-bit hexadecimal temporary code', () => {
  const now = 1_800_000_000_000;
  const identity = createSessionIdentity(now);
  assert.match(identity.id, /^\d{12}$/);
  assert.match(identity.temporaryCode.value, /^[A-F0-9]{32}$/);
  assert.equal(identity.temporaryCode.expiresAt, now + TEMP_CODE_TTL_MS);
});

test('temporary code is valid before expiry and invalid at expiry', () => {
  const now = 1_800_000_000_000;
  const identity = createSessionIdentity(now);
  assert.equal(isTemporaryCodeValid(identity, now), true);
  assert.equal(isTemporaryCodeValid(identity, now + TEMP_CODE_TTL_MS - 1), true);
  assert.equal(isTemporaryCodeValid(identity, now + TEMP_CODE_TTL_MS), false);
});

test('rotates the code without changing the device ID', () => {
  const now = 1_800_000_000_000;
  const identity = createSessionIdentity(now);
  const next = rotateTemporaryCode(identity, now + 1000);
  assert.equal(next.id, identity.id);
  assert.notEqual(next.temporaryCode.value, identity.temporaryCode.value);
  assert.equal(next.temporaryCode.expiresAt, now + 1000 + TEMP_CODE_TTL_MS);
});
