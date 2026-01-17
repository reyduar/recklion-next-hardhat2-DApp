import { NextResponse } from "next/server";
import { pinata } from "@/lib/pinata.server";

export async function POST(req: Request) {
  try {
    console.log("📥 Recibiendo metadata request...");
    const metadata = await req.json();
    console.log("📄 Metadata:", metadata);

    // Sugerencia mínima de validación
    if (!metadata?.name || !metadata?.image) {
      console.error("❌ Invalid metadata:", {
        hasName: !!metadata?.name,
        hasImage: !!metadata?.image,
      });
      return NextResponse.json(
        { error: "Metadata requires name + image" },
        { status: 400 }
      );
    }

    console.log("⬆️ Uploading metadata to Pinata...");

    // Convertir metadata JSON a File para subirlo con upload.file()
    const metadataString = JSON.stringify(metadata);
    const metadataBlob = new Blob([metadataString], {
      type: "application/json",
    });
    const metadataFile = new File([metadataBlob], "metadata.json", {
      type: "application/json",
    });

    const res = await pinata.upload.public.file(metadataFile);

    console.log("✅ Metadata upload successful:", res);

    return NextResponse.json({
      cid: res.cid,
      tokenURI: `ipfs://${res.cid}`,
    });
  } catch (error) {
    console.error("❌ Error uploading metadata to Pinata:", error);
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
        error: "Failed to upload metadata",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
