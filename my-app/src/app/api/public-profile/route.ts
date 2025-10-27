import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

// GET - Fetch public profile by username
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        // Get user profile
        const [userRows]: any = await pool.query(
            `SELECT 
                u.name,
                u.username,
                u.bio,
                u.image_url,
                u.id,
                ut.theme_data
             FROM users u
             LEFT JOIN user_themes ut ON u.id = ut.user_id
             WHERE u.username = ?
             ORDER BY ut.updated_at DESC
             LIMIT 1`,
            [username]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 });
        }

        const userData = userRows[0];
        const userId = userData.id;

        // Parse theme data or use defaults
        let themeData = {
            background_type: 'color',
            background_value: '#ffffff',
            button_style: 'fill',
            button_color: '#000000',
            button_text_color: '#ffffff',
            font_family: 'Inter',
        };

        if (userData.theme_data) {
            // Handle both string and object types (MySQL JSON column returns objects)
            if (typeof userData.theme_data === 'string') {
                try {
                    themeData = JSON.parse(userData.theme_data);
                } catch (e) {
                    console.error('Error parsing theme data:', e);
                }
            } else if (typeof userData.theme_data === 'object') {
                // Already an object (MySQL JSON type)
                themeData = userData.theme_data;
            }
        }

        // Combine user data with theme data
        const profile = {
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
            image_url: userData.image_url,
            ...themeData
        };

        // Get user's visible links
        const [links]: any = await pool.query(
            `SELECT 
                id,
                title,
                url,
                icon,
                is_visible
             FROM links 
             WHERE user_id = ? AND is_visible = TRUE
             ORDER BY display_order ASC, created_at DESC`,
            [userId]
        );

        return NextResponse.json({ 
            profile,
            links: links || []
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching public profile:", error);
        return NextResponse.json({ message: "Error fetching profile", error: error.message }, { status: 500 });
    }
}
