import { Client } from "magicbell-js/project-client";
import { loadEnvConfig } from "@next/env";

export async function POST(request: Request) {
  loadEnvConfig(process.cwd());

  try {
    const client = new Client({
      token: process.env.MAGICBELL_PROJECT_TOKEN,
    });

    const { externalId, message } = await request.json();

    const { data } = await client.broadcasts.createBroadcast({
      title: "Test Notification",
      content: message,
      recipients: [
        {
          externalId,
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
