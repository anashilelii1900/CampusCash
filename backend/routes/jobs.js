const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// ─── Get All Jobs (public) ────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { q, type, location, status } = req.query;

        const where = { status: status || 'active' };

        if (q) {
            where.OR = [
                { title: { contains: q } },
                { company: { contains: q } },
                { description: { contains: q } }
            ];
        }
        if (type) where.type = type;
        if (location) where.location = { contains: location };

        const jobs = await prisma.job.findMany({
            where,
            include: {
                employer: { select: { id: true, name: true, companyName: true } },
                _count: { select: { applications: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(jobs);
    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// ─── Get Job by ID (public) ───────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                employer: { select: { id: true, name: true, companyName: true, companyDescription: true, website: true } },
                _count: { select: { applications: true } }
            }
        });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (error) {
        console.error('Get job error:', error);
        res.status(500).json({ error: 'Failed to fetch job' });
    }
});

// ─── Create Job (Employer only) ───────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Only employers can post jobs' });

    try {
        const { title, description, company, location, salary, type, requirements, responsibilities } = req.body;

        if (!title || !description || !location || !salary || !type) {
            return res.status(400).json({ error: 'Title, description, location, salary, and type are required' });
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                company: company || '',
                location,
                salary,
                type,
                requirements: requirements || '',
                responsibilities: responsibilities || '',
                employerId: req.user.userId
            },
            include: {
                employer: { select: { id: true, name: true, companyName: true } }
            }
        });
        res.status(201).json(job);
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

// ─── Update Job (Employer only, must own job) ─────────────────────────────────
router.put('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });

    try {
        const jobId = parseInt(req.params.id);
        const job = await prisma.job.findUnique({ where: { id: jobId } });

        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.employerId !== req.user.userId) return res.status(403).json({ error: 'You do not own this job' });

        const { employerId, id, createdAt, updatedAt, ...updateData } = req.body;

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: updateData,
            include: {
                employer: { select: { id: true, name: true, companyName: true } }
            }
        });
        res.json(updatedJob);
    } catch (error) {
        console.error('Update job error:', error);
        res.status(500).json({ error: 'Failed to update job' });
    }
});

// ─── Close / Open Job (status toggle) ────────────────────────────────────────
router.patch('/:id/status', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });

    try {
        const jobId = parseInt(req.params.id);
        const { status } = req.body; // 'active' or 'closed'

        if (!['active', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Status must be active or closed' });
        }

        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.employerId !== req.user.userId) return res.status(403).json({ error: 'You do not own this job' });

        const updatedJob = await prisma.job.update({
            where: { id: jobId },
            data: { status }
        });
        res.json(updatedJob);
    } catch (error) {
        console.error('Update job status error:', error);
        res.status(500).json({ error: 'Failed to update job status' });
    }
});

// ─── Delete Job (Employer only, cascades applications) ────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.user.role !== 'employer') return res.status(403).json({ error: 'Access denied' });

    try {
        const jobId = parseInt(req.params.id);
        const job = await prisma.job.findUnique({ where: { id: jobId } });

        if (!job) return res.status(404).json({ error: 'Job not found' });
        if (job.employerId !== req.user.userId) return res.status(403).json({ error: 'You do not own this job' });

        await prisma.application.deleteMany({ where: { jobId } });
        await prisma.job.delete({ where: { id: jobId } });

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Delete job error:', error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

module.exports = router;
