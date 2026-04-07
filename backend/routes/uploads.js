const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, png) and PDFs are allowed'));
    }
});

// ─── Upload Avatar ──────────────────────────────────────────────────────────
router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Please upload a file' });
        
        const avatarUrl = `/uploads/${req.file.filename}`;
        await prisma.user.update({
            where: { id: req.user.userId },
            data: { avatarUrl }
        });

        res.json({ avatarUrl });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
});

// ─── Upload Resume ──────────────────────────────────────────────────────────
router.post('/resume', authMiddleware, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Please upload a file' });
        
        const resumeUrl = `/uploads/${req.file.filename}`;
        await prisma.user.update({
            where: { id: req.user.userId },
            data: { resumeUrl }
        });

        res.json({ resumeUrl });
    } catch (error) {
        console.error('Resume upload error:', error);
        res.status(500).json({ error: 'Failed to upload resume' });
    }
});

// ─── Upload Portfolio ────────────────────────────────────────────────────────
const portfolioUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, '../uploads/portfolio');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'portfolio-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|pdf|zip|doc|docx|mp4|webm/;
        const ok = allowed.test(path.extname(file.originalname).toLowerCase()) || allowed.test(file.mimetype);
        if (ok) return cb(null, true);
        cb(new Error('File type not allowed for portfolio'));
    }
});

router.post('/portfolio', authMiddleware, portfolioUpload.single('portfolio'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Please upload a file' });

        const portfolioUrl = `/uploads/portfolio/${req.file.filename}`;
        await prisma.user.update({
            where: { id: req.user.userId },
            data: { portfolioUrl }
        });

        res.json({ portfolioUrl });
    } catch (error) {
        console.error('Portfolio upload error:', error);
        res.status(500).json({ error: 'Failed to upload portfolio' });
    }
});

module.exports = router;
