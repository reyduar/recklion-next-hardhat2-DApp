import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata.server";

export async function POST(req: Request) {
  try {
    console.log("📥 Recibiendo upload request...");
    const form = await req.formData();
    const file = form.get("file");

    console.log("📄 File info:", {
      name: file instanceof File ? file.name : "not a file",
      type: file instanceof File ? file.type : "unknown",
      size: file instanceof File ? file.size : 0,
    });

    if (!file || !(file instanceof File)) {
      console.error("❌ Invalid file");
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    console.log("⬆️ Uploading to Pinata...");
    // Subida pública (ideal para NFTs públicos)
    const res = await pinata.upload.public.file(file);

    console.log("✅ Upload successful:", res);

    return NextResponse.json({
      cid: res.cid,
      ipfs: `ipfs://${res.cid}`,
    });
  } catch (error) {
    console.error("❌ Error uploading to Pinata:", error);
    console.error("Error type:", typeof error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown"
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );

    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : String(error),
        type: typeof error,
      },
      { status: 500 }
    );
  }
}
