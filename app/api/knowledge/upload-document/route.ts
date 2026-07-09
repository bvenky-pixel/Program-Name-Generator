import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { processSourceDocument } from "@/lib/engine/documentExtraction";
import path from "path";
import fs from "fs/promises";

/**
 * POST /api/knowledge/upload-document
 * Upload a source document (PDF, text, etc) for knowledge extraction.
 * Triggers Document Processing and Knowledge Extraction layers.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["application/pdf", "text/plain", "text/csv"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Accepted: PDF, TXT, CSV` },
        { status: 400 }
      );
    }

    // Save file to disk
    const uploadDir = path.join(process.cwd(), "data", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(uploadDir, filename);
    const buffer = await file.arrayBuffer();
    await fs.writeFile(uploadPath, Buffer.from(buffer));

    // Create source document record
    const db = getDb();
    const result = db
      .prepare(
        `INSERT INTO source_documents (filename, file_type, file_size_bytes, upload_path, uploaded_at, processing_status)
         VALUES (?, ?, ?, ?, ?, 'pending')`
      )
      .run(file.name, file.type, file.size, uploadPath, new Date().toISOString());

    const sourceDocumentId = result.lastInsertRowid as number;

    // Process document asynchronously (in production, would queue this)
    processSourceDocument(sourceDocumentId)
      .then(() => {
        // Success — candidates are ready for review
      })
      .catch((err) => {
        // Error logged in source_documents table, visible to user
        console.error(`Document extraction failed for ${sourceDocumentId}:`, err);
      });

    return NextResponse.json({
      success: true,
      sourceDocumentId,
      filename,
      status: "pending",
      message: "Document uploaded and queued for processing. Check back soon for extracted candidates.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
