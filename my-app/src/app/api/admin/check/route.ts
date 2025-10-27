import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Check if user is admin
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ isAdmin: false }, { status: 401 });
        }

        // Get user data from Clerk
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        
        const userEmail = user.emailAddresses[0]?.emailAddress;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (!adminEmail) {
            console.error('ADMIN_EMAIL not set in environment variables');
            return NextResponse.json({ isAdmin: false }, { status: 200 });
        }

        const isAdmin = userEmail === adminEmail;

        return NextResponse.json({ 
            isAdmin,
            email: userEmail 
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error checking admin status:", error);
        return NextResponse.json({ 
            isAdmin: false,
            error: error.message 
        }, { status: 500 });
    }
}
