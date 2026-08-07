import { getCurrentUserId } from "@/app/lib/authhelper";
import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// Helper function to format relative timestamps
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Guard for future times or minimal differences
  if (diffMs < 0) return "Just now";

  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  return `${diffDays} days ago`;
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Load user's active inventory items
    const items = await prisma.item.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    // Filter down below dynamic stock thresholds
    const lowStockItems = items.filter(
      (item) => item.currentStock <= item.lowStock
    );

    // Format low stock inventory status as dynamic notifications with relative timestamps
    const lowStockNotifications = lowStockItems.map((item) => ({
      id: `low-stock-${item.id}`,
      kind: "low-stock",
      title: `Low Stock Alert: ${item.name}`,
      message: `Inventory level for "${item.name}" has dropped below the threshold of ${item.lowStock}. Current stock: ${item.currentStock}.`,
      timestamp: getRelativeTime(item.updatedAt),
      read: false,
    }));

    // Static placeholder system notifications for rich UI demo purposes
    const systemNotifications = [
      {
        id: "export-ready-demo",
        kind: "export-ready",
        title: "Export Ready: General Financial Summary",
        message: "Your total business sales summary report is generated and ready for download.",
        timestamp: "5 mins ago",
        read: false,
        meta: { fileSize: "1.2 MB" },
      },
      {
        id: "system-restock-demo",
        kind: "restock",
        title: "System Restock Alert: bottle water",
        message: "Automated replenishment database update succeeded. 50 bottle water stocks synced.",
        timestamp: "1 hour ago",
        read: true,
      }
    ];

    return NextResponse.json({
      notifications: [...lowStockNotifications, ...systemNotifications],
    });
  } catch (error) {
    console.error("API error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to load notifications" },
      { status: 500 }
    );
  }
}
