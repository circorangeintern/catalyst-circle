import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { Verifypassword, HashPassword } from "@/app/lib/hashpassword";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Old password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Retrieve the user to verify current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await Verifypassword(oldPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 400 }
      );
    }

    // Hash the new password and update user record
    const newHash = await HashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("API error updating password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
