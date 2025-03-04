import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Helper function for error responses
const errorResponse = (message: string, status: number) => 
  NextResponse.json({ error: message }, { status });

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = (await params);

    if (!id) {
      return errorResponse("Recording ID is required", 400);
    }

    const result = await sql`
      SELECT * FROM recordings
      WHERE id = ${id}
    `;

    if (!result || result.length === 0) {
      return errorResponse("Recording not found", 404);
    }

    return NextResponse.json(result[0]);

  } catch (error) {
    console.error('Error fetching recording:', error);
    return errorResponse("Failed to fetch recording", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = (await params);
    
    if (!id) {
      return errorResponse("Recording ID is required", 400);
    }

    const deleteResult = await sql`
      DELETE FROM recordings
      WHERE id = ${id}
      RETURNING id
    `;

    if (!deleteResult || deleteResult.length === 0) {
      return errorResponse("Recording not found", 404);
    }

    return NextResponse.json({ 
      success: true,
      message: "Recording deleted successfully",
      deletedId: deleteResult[0].id
    });

  } catch (error) {
    console.error('Error deleting recording:', error);
    return errorResponse("Failed to delete recording", 500);
  }
}