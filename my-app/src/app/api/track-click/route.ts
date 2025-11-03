import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

// Helper function to detect device type from user agent
function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const ua = userAgent.toLowerCase();
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

// POST - Track link click with detailed analytics
export async function POST(req: NextRequest) {
    try {
        const { linkId } = await req.json();

        if (!linkId) {
            return NextResponse.json({ message: "Link ID is required" }, { status: 400 });
        }

        // Get link details to find user_id
        const [linkRows]: any = await pool.query(
            "SELECT user_id FROM links WHERE id = ?",
            [linkId]
        );

        if (!linkRows || linkRows.length === 0) {
            return NextResponse.json({ message: "Link not found" }, { status: 404 });
        }

        const userId = linkRows[0].user_id;

        // Increment click count
        await pool.query(
            "UPDATE links SET clicks = clicks + 1 WHERE id = ?",
            [linkId]
        );

        // Get request metadata
        const userAgent = req.headers.get('user-agent') || '';
        const referrer = req.headers.get('referer') || req.headers.get('referrer') || '';
        const deviceType = getDeviceType(userAgent);
        
        // Get IP address (simplified - in production use proper IP detection)
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 
                   req.headers.get('x-real-ip') || 'unknown';

        // Try to log detailed click data (will fail silently if table doesn't exist yet)
        try {
            await pool.query(
                `INSERT INTO clicks_log 
                (link_id, user_id, referrer, user_agent, ip_address, device_type) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [linkId, userId, referrer, userAgent, ip, deviceType]
            );
        } catch (logError) {
            // Silently fail if clicks_log table doesn't exist
            console.log("Note: clicks_log table not found, skipping detailed logging");
        }

        return NextResponse.json({ 
            message: "Click tracked successfully",
            deviceType: deviceType,
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error tracking click:", error);
        return NextResponse.json({ message: "Error tracking click", error: error.message }, { status: 500 });
    }
}
