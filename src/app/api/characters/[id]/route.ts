import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { characterSchema } from "@/lib/validators";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const character = await prisma.character.findFirst({
      where: { id, userId: session.userId },
      include: {
        _count: {
          select: {
            generatedStories: true,
            storyPlans: true,
          },
        },
      },
    });

    if (!character) {
      return NextResponse.json({ message: "Character not found" }, { status: 404 });
    }

    return NextResponse.json({ character });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    if (body.status) {
      const character = await prisma.character.findFirst({
        where: { id, userId: session.userId },
      });

      if (!character) {
        return NextResponse.json({ message: "Character not found" }, { status: 404 });
      }

      const updated = await prisma.character.update({
        where: { id },
        data: { status: body.status },
      });

      return NextResponse.json({ character: updated });
    }

    const validated = characterSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { message: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const character = await prisma.character.findFirst({
      where: { id, userId: session.userId },
    });

    if (!character) {
      return NextResponse.json({ message: "Character not found" }, { status: 404 });
    }

    const updated = await prisma.character.update({
      where: { id },
      data: validated.data,
    });

    return NextResponse.json({ character: updated });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const character = await prisma.character.findFirst({
      where: { id, userId: session.userId },
    });

    if (!character) {
      return NextResponse.json({ message: "Character not found" }, { status: 404 });
    }

    await prisma.character.delete({ where: { id } });

    return NextResponse.json({ message: "Character deleted" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
