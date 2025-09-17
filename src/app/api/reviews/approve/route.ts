import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    console.log('Approve endpoint called');
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

    // Check if database is accessible
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        {
          error: 'Database connection failed',
          details:
            process.env.NODE_ENV === 'development'
              ? String(dbError)
              : undefined,
        },
        { status: 500 },
      );
    }

    // Check if review exists
    console.log('Looking for review with id:', id);
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });
    console.log('Found review:', existingReview ? 'Yes' : 'No');

    if (!existingReview) {
      console.log('Review not found, returning 404');
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Additional validation checks
    console.log('Existing review details:', {
      id: existingReview.id,
      currentStatus: existingReview.status,
      targetStatus: status,
    });

    // Check if the status is already what we want to set
    if (existingReview.status === status) {
      console.log('Review already has the target status, no update needed');
      return NextResponse.json({
        success: true,
        review: existingReview,
        message: 'Review already has the target status',
      });
    }

    // Validate the status value
    const validStatuses = ['published', 'unpublished', 'pending', 'hidden'];
    if (!validStatuses.includes(status)) {
      console.error('Invalid status value:', status);
      return NextResponse.json(
        {
          error: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`,
        },
        { status: 400 },
      );
    }

    console.log('Starting Prisma update operation...');
    console.log('Update parameters:', { where: { id }, data: { status } });

    // Perform the update with detailed error handling
    let updated;
    try {
      updated = await prisma.review.update({
        where: { id },
        data: { status },
      });
      console.log('Prisma update completed successfully');
      console.log('Updated review:', {
        id: updated.id,
        status: updated.status,
      });
    } catch (updateError) {
      console.error('Prisma update operation failed:', updateError);
      console.error('Update error details:', {
        name: updateError instanceof Error ? updateError.name : 'Unknown',
        message:
          updateError instanceof Error
            ? updateError.message
            : String(updateError),
        stack: updateError instanceof Error ? updateError.stack : undefined,
      });
      throw updateError;
    }

    // Verify the update actually worked
    console.log('Verifying update...');
    const verification = await prisma.review.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    console.log('Verification query result:', verification);

    if (verification?.status !== status) {
      console.error(
        'Update verification failed! Expected:',
        status,
        'Got:',
        verification?.status,
      );
      return NextResponse.json(
        {
          error: 'Update verification failed',
          expected: status,
          actual: verification?.status,
        },
        { status: 500 },
      );
    }

    console.log('Update verification passed');

    return NextResponse.json({ success: true, review: updated });
  } catch (err) {
    console.error('Approve endpoint error:', err);

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
