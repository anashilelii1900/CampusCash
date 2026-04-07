const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// ─── Get reviews for a user (public-ish, but keep auth for now) ────────────────
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (Number.isNaN(userId)) return res.status(400).json({ error: 'Invalid userId' });

    const reviews = await prisma.review.findMany({
      where: { reviewedId: userId },
      include: {
        reviewer: { select: { id: true, name: true, companyName: true, role: true } },
        job: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const aggregate = await prisma.review.aggregate({
      where: { reviewedId: userId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.json({
      averageRating: aggregate._avg.rating || 0,
      count: aggregate._count.rating || 0,
      reviews,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// ─── Create review (Employer → Student, only if accepted application exists) ─
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can leave reviews' });
    }

    const { reviewedId, rating, comment, jobId } = req.body;
    const reviewedUserId = parseInt(reviewedId);
    const parsedJobId = jobId ? parseInt(jobId) : null;
    const parsedRating = parseInt(rating);

    if (Number.isNaN(reviewedUserId)) return res.status(400).json({ error: 'reviewedId is required' });
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'rating must be between 1 and 5' });
    }
    if (!comment || !String(comment).trim()) return res.status(400).json({ error: 'comment is required' });

    const reviewed = await prisma.user.findUnique({ where: { id: reviewedUserId } });
    if (!reviewed) return res.status(404).json({ error: 'Reviewed user not found' });
    if (reviewed.role !== 'student') return res.status(400).json({ error: 'Only students can be reviewed' });

    // Authorization: employer must have accepted application with this student
    const acceptedApp = await prisma.application.findFirst({
      where: {
        status: 'accepted',
        studentId: reviewedUserId,
        job: {
          employerId: req.user.userId,
          ...(parsedJobId ? { id: parsedJobId } : {}),
        },
      },
      include: { job: true },
    });

    if (!acceptedApp) {
      return res.status(403).json({ error: 'You can only review students you have hired (accepted application)' });
    }

    const review = await prisma.review.create({
      data: {
        reviewerId: req.user.userId,
        reviewedId: reviewedUserId,
        rating: parsedRating,
        comment: String(comment).trim(),
        jobId: parsedJobId || acceptedApp.jobId,
      },
      include: {
        reviewer: { select: { id: true, name: true, companyName: true, role: true } },
        reviewed: { select: { id: true, name: true, role: true, university: true, major: true } },
        job: { select: { id: true, title: true } },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

module.exports = router;

