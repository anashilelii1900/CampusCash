const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// ─── Get My Profile ───────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// ─── Update My Profile ────────────────────────────────────────────────────────
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const FORBIDDEN = ['password', 'role', 'email', 'id', 'createdAt', 'updatedAt'];
        const updateData = {};
        for (const [key, value] of Object.entries(req.body)) {
            if (!FORBIDDEN.includes(key)) {
                updateData[key] = value;
            }
        }

        const user = await prisma.user.update({
            where: { id: req.user.userId },
            data: updateData
        });
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// ─── Get User by ID (for public profiles / messaging) ────────────────────────
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: {
                id: true,
                name: true,
                role: true,
                university: true,
                major: true,
                skills: true,
                companyName: true,
                companyDescription: true,
                website: true,
                createdAt: true
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// ─── Search Users (employers can search students, and vice versa) ─────────────
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { role, q } = req.query;
        const where = {};

        if (role) where.role = role;
        if (q) {
            where.OR = [
                { name: { contains: q } },
                { university: { contains: q } },
                { companyName: { contains: q } }
            ];
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                role: true,
                university: true,
                major: true,
                companyName: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});

module.exports = router;
