import { NextResponse } from "next/server";

export function suiteJson<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function suiteError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function suiteUnauthorized(message = "Non autorisé") {
  return suiteError(message, 401);
}
