import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db"

export const POST = async (req: NextRequest) => {
    try {
        const { username } = await req.json();

        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

        if ((rows as any[]).length > 0) {
            return NextResponse.json({ available: false }, { status: 200 });
        } 

        return NextResponse.json({ available: true }, { status: 200 });
    } catch (error: any) {
        console.error("Error checking username availability:", error);
        return NextResponse.json({ message: "Error checking username", error: error.message }, { status: 500 });
    }
}