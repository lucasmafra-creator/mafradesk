const { randomBytes, randomInt } = require('node:crypto');

const TEMP_CODE_TTL_MS = 10 * 60 * 1000;

function createTemporaryCode(now = Date.now()) {
  return {
    value: randomBytes(16).toString('hex').toUpperCase(),
    expiresAt: now + TEMP_CODE_TTL_MS,
    used: false,
  };
}

function createSessionIdentity(now = Date.now()) {
  return {
    id: String(randomInt(100_000_000_000, 1_000_000_000_000)),
    temporaryCode: createTemporaryCode(now),
  };
}

function rotateTemporaryCode(identity, now = Date.now()) {
  return {
    ...identity,
    temporaryCode: createTemporaryCode(now),
  };
}

function isTemporaryCodeValid(identity, now = Date.now()) {
  return Boolean(
    identity?.temporaryCode?.value &&
      !identity.temporaryCode.used &&
      now < identity.temporaryCode.expiresAt,
  );
}

module.exports = {
  TEMP_CODE_TTL_MS,
  createSessionIdentity,
  isTemporaryCodeValid,
  rotateTemporaryCode,
};
