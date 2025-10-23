import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

// PUT - Update user bio
export async function PUT(req: NextRequest) {
    try {
        const { clerkUserId, bio } = await req.json();

        if (!clerkUserId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        if (bio && bio.length > 80) {
            return NextResponse.json({ message: "Bio must be 80 characters or less" }, { status: 400 });
        }

        // Update user bio
        await pool.query(
            "UPDATE users SET bio = ? WHERE clerk_user_id = ?",
            [bio || null, clerkUserId]
        );

        return NextResponse.json({ message: "Bio updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating bio:", error);
        return NextResponse.json({ message: "Error updating bio", error: error.message }, { status: 500 });
    }
}

// GET - Get user bio
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const clerkUserId = searchParams.get('userId');

        if (!clerkUserId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const [userRows]: any = await pool.query(
            "SELECT bio FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ bio: userRows[0].bio }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching bio:", error);
        return NextResponse.json({ message: "Error fetching bio", error: error.message }, { status: 500 });
    }
}
