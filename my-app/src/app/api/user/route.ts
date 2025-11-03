import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db"

export const POST = async (req: NextRequest) => {
    try {
        const { clerk_user_id, email, name, username, imageUrl, provider } = await req.json();

        const [result] = await pool.query(
            "INSERT INTO users (clerk_user_id, email, name, username, image_url, provider) VALUES (?, ?, ?, ?, ?, ?)",
            [clerk_user_id, email, name, username, imageUrl, provider]
        );

        return NextResponse.json({ message: "User synced successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error syncing user to database:", error);
        return NextResponse.json({ message: "Error syncing user", error: error.message }, { status: 500 });
    }
}

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        console.log("Received userId in API:", userId);

        if (userId) {
            const [rows] = await pool.query("SELECT * FROM users WHERE clerk_user_id = ?", [userId]);
            console.log("Fetched users from database:", rows);
            return NextResponse.json({ user: rows }, { status: 200 });
        }

        return NextResponse.json({ users: null }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching users from database:", error);
        return NextResponse.json({ message: "Error fetching users", error: error.message }, { status: 500 });
    }
}

// PUT - Update user profile
export async function PUT(req: NextRequest) {
    try {
        const { clerkUserId, username, imageUrl } = await req.json();

        if (!clerkUserId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Build dynamic update set and params based on provided fields
        const fields: string[] = [];
        const params: any[] = [];

        if (typeof username === 'string' && username.trim() !== '') {
            // Check if username is already taken by another user
            const [existingUsers]: any = await pool.query(
                "SELECT id FROM users WHERE username = ? AND clerk_user_id != ?",
                [username, clerkUserId]
            );

            if (existingUsers && existingUsers.length > 0) {
                return NextResponse.json({ message: "Username is already taken" }, { status: 400 });
            }
            fields.push('username = ?');
            params.push(username);
        }

        if (typeof imageUrl === 'string') {
            fields.push('image_url = ?');
            params.push(imageUrl || null);
        }

        if (fields.length === 0) {
            return NextResponse.json({ message: "No fields to update" }, { status: 400 });
        }

        params.push(clerkUserId);

        await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE clerk_user_id = ?`,
            params
        );

        return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ message: "Error updating user profile", error: error.message }, { status: 500 });
    }
}