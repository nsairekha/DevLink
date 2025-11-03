import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { pool } from "@/config/db";

// DELETE - Delete a user and all their data
export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const params = await props.params;
        const { userId: adminUserId } = await auth();

        if (!adminUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify admin status
        const client = await clerkClient();
        const user = await client.users.getUser(adminUserId);
        const userEmail = user.emailAddresses[0]?.emailAddress;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (userEmail !== adminEmail) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const userIdToDelete = parseInt(params.userId);

        // Delete user (CASCADE will delete all related links and themes)
        await pool.query(
            "DELETE FROM users WHERE id = ?",
            [userIdToDelete]
        );

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Error deleting user", error: error.message }, { status: 500 });
    }
}

// PATCH - Update user suspend status
export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ userId: string }> }
) {
    try {
        const params = await props.params;
        const { userId: adminUserId } = await auth();

        if (!adminUserId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Verify admin status
        const client = await clerkClient();
        const user = await client.users.getUser(adminUserId);
        const userEmail = user.emailAddresses[0]?.emailAddress;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (userEmail !== adminEmail) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const userIdToUpdate = parseInt(params.userId);
        const { suspended } = await req.json();

        // Update user suspended status
        await pool.query(
            "UPDATE users SET is_suspended = ? WHERE id = ?",
            [suspended, userIdToUpdate]
        );

        return NextResponse.json({ 
            message: `User ${suspended ? 'suspended' : 'activated'} successfully` 
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating user status:", error);
        return NextResponse.json({ message: "Error updating user status", error: error.message }, { status: 500 });
    }
}
