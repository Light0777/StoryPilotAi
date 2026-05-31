import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";

const ALLOWED_KEYS = [
  "prompt_provider",
  "openai_api_key",
  "openrouter_api_key",
  "openrouter_model",
  "image_provider",
  "image_provider_api_key",
  "huggingface_api_key",
  "buffer_access_token",
];

const SENSITIVE_PATTERNS = ["api_key", "token", "secret"];

export async function GET() {
  try {
    await requireAuth();

    const settings = await prisma.setting.findMany();
    const safeSettings: Record<string, string> = {};

    for (const setting of settings) {
      if (SENSITIVE_PATTERNS.some((p) => setting.key.includes(p))) {
        safeSettings[setting.key] = "••••••••";
      } else {
        safeSettings[setting.key] = setting.value;
      }
    }

    return NextResponse.json({ settings: safeSettings });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_KEYS.includes(key)) continue;

      const encryptedValue = SENSITIVE_PATTERNS.some((p) => key.includes(p))
        ? encrypt(String(value))
        : String(value);

      await prisma.setting.upsert({
        where: { key },
        create: { key, value: encryptedValue },
        update: { value: encryptedValue },
      });
    }

    return NextResponse.json({ message: "Settings saved" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
