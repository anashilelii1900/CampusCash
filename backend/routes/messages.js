const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// ─── Get All Conversations (users this person has chatted with) ───────────────
router.get('/conversations', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get the most recent message in each unique conversation
        const sent = await prisma.message.findMany({
            where: { senderId: userId },
            include: {
                receiver: { select: { id: true, name: true, role: true, companyName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const received = await prisma.message.findMany({
            where: { receiverId: userId },
            include: {
                sender: { select: { id: true, name: true, role: true, companyName: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Build a map of userId -> { user, lastMessage, time }
        const conversationsMap = new Map();

        for (const msg of sent) {
            const otherId = msg.receiverId;
            if (!conversationsMap.has(otherId)) {
                conversationsMap.set(otherId, {
                    user: msg.receiver,
                    lastMessage: msg.content,
                    time: msg.createdAt,
                    unread: 0
                });
            }
        }

        for (const msg of received) {
            const otherId = msg.senderId;
            if (!conversationsMap.has(otherId)) {
                conversationsMap.set(otherId, {
                    user: msg.sender,
                    lastMessage: msg.content,
                    time: msg.createdAt,
                    unread: 0
                });
            }
        }

        const conversations = Array.from(conversationsMap.values())
            .sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// ─── Get Conversation with a Specific User ────────────────────────────────────
router.get('/conversation/:userId', authMiddleware, async (req, res) => {
    try {
        const otherUserId = parseInt(req.params.userId);
        const myId = req.user.userId;

        // verify other user exists
        const otherUser = await prisma.user.findUnique({
            where: { id: otherUserId },
            select: { id: true, name: true, role: true, companyName: true }
        });
        if (!otherUser) return res.status(404).json({ error: 'User not found' });

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: myId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: myId }
                ]
            },
            include: {
                sender: { select: { id: true, name: true, role: true, companyName: true } }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json({ otherUser, messages });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// ─── Send a Message ───────────────────────────────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { receiverId, content, fileUrl, fileType } = req.body;

        if (!receiverId || (!content?.trim() && !fileUrl)) {
            return res.status(400).json({ error: 'Receiver ID and either content or file are required' });
        }

        const receiver = await prisma.user.findUnique({ where: { id: parseInt(receiverId) } });
        if (!receiver) return res.status(404).json({ error: 'Receiver not found' });

        if (parseInt(receiverId) === req.user.userId) {
            return res.status(400).json({ error: 'You cannot message yourself' });
        }

        const message = await prisma.message.create({
            data: {
                content: content?.trim() || null,
                fileUrl: fileUrl || null,
                fileType: fileType || null,
                senderId: req.user.userId,
                receiverId: parseInt(receiverId)
            },
            include: {
                sender: { select: { id: true, name: true, role: true, companyName: true, avatarUrl: true } },
                receiver: { select: { id: true, name: true, role: true, companyName: true, avatarUrl: true } }
            }
        });

        // Emit real-time notification via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.to(`user_${receiverId}`).emit('new_message', message);
        }

        res.status(201).json(message);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// ─── Delete a Message (sender only) ──────────────────────────────────────────
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const message = await prisma.message.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!message) return res.status(404).json({ error: 'Message not found' });
        if (message.senderId !== req.user.userId) return res.status(403).json({ error: 'Access denied' });

        await prisma.message.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;
