import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Handles GET requests to /api/pdf/[filename]
export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    // ✅ Construct raw GitHub URL
    const repo = "ZairoInternational/lab-work";
    const url = `https://raw.githubusercontent.com/${repo}/main/public/uploadedpdf/${filename}`;

    // ✅ Fetch file as binary
    const res = await axios.get(url, { responseType: "arraybuffer" });

    // ✅ Return response with correct headers
    return new NextResponse(res.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline", // makes browser try to display instead of download
        "Cache-Control": "public, max-age=86400", // optional: cache for 1 day
      },
    });
  } catch (error: any) {
    console.error("Error fetching PDF:", error.message);
    return NextResponse.json(
      { error: "PDF not found" },
      { status: 404 }
    );
  }
}
