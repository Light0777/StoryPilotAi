import { prisma } from "./prisma";
import { decrypt } from "./encryption";

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http")) return url;
  const base = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`;
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}

interface BufferPostResponse {
  id: string;
  created_at: string;
  status: string;
}

interface Channel {
  id: string;
  name: string;
  service: string;
}

async function getBufferToken(): Promise<string> {
  const setting = await prisma.setting.findUnique({
    where: { key: "buffer_access_token" },
  });

  if (!setting) {
    throw new Error(
      "Buffer access token not configured. Go to Settings → Publishing to add it."
    );
  }

  return decrypt(setting.value);
}

async function graphql<T>(token: string, query: string): Promise<T> {
  const response = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await response.json();

  if (json.errors) {
    throw new Error(
      `Buffer API error: ${json.errors.map((e: any) => e.message).join(", ")}`
    );
  }

  return json.data as T;
}

async function getInstagramChannel(token: string): Promise<Channel> {
  const orgData = await graphql<{ account: { organizations: { id: string }[] } }>(
    token,
    `query { account { organizations { id } } }`
  );

  const orgId = orgData.account.organizations[0]?.id;
  if (!orgId) {
    throw new Error("No Buffer organization found for this account");
  }

  const channelsData = await graphql<{ channels: Channel[] }>(
    token,
    `query { channels(input: { organizationId: "${orgId}" }) { id name service } }`
  );

  const instagram = channelsData.channels.find(
    (c) => c.service === "instagram"
  );
  const channel = instagram || channelsData.channels[0];

  if (!channel) {
    throw new Error(
      "No connected social channels found in your Buffer account. Connect at least one channel first."
    );
  }

  return channel;
}

export async function createBufferPost(
  text: string,
  imageUrl: string,
  scheduledAt?: Date
): Promise<BufferPostResponse> {
  const token = await getBufferToken();
  const channel = await getInstagramChannel(token);

  const absoluteImageUrl = toAbsoluteUrl(imageUrl);
  const dueAt = scheduledAt ? scheduledAt.toISOString() : undefined;
  const mode = scheduledAt ? "customScheduled" : "shareNow";

  const query = `mutation {
    createPost(input: {
      channelId: "${channel.id}",
      schedulingType: automatic,
      metadata: {
        instagram: {
          type: story,
          shouldShareToFeed: false
        }
      },
      mode: ${mode},
      ${dueAt ? `dueAt: "${dueAt}",` : ""}
      assets: [{ image: { url: ${JSON.stringify(absoluteImageUrl)} } }]
    }) {
      ... on PostActionSuccess {
        post { id }
      }
      ... on MutationError {
        message
      }
    }
  }`;

  const data = await graphql<{ createPost: { post?: { id: string }; message?: string } }>(
    token,
    query
  );

  if (data.createPost.message) {
    throw new Error(`Buffer publishing error: ${data.createPost.message}`);
  }

  return {
    id: data.createPost.post!.id,
    created_at: new Date().toISOString(),
    status: "sent",
  };
}

export async function updateBufferPost(
  postId: string,
  text?: string,
  scheduledAt?: Date
): Promise<void> {
  const token = await getBufferToken();
  const dueAt = scheduledAt ? scheduledAt.toISOString() : undefined;

  const query = `mutation {
    updatePost(input: {
      postId: "${postId}",
      ${text ? `text: ${JSON.stringify(text)},` : ""}
      ${dueAt ? `dueAt: "${dueAt}",` : ""}
    }) {
      ... on PostActionSuccess {
        post { id }
      }
      ... on MutationError {
        message
      }
    }
  }`;

  const data = await graphql<{ updatePost: { message?: string } }>(token, query);

  if (data.updatePost.message) {
    throw new Error(`Buffer update error: ${data.updatePost.message}`);
  }
}

export async function deleteBufferPost(postId: string): Promise<void> {
  const token = await getBufferToken();

  const query = `mutation {
    deletePost(input: { postId: "${postId}" }) {
      ... on PostActionSuccess {
        post { id }
      }
      ... on MutationError {
        message
      }
    }
  }`;

  const data = await graphql<{ deletePost: { message?: string } }>(token, query);

  if (data.deletePost.message) {
    throw new Error(`Buffer delete error: ${data.deletePost.message}`);
  }
}
