const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/messages');
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
        cb(null, 'message-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for messages
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|zip|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname || mimetype) {
            return cb(null, true);
        }
        cb(new Error('File type not allowed'));
    }
});

// ─── Upload Message File ───────────────────────────────────────────────────
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'Please upload a file' });
        
        const fileUrl = `/uploads/messages/${req.file.filename}`;
        const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'file';

        res.json({ fileUrl, fileType });
    } catch (error) {
        console.error('Message upload error:', error);
        res.status(500).json({ error: 'Failed to upload message file' });
    }
});

module.exports = router;
