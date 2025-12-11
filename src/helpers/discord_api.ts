import { Config } from "../consts/config.ts";
import { Log } from "./log.ts";

const MAX_CONTENT_LENGTH = 2000;
const FILE_THRESHOLD = 4000;

interface InteractionResponseData {
  content?: string;
  embeds?: unknown[];
  filename?: string;
}

export async function editOriginalInteractionResponse(
  interactionToken: string,
  data: InteractionResponseData,
): Promise<void> {
  const baseUrl =
    `https://discord.com/api/v10/webhooks/${Config.APP_ID}/${interactionToken}`;
  const contentLength = data.content?.length ?? 0;

  if (contentLength <= MAX_CONTENT_LENGTH) {
    await patchMessage(`${baseUrl}/messages/@original`, data);
    return;
  }

  if (contentLength > FILE_THRESHOLD) {
    await editWithFileAttachment(
      `${baseUrl}/messages/@original`,
      data.content!,
      data.filename ?? "response.md",
    );
    return;
  }

  const chunks = splitContent(data.content!);

  await patchMessage(`${baseUrl}/messages/@original`, {
    content: chunks[0],
    embeds: data.embeds,
  });

  for (let i = 1; i < chunks.length; i++) {
    await sendFollowUp(baseUrl, { content: chunks[i] });
    // Small delay to avoid rate limits
    await delay(100);
  }
}

function splitContent(
  content: string,
  maxLength = MAX_CONTENT_LENGTH,
): string[] {
  if (content.length <= maxLength) {
    return [content];
  }

  const chunks: string[] = [];
  const lines = content.split("\n");
  let currentChunk = "";

  for (const line of lines) {
    // Slice lines if length > 2000
    if (line.length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }
      for (let i = 0; i < line.length; i += maxLength) {
        chunks.push(line.slice(i, i + maxLength));
      }
      continue;
    }

    // Push chunk if full
    if (currentChunk.length + line.length + 1 > maxLength) {
      chunks.push(currentChunk);
      currentChunk = line;
      continue;
    }

    currentChunk = currentChunk ? `${currentChunk}\n${line}` : line;
  }

  // Push last chunk
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function patchMessage(
  url: string,
  data: Omit<InteractionResponseData, "filename">,
): Promise<void> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    Log.error(`Failed to patch message: ${response.status}`, errorBody);
    throw new Error(`Failed to patch message: ${response.status}`);
  }
}

async function sendFollowUp(
  baseUrl: string,
  data: Omit<InteractionResponseData, "filename">,
): Promise<void> {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    Log.error(`Failed to send follow-up: ${response.status}`, errorBody);
    throw new Error(`Failed to send follow-up: ${response.status}`);
  }
}

async function editWithFileAttachment(
  url: string,
  content: string,
  filename: string,
): Promise<void> {
  const formData = new FormData();

  formData.append(
    "payload_json",
    JSON.stringify({
      content:
        `Response was too long (${content.length.toLocaleString()} characters), see attached file:`,
      attachments: [{ id: 0, filename }],
    }),
  );

  const blob = new Blob([content], { type: "text/plain" });
  formData.append("files[0]", blob, filename);

  const response = await fetch(url, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    Log.error(`Failed to edit with file: ${response.status}`, errorBody);
    throw new Error(`Failed to edit interaction response: ${response.status}`);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
