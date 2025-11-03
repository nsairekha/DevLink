import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { pool } from "@/config/db";

// GET - Aggregated analytics across all users for admin
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

        const { searchParams } = new URL(req.url);
        const dateRange = searchParams.get("dateRange") || "30"; // days

        // Date range window
        const [rangeRows]: any = await pool.query("SELECT DATE_SUB(CURDATE(), INTERVAL ? DAY) as startDate", [parseInt(dateRange, 10)]);
        const startDate = rangeRows[0].startDate;

        // Summary
        const [[usersCount]]: any = await pool.query("SELECT COUNT(*) as total FROM users");
        const [[linksCount]]: any = await pool.query("SELECT COUNT(*) as total FROM links");
        const [[clicksCount]]: any = await pool.query("SELECT COALESCE(SUM(clicks), 0) as total FROM links");

        // Clicks by link type (across all users)
        const [clicksByType]: any = await pool.query(
            `SELECT link_type, COALESCE(SUM(clicks), 0) AS clicks
             FROM links
             GROUP BY link_type`
        );

        // Link type distribution (count of links per type)
        const [linkTypeDistribution]: any = await pool.query(
            `SELECT link_type, COUNT(*) AS count
             FROM links
             GROUP BY link_type`
        );

        // New users per day in range
        const [newUsersByDay]: any = await pool.query(
            `SELECT DATE(created_at) as day, COUNT(*) as count
             FROM users
             WHERE created_at >= ?
             GROUP BY DATE(created_at)
             ORDER BY day ASC`,
            [startDate]
        );

        // Top users by total clicks
        const [topUsers]: any = await pool.query(
            `SELECT u.id, u.name, u.username, COALESCE(SUM(l.clicks), 0) as total_clicks
             FROM users u
             LEFT JOIN links l ON u.id = l.user_id
             GROUP BY u.id
             ORDER BY total_clicks DESC
             LIMIT 10`
        );

        // Clicks per day across all links (in range)
        const [clicksPerDay]: any = await pool.query(
            `SELECT d.day, COALESCE(SUM(l.clicks), 0) as clicks
             FROM (
                 SELECT DATE_SUB(CURDATE(), INTERVAL seq DAY) as day
                 FROM (
                     SELECT 0 seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                     UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                     UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
                     UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
                     UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
                     UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29
                     UNION ALL SELECT 30 UNION ALL SELECT 31 UNION ALL SELECT 32 UNION ALL SELECT 33 UNION ALL SELECT 34
                     UNION ALL SELECT 35 UNION ALL SELECT 36 UNION ALL SELECT 37 UNION ALL SELECT 38 UNION ALL SELECT 39
                     UNION ALL SELECT 40 UNION ALL SELECT 41 UNION ALL SELECT 42 UNION ALL SELECT 43 UNION ALL SELECT 44
                     UNION ALL SELECT 45 UNION ALL SELECT 46 UNION ALL SELECT 47 UNION ALL SELECT 48 UNION ALL SELECT 49
                     UNION ALL SELECT 50 UNION ALL SELECT 51 UNION ALL SELECT 52 UNION ALL SELECT 53 UNION ALL SELECT 54
                     UNION ALL SELECT 55 UNION ALL SELECT 56 UNION ALL SELECT 57 UNION ALL SELECT 58 UNION ALL SELECT 59
                 ) as seqs
             ) d
             LEFT JOIN links l ON DATE(l.updated_at) = d.day
             WHERE d.day >= ?
             GROUP BY d.day
             ORDER BY d.day ASC`,
            [startDate]
        );

        const analytics = {
            summary: {
                totalUsers: usersCount.total,
                totalLinks: linksCount.total,
                totalClicks: clicksCount.total,
                windowStart: startDate,
            },
            clicksByType,
            linkTypeDistribution,
            newUsersByDay,
            clicksPerDay,
            topUsers,
        };

        return NextResponse.json({ analytics }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching admin analytics:", error);
        return NextResponse.json({ message: "Error fetching analytics", error: error.message }, { status: 500 });
    }
}


