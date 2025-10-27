import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { pool } from "@/config/db";

// Get admin statistics
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify admin status
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const userEmail = user.emailAddresses[0]?.emailAddress;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (userEmail !== adminEmail) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        // Get total users
        const [usersCount]: any = await pool.query(
            "SELECT COUNT(*) as total FROM users"
        );

        // Get total links
        const [linksCount]: any = await pool.query(
            "SELECT COUNT(*) as total FROM links"
        );

        // Get total clicks
        const [clicksCount]: any = await pool.query(
            "SELECT SUM(clicks) as total FROM links"
        );

        // Get active users (users with at least one link)
        const [activeUsers]: any = await pool.query(
            `SELECT COUNT(DISTINCT user_id) as total FROM links`
        );

        const stats = {
            totalUsers: usersCount[0].total,
            totalLinks: linksCount[0].total,
            totalClicks: clicksCount[0].total || 0,
            activeUsers: activeUsers[0].total,
        };

        return NextResponse.json({ stats }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ message: "Error fetching stats", error: error.message }, { status: 500 });
    }
}
