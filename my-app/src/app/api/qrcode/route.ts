import { NextRequest, NextResponse } from "next/server";
import QRCode from 'qrcode';

// GET - Generate QR code for profile URL
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');
        const size = searchParams.get('size') || '300';

        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }

        // Generate profile URL
        const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${username}`;

        // Generate QR code
        const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
            width: parseInt(size),
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        });

        return NextResponse.json({ 
            qrCode: qrCodeDataUrl,
            profileUrl: profileUrl,
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error generating QR code:", error);
        return NextResponse.json({ 
            message: "Error generating QR code", 
            error: error.message 
        }, { status: 500 });
    }
}
