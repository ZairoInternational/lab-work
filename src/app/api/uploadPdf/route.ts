import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
export async function POST(req:NextRequest){
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if(!file) return NextResponse.json({error: "No file uploaded"},{status:400});

    const arrayBuffer = await file.arrayBuffer();
    const content = Buffer.from(arrayBuffer).toString("base64");

    const filename = `${Date.now()}-${file.name}`;
    const repo = "ZairoInternational/lab-work"
    const path = `public/uploadedpdf/${filename}`;

    const res = await axios.put( `https://api.github.com/repos/${repo}/contents/${path}`,
        {
            message:`Upload product description image ${filename}`,
            content,
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
        }

    )

    const data = await res.data;

  if (!data.content) {
    return NextResponse.json({ error: data.message }, { status: 400 });
  }

  const descriptionUrl = `https://raw.githubusercontent.com/${repo}/main/${path}`;
  return NextResponse.json({ url: descriptionUrl });
}