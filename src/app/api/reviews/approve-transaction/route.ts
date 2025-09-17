import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    console.log('Approve endpoint (transaction version) called');
    const body = await req.json();
    console.log('Request body:', body);
    const { id, approved } = body as { id: string; approved: boolean };
    console.log('Parsed params:', { id, approved });

    if (!id || typeof approved !== 'boolean') {
      console.log('Invalid parameters:', { id, approved });
      return NextResponse.json(
        { error: 'Missing or invalid parameters' },
        { status: 400 },
      );
    }

    const status = approved ? 'published' : 'unpublished';
    console.log('Target status:', status);

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      console.log('Starting transaction...');

      // Check if review exists within transaction
      const existingReview = await tx.review.findUnique({
        where: { id },
      });

      console.log(
        'Found review in transaction:',
        existingReview ? 'Yes' : 'No',
      );

      if (!existingReview) {
        throw new Error('Review not found');
      }

      console.log('Existing review details:', {
        id: existingReview.id,
        currentStatus: existingReview.status,
        targetStatus: status,
      });

      // Check if the status is already what we want to set
      if (existingReview.status === status) {
        console.log('Review already has the target status, no update needed');
        return {
          success: true,
          review: existingReview,
          message: 'Review already has the target status',
        };
      }

      // Validate the status value
      const validStatuses = ['published', 'unpublished', 'pending', 'hidden'];
      if (!validStatuses.includes(status)) {
        throw new Error(
          `Invalid status value. Must be one of: ${validStatuses.join(', ')}`,
        );
      }

      console.log('Performing update within transaction...');

      // Perform the update within the transaction
      const updated = await tx.review.update({
        where: { id },
        data: { status },
      });

      console.log('Update completed within transaction:', {
        id: updated.id,
        status: updated.status,
      });

      // Verify the update within the same transaction
      const verification = await tx.review.findUnique({
        where: { id },
        select: { id: true, status: true },
      });

      console.log('Verification within transaction:', verification);

      if (verification?.status !== status) {
        throw new Error(
          `Update verification failed! Expected: ${status}, Got: ${verification?.status}`,
        );
      }

      console.log('Transaction completed successfully');
      return { success: true, review: updated };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Approve endpoint (transaction) error:', err);

    // Handle specific error types
    if (err instanceof Error) {
      if (err.message === 'Review not found') {
        return NextResponse.json(
          { error: 'Review not found' },
          { status: 404 },
        );
      }
      if (err.message.includes('Invalid status value')) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    return NextResponse.json(
      {
        error: 'Failed to update approval status',
        details:
          process.env.NODE_ENV === 'development' ? String(err) : undefined,
      },
      { status: 500 },
    );
  }
}
