import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

// POST - Track link click
export async function POST(req: NextRequest) {
    try {
        const { linkId } = await req.json();

        if (!linkId) {
            return NextResponse.json({ message: "Link ID is required" }, { status: 400 });
        }

        // Increment click count
        await pool.query(
            "UPDATE links SET clicks = clicks + 1 WHERE id = ?",
            [linkId]
        );

        return NextResponse.json({ message: "Click tracked successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error tracking click:", error);
        return NextResponse.json({ message: "Error tracking click", error: error.message }, { status: 500 });
    }
}
