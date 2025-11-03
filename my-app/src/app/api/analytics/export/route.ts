import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

// GET - Export analytics data as JSON
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const clerkUserId = searchParams.get('userId');
        const format = searchParams.get('format') || 'json';

        if (!clerkUserId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Get user ID from clerk_user_id
        const [userRows]: any = await pool.query(
            "SELECT id, username, email, created_at FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userRows[0].id;
        const username = userRows[0].username;
        const email = userRows[0].email;
        const accountCreated = userRows[0].created_at;

        // Get all links with their analytics
        const [links]: any = await pool.query(
            `SELECT 
                id,
                link_type,
                title,
                url,
                clicks,
                is_visible,
                created_at,
                updated_at
             FROM links 
             WHERE user_id = ?
             ORDER BY clicks DESC`,
            [userId]
        );

        // Get total statistics
        const [stats]: any = await pool.query(
            `SELECT 
                COUNT(*) as total_links,
                SUM(clicks) as total_clicks,
                SUM(CASE WHEN is_visible = TRUE THEN 1 ELSE 0 END) as visible_links,
                SUM(CASE WHEN link_type = 'social' THEN 1 ELSE 0 END) as social_links,
                SUM(CASE WHEN link_type = 'project' THEN 1 ELSE 0 END) as project_links
             FROM links 
             WHERE user_id = ?`,
            [userId]
        );

        // Get clicks by type
        const [clicksByType]: any = await pool.query(
            `SELECT 
                link_type,
                SUM(clicks) as clicks
             FROM links 
             WHERE user_id = ?
             GROUP BY link_type`,
            [userId]
        );

        const exportData = {
            exportDate: new Date().toISOString(),
            user: {
                username,
                email,
                accountCreated,
            },
            summary: stats[0],
            clicksByType,
            links,
        };

        if (format === 'csv') {
            // Generate CSV
            let csv = 'Link Title,Link Type,URL,Clicks,Visible,Created At\n';
            links.forEach((link: any) => {
                csv += `"${link.title}","${link.link_type}","${link.url}",${link.clicks},${link.is_visible},${link.created_at}\n`;
            });

            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="${username}-analytics-${Date.now()}.csv"`,
                },
            });
        }

        // Return JSON by default
        return NextResponse.json(exportData, { 
            status: 200,
            headers: {
                'Content-Disposition': `attachment; filename="${username}-analytics-${Date.now()}.json"`,
            },
        });

    } catch (error: any) {
        console.error("Error exporting analytics:", error);
        return NextResponse.json({ 
            message: "Error exporting analytics", 
            error: error.message 
        }, { status: 500 });
    }
}
