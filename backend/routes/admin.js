const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const adminMiddleware = require('../middleware/admin');

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_campus_cash_token';

// ─── Admin Login ──────────────────────────────────────────────────────────────
// Admins can log in via the normal /api/auth/login route too — but this
// dedicated endpoint adds extra admin-only validation.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin account not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...safe } = user;
    res.json({ token, user: safe });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Stats Overview ───────────────────────────────────────────────────────────
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const [totalUsers, totalStudents, totalEmployers, totalJobs, totalApplications, totalMessages, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'employer' } }),
      prisma.job.count(),
      prisma.application.count(),
      prisma.message.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      })
    ]);
    res.json({ totalUsers, totalStudents, totalEmployers, totalJobs, totalApplications, totalMessages, recentUsers });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── All Users ────────────────────────────────────────────────────────────────
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, university: true, companyName: true, createdAt: true, avatarUrl: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Delete User ──────────────────────────────────────────────────────────────
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Delete dependents first
    await prisma.message.deleteMany({ where: { OR: [{ senderId: id }, { receiverId: id }] } });
    await prisma.application.deleteMany({ where: { studentId: id } });
    await prisma.review.deleteMany({ where: { OR: [{ reviewerId: id }, { reviewedId: id }] } });
    await prisma.payment.deleteMany({ where: { employerId: id } });
    await prisma.job.deleteMany({ where: { employerId: id } });
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ─── All Jobs ─────────────────────────────────────────────────────────────────
router.get('/jobs', adminMiddleware, async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: { employer: { select: { name: true, companyName: true } }, _count: { select: { applications: true } } }
    });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── Delete Job ───────────────────────────────────────────────────────────────
router.delete('/jobs/:id', adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.application.deleteMany({ where: { jobId: id } });
    await prisma.review.deleteMany({ where: { jobId: id } });
    await prisma.job.delete({ where: { id } });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// ─── All Applications ─────────────────────────────────────────────────────────
router.get('/applications', adminMiddleware, async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { name: true, email: true } },
        job: { select: { title: true, company: true } }
      }
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
