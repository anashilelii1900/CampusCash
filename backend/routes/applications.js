const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// ─── Apply to a Job (Student only) ───────────────────────────────────────────
router.post('/:jobId', authMiddleware, async (req, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Only students can apply for jobs' });

    try {
        const jobId = parseInt(req.params.jobId);

        // Check job exists and is active
        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.status !== 'active') return res.status(400).json({ error: 'This job is no longer accepting applications' });

        // Check duplicate
        const existing = await prisma.application.findFirst({
            where: { jobId, studentId: req.user.userId }
        });
        if (existing) return res.status(400).json({ error: 'You have already applied for this job' });

        const application = await prisma.application.create({
            data: { jobId, studentId: req.user.userId },
            include: {
                job: { include: { employer: { select: { id: true, name: true, companyName: true } } } }
            }
        });
        res.status(201).json(application);
    } catch (error) {
        console.error('Apply error:', error);
        res.status(500).json({ error: 'Failed to apply for job' });
    }
});

// ─── Get Applications (student sees own; employer sees their job apps) ─────────
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role === 'student') {
            const applications = await prisma.application.findMany({
                where: { studentId: req.user.userId },
                include: {
                    job: {
                        include: { employer: { select: { id: true, name: true, companyName: true } } }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(applications);
        }

        if (req.user.role === 'employer') {
            const applications = await prisma.application.findMany({
                where: { job: { employerId: req.user.userId } },
                include: {
                    student: {
                        select: { id: true, name: true, email: true, university: true, major: true, skills: true }
                    },
                    job: { select: { id: true, title: true, location: true, salary: true, type: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            return res.json(applications);
        }

        res.status(403).json({ error: 'Access denied' });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// ─── Get Single Application ───────────────────────────────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const application = await prisma.application.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                student: { select: { id: true, name: true, email: true, university: true, major: true, skills: true } },
                job: { include: { employer: { select: { id: true, name: true, companyName: true } } } }
            }
        });
        if (!application) return res.status(404).json({ error: 'Application not found' });

        // Authorization check
        const isOwner = req.user.role === 'student'
            ? application.studentId === req.user.userId
            : application.job.employerId === req.user.userId;

        if (!isOwner) return res.status(403).json({ error: 'Access denied' });

        res.json(application);
    } catch (error) {
        console.error('Get application error:', error);
        res.status(500).json({ error: 'Failed to fetch application' });
    }
});

// ─── Update Application Status (Employer only) ────────────────────────────────
router.put('/:id/status', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Only employers can update application status' });

    try {
        const { status } = req.body;
        const VALID = ['pending', 'interview', 'accepted', 'rejected'];
        if (!VALID.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${VALID.join(', ')}` });
        }

        const application = await prisma.application.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { job: true }
        });
        if (!application) return res.status(404).json({ error: 'Application not found' });
        if (application.job.employerId !== req.user.userId) return res.status(403).json({ error: 'Access denied' });

        const updated = await prisma.application.update({
            where: { id: parseInt(req.params.id) },
            data: { status },
            include: {
                student: { select: { id: true, name: true, university: true, major: true } },
                job: { select: { id: true, title: true } }
            }
        });
        res.json(updated);
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// ─── Withdraw Application (Student only) ─────────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Only students can withdraw applications' });

    try {
        const application = await prisma.application.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!application) return res.status(404).json({ error: 'Application not found' });
        if (application.studentId !== req.user.userId) return res.status(403).json({ error: 'Access denied' });

        await prisma.application.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Application withdrawn successfully' });
    } catch (error) {
        console.error('Withdraw application error:', error);
        res.status(500).json({ error: 'Failed to withdraw application' });
    }
});

module.exports = router;
