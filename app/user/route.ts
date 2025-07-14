import jwt from "jsonwebtoken";
import { loadEnvConfig } from "@next/env";

export function GET(request: Request) {
  loadEnvConfig(process.cwd());

  const secret = process.env.MAGICBELL_SECRET_KEY;
  const payload = {
    user_email: "niya@magicbell.io",
    user_external_id: "7f4baab5-0c91-44e8-8b58-5ff849535174",
    api_key: process.env.MAGICBELL_API_KEY,
  };

  if (secret === undefined) {
    console.error("Secret key is undefined.");
    return;
  }

  try {
    const token = jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "1y",
    });

    return Response.json(JSON.stringify(token));
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected exception";

    return new Response(message, { status: 500 });
  }
}
