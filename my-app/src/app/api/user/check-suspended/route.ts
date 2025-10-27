import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

// Check if user is suspended
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const clerkUserId = searchParams.get('userId');

        if (!clerkUserId) {
            return NextResponse.json({ isSuspended: false }, { status: 200 });
        }

        // Get user from database
        const [userRows]: any = await pool.query(
            "SELECT is_suspended FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ isSuspended: false }, { status: 200 });
        }

        const isSuspended = userRows[0].is_suspended === 1;

        return NextResponse.json({ isSuspended }, { status: 200 });
    } catch (error: any) {
        console.error("Error checking suspend status:", error);
        return NextResponse.json({ isSuspended: false, error: error.message }, { status: 500 });
    }
}
