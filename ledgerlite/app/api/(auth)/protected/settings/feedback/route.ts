import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In a production app, we would send an email or store this in a Support Ticket table.
    // We log it securely here for business follow-up.
    console.log(`[SUPPORT FEEDBACK] User ID: ${userId}, Email: ${user.email}, Subject: "${subject}", Message: "${message}"`);

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("API error submitting feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
