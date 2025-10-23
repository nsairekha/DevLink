import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";
import { auth } from "@clerk/nextjs/server";

// GET all links for a user
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const clerkUserId = searchParams.get('userId');

        if (!clerkUserId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Get user from database
        const [userRows]: any = await pool.query(
            "SELECT id FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userRows[0].id;

        // Get all links for the user
        const [links]: any = await pool.query(
            "SELECT * FROM links WHERE user_id = ? ORDER BY display_order ASC, created_at DESC",
            [userId]
        );

        return NextResponse.json({ links }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching links:", error);
        return NextResponse.json({ message: "Error fetching links", error: error.message }, { status: 500 });
    }
}

// POST - Create a new link
export async function POST(req: NextRequest) {
    try {
        const { clerkUserId, type, title, url, icon } = await req.json();

        if (!clerkUserId || !title || !url) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Get user from database
        const [userRows]: any = await pool.query(
            "SELECT id FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userRows[0].id;

        // Get the current max display_order
        const [orderRows]: any = await pool.query(
            "SELECT MAX(display_order) as max_order FROM links WHERE user_id = ?",
            [userId]
        );

        const displayOrder = (orderRows[0]?.max_order || 0) + 1;

        // Insert new link
        const [result]: any = await pool.query(
            "INSERT INTO links (user_id, link_type, title, url, icon, display_order) VALUES (?, ?, ?, ?, ?, ?)",
            [userId, type || 'project', title, url, icon || 'FaLink', displayOrder]
        );

        return NextResponse.json({ 
            message: "Link created successfully",
            linkId: result.insertId
        }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating link:", error);
        return NextResponse.json({ message: "Error creating link", error: error.message }, { status: 500 });
    }
}

// PUT - Update a link
export async function PUT(req: NextRequest) {
    try {
        const { linkId, clerkUserId, title, url, isVisible } = await req.json();

        if (!linkId || !clerkUserId) {
            return NextResponse.json({ message: "Link ID and User ID are required" }, { status: 400 });
        }

        // Get user from database
        const [userRows]: any = await pool.query(
            "SELECT id FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userRows[0].id;

        // Build update query dynamically
        const updates: string[] = [];
        const values: any[] = [];

        if (title !== undefined) {
            updates.push("title = ?");
            values.push(title);
        }
        if (url !== undefined) {
            updates.push("url = ?");
            values.push(url);
        }
        if (isVisible !== undefined) {
            updates.push("is_visible = ?");
            values.push(isVisible);
        }

        if (updates.length === 0) {
            return NextResponse.json({ message: "No fields to update" }, { status: 400 });
        }

        values.push(linkId, userId);

        await pool.query(
            `UPDATE links SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
            values
        );

        return NextResponse.json({ message: "Link updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating link:", error);
        return NextResponse.json({ message: "Error updating link", error: error.message }, { status: 500 });
    }
}

// DELETE - Delete a link
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const linkId = searchParams.get('linkId');
        const clerkUserId = searchParams.get('userId');

        if (!linkId || !clerkUserId) {
            return NextResponse.json({ message: "Link ID and User ID are required" }, { status: 400 });
        }

        // Get user from database
        const [userRows]: any = await pool.query(
            "SELECT id FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userRows[0].id;

        // Delete the link
        await pool.query(
            "DELETE FROM links WHERE id = ? AND user_id = ?",
            [linkId, userId]
        );

        return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting link:", error);
        return NextResponse.json({ message: "Error deleting link", error: error.message }, { status: 500 });
    }
}
