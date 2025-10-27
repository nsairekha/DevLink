import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { pool } from "@/config/db";

// Get all users for admin
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

        // Get all users with their link counts and total clicks
        const [users]: any = await pool.query(
            `SELECT 
                u.id,
                u.clerk_user_id,
                u.email,
                u.name,
                u.username,
                u.provider,
                u.is_suspended,
                u.created_at,
                COUNT(DISTINCT l.id) as link_count,
                COALESCE(SUM(l.clicks), 0) as total_clicks
             FROM users u
             LEFT JOIN links l ON u.id = l.user_id
             GROUP BY u.id
             ORDER BY u.created_at DESC`
        );

        return NextResponse.json({ users }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 });
    }
}
