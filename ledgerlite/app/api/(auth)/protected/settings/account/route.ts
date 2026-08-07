import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { Verifypassword } from "@/app/lib/hashpassword";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password confirmation is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify confirmation password before performing critical account deletion
    const isMatch = await Verifypassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

    // Perform database deletion. Cascading deletion will automatically clear Sales, Expenses, and Items.
    await prisma.user.delete({
      where: { id: userId },
    });

    // Clear session cookies
    const cookiesStore = await cookies();
    cookiesStore.delete("sessionToken");

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("API error during account deletion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
