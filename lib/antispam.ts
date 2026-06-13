interface AntispamPayload {
  website?: string;
  _ts?: number;
}

export function isSpamSubmission(body: AntispamPayload): boolean {
  if (body.website && String(body.website).trim().length > 0) {
    return true;
  }

  const ts = Number(body._ts);
  if (ts && Date.now() - ts < 2500) {
    return true;
  }

  return false;
}
