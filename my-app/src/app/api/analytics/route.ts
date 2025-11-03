import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

// GET - Fetch user analytics with date range support
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const clerkUserId = searchParams.get('userId');
        const dateRange = searchParams.get('dateRange') || '30'; // default 30 days
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        if (!clerkUserId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Get user ID from clerk_user_id
        const [userRows]: any = await pool.query(
            "SELECT id, created_at FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userRows[0].id;
        const accountCreatedAt = userRows[0].created_at;

        // Get total links count
        const [linksCount]: any = await pool.query(
            "SELECT COUNT(*) as total FROM links WHERE user_id = ?",
            [userId]
        );

        // Get visible links count
        const [visibleLinksCount]: any = await pool.query(
            "SELECT COUNT(*) as total FROM links WHERE user_id = ? AND is_visible = TRUE",
            [userId]
        );

        // Get total clicks
        const [totalClicks]: any = await pool.query(
            "SELECT SUM(clicks) as total FROM links WHERE user_id = ?",
            [userId]
        );

        // Get clicks by link type
        const [clicksByType]: any = await pool.query(
            `SELECT 
                link_type,
                SUM(clicks) as clicks
             FROM links 
             WHERE user_id = ?
             GROUP BY link_type`,
            [userId]
        );

        // Get top performing links
        const [topLinks]: any = await pool.query(
            `SELECT 
                title,
                clicks,
                link_type,
                icon
             FROM links 
             WHERE user_id = ? AND is_visible = TRUE
             ORDER BY clicks DESC
             LIMIT 5`,
            [userId]
        );

        // Build date filter
        let dateFilter = '';
        let dateParams: any[] = [];
        
        if (startDate && endDate) {
            dateFilter = 'AND created_at BETWEEN ? AND ?';
            dateParams = [startDate, endDate];
        } else {
            dateFilter = `AND created_at >= DATE_SUB(NOW(), INTERVAL ${dateRange} DAY)`;
        }

        // Get clicks over time with date range
        const clicksQuery = `
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as links_created
             FROM links 
             WHERE user_id = ? ${dateFilter}
             GROUP BY DATE(created_at)
             ORDER BY date ASC
        `;
        const [clicksOverTime]: any = await pool.query(
            clicksQuery,
            [userId, ...dateParams]
        );

        // Get daily clicks trend (simulated from links data)
        const dailyClicksQuery = `
            SELECT 
                DATE(updated_at) as date,
                SUM(clicks) as total_clicks
             FROM links 
             WHERE user_id = ? ${dateFilter}
             GROUP BY DATE(updated_at)
             ORDER BY date ASC
        `;
        const [dailyClicks]: any = await pool.query(
            dailyClicksQuery,
            [userId, ...dateParams]
        );

        // Get link type distribution
        const [linkTypeDistribution]: any = await pool.query(
            `SELECT 
                link_type,
                COUNT(*) as count
             FROM links 
             WHERE user_id = ?
             GROUP BY link_type`,
            [userId]
        );

        // Calculate average clicks per link
        const avgClicksPerLink = linksCount[0].total > 0 
            ? Math.round((totalClicks[0].total || 0) / linksCount[0].total) 
            : 0;

        // Calculate CTR (Click-Through Rate) - clicks per visible link
        const ctr = visibleLinksCount[0].total > 0
            ? ((totalClicks[0].total || 0) / visibleLinksCount[0].total).toFixed(2)
            : 0;

        const analytics = {
            summary: {
                totalLinks: linksCount[0].total,
                visibleLinks: visibleLinksCount[0].total,
                totalClicks: totalClicks[0].total || 0,
                accountCreatedAt: accountCreatedAt,
                avgClicksPerLink: avgClicksPerLink,
                clickThroughRate: ctr,
            },
            clicksByType: clicksByType,
            topLinks: topLinks,
            clicksOverTime: clicksOverTime,
            dailyClicks: dailyClicks,
            linkTypeDistribution: linkTypeDistribution,
            dateRange: {
                range: dateRange,
                startDate: startDate,
                endDate: endDate,
            },
        };

        return NextResponse.json({ analytics }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching analytics:", error);
        return NextResponse.json({ message: "Error fetching analytics", error: error.message }, { status: 500 });
    }
}
