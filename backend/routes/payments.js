const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const prisma = new PrismaClient();
const router = express.Router();

// ─── Get my payments (Employer) ───────────────────────────────────────────────
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can view payments' });
    }

    const payments = await prisma.payment.findMany({
      where: { employerId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    res.json(payments);
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// ─── Create payment (Employer) - mock checkout ────────────────────────────────
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can create payments' });
    }

    const { amount, currency, description, status } = req.body;
    const parsedAmount = parseInt(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'amount must be a positive integer' });
    }

    const payment = await prisma.payment.create({
      data: {
        employerId: req.user.userId,
        amount: parsedAmount,
        currency: currency || 'TND',
        description: description || 'Marketplace payment',
        status: status || 'paid',
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

module.exports = router;

