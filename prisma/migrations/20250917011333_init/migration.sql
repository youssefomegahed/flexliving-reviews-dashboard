-- CreateTable
CREATE TABLE "public"."Review" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceReviewId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "listingName" TEXT,
    "channel" TEXT,
    "reviewType" TEXT,
    "status" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "text" TEXT NOT NULL,
    "authorName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ReviewCategory" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ReviewCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_listingId_idx" ON "public"."Review"("listingId");

-- CreateIndex
CREATE INDEX "Review_status_idx" ON "public"."Review"("status");

-- CreateIndex
CREATE INDEX "Review_source_sourceReviewId_idx" ON "public"."Review"("source", "sourceReviewId");

-- AddForeignKey
ALTER TABLE "public"."ReviewCategory" ADD CONSTRAINT "ReviewCategory_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
