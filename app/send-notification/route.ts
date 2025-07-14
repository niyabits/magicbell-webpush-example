import { Client } from "magicbell-js/project-client";
import jwt from "jsonwebtoken";
import { loadEnvConfig } from "@next/env";

export async function POST(request: Request) {
  loadEnvConfig(process.cwd());

  try {
    const client = new Client({
      token: process.env.MAGICBELL_PROJECT_TOKEN,
    });

    const { message } = await request.json();

    const { data } = await client.broadcasts.createBroadcast({
      title: "Test Notification",
      content: message,
      recipients: [
        {
          externalId: "7f4baab5-0c91-44e8-8b58-5ff849535174",
        },
      ],
    });

    return Response.json(JSON.stringify(data));
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected exception";

    return new Response(message, { status: 500 });
  }
}
