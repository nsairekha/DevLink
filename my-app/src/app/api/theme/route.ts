import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/config/db";

// GET - Fetch user theme settings
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const clerkUserId = searchParams.get('userId');

        if (!clerkUserId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Get user ID from clerk_user_id
        const [userRows]: any = await pool.query(
            "SELECT id FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userRows[0].id;

        // Get theme from user_themes table
        const [themeRows]: any = await pool.query(
            "SELECT theme_data FROM user_themes WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1",
            [userId]
        );

        // Provide defaults if no theme exists
        let theme;
        if (themeRows && themeRows.length > 0) {
            const themeDataStr = themeRows[0].theme_data;
            
            // Handle both string and object types
            if (typeof themeDataStr === 'string') {
                try {
                    theme = JSON.parse(themeDataStr);
                } catch (e) {
                    console.error('Failed to parse theme_data:', themeDataStr);
                    // Return defaults if parsing fails
                    theme = {
                        background_type: 'color',
                        background_value: '#ffffff',
                        button_style: 'fill',
                        button_color: '#000000',
                        button_text_color: '#ffffff',
                        font_family: 'Inter',
                    };
                }
            } else if (typeof themeDataStr === 'object') {
                // Already an object (MySQL JSON type)
                theme = themeDataStr;
            } else {
                // Fallback to defaults
                theme = {
                    background_type: 'color',
                    background_value: '#ffffff',
                    button_style: 'fill',
                    button_color: '#000000',
                    button_text_color: '#ffffff',
                    font_family: 'Inter',
                };
            }
        } else {
            theme = {
                background_type: 'color',
                background_value: '#ffffff',
                button_style: 'fill',
                button_color: '#000000',
                button_text_color: '#ffffff',
                font_family: 'Inter',
            };
        }
        
        return NextResponse.json({ theme }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching theme:", error);
        return NextResponse.json({ message: "Error fetching theme", error: error.message }, { status: 500 });
    }
}

// PUT - Update user theme settings
export async function PUT(req: NextRequest) {
    try {
        const { 
            clerkUserId, 
            background_type, 
            background_value, 
            button_style, 
            button_color, 
            button_text_color, 
            font_family 
        } = await req.json();

        if (!clerkUserId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        // Get user ID from clerk_user_id
        const [userRows]: any = await pool.query(
            "SELECT id FROM users WHERE clerk_user_id = ?",
            [clerkUserId]
        );

        if (!userRows || userRows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const userId = userRows[0].id;

        // Prepare theme data as JSON
        const themeData = {
            background_type: background_type || 'color',
            background_value: background_value || '#ffffff',
            button_style: button_style || 'fill',
            button_color: button_color || '#000000',
            button_text_color: button_text_color || '#ffffff',
            font_family: font_family || 'Inter',
        };

        // Check if theme exists
        const [existingTheme]: any = await pool.query(
            "SELECT id FROM user_themes WHERE user_id = ?",
            [userId]
        );

        if (existingTheme && existingTheme.length > 0) {
            // Update existing theme
            await pool.query(
                "UPDATE user_themes SET theme_data = ?, theme_name = 'custom', updated_at = NOW() WHERE user_id = ?",
                [JSON.stringify(themeData), userId]
            );
        } else {
            // Insert new theme
            await pool.query(
                "INSERT INTO user_themes (user_id, theme_name, theme_data) VALUES (?, 'custom', ?)",
                [userId, JSON.stringify(themeData)]
            );
        }

        return NextResponse.json({ message: "Theme updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating theme:", error);
        return NextResponse.json({ message: "Error updating theme", error: error.message }, { status: 500 });
    }
}
