const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/uploads');
const messageUploadsRoutes = require('./routes/messageUploads');
const adminRoutes = require('./routes/admin');

const app = express();

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*', // In production, restrict to your frontend domain
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger (dev only) ────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── Health Check ─────────────────────────────────────────────────────────────
const { PrismaClient } = require('@prisma/client');
const prismaHealth = new PrismaClient();
app.get('/api/health', async (_req, res) => {
  try {
    await prismaHealth.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message, timestamp: new Date().toISOString() });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/messages/upload', messageUploadsRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'An unexpected error occurred' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Broadcast IO to the app so we can use it in routes
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Users can join their own room to receive private messages
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   WebSockets enabled`);

  // Auto-seed on startup (creates admin + demo data if they don't exist)
  (async () => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const bcrypt = require('bcrypt');
      const seedPrisma = new PrismaClient();

      const adminEmail = 'admin@campuscash.tn';
      const existing = await seedPrisma.user.findUnique({ where: { email: adminEmail } });
      if (!existing) {
        const adminHash = await bcrypt.hash('Admin@2026!', 10);
        await seedPrisma.user.create({ data: { name: 'Admin', email: adminEmail, password: adminHash, role: 'admin' } });
        console.log('✅ Admin account seeded: admin@campuscash.tn / Admin@2026!');

        // Demo student
        const stHash = await bcrypt.hash('student123', 10);
        const student = await seedPrisma.user.create({ data: { name: 'Yasmine Guedri', email: 'student@example.com', password: stHash, role: 'student', university: 'INSAT', major: 'Software Engineering', skills: 'React, Node.js, Python' } });

        // Demo employer
        const emHash = await bcrypt.hash('employer123', 10);
        const employer = await seedPrisma.user.create({ data: { name: 'TechFlow Solutions', email: 'employer@example.com', password: emHash, role: 'employer', companyName: 'TechFlow Solutions', companyDescription: 'Modern SaaS for enterprise.', website: 'https://techflow.example.com' } });

        // Sample jobs
        const sampleJobs = [
          { title: 'Frontend Developer Intern', description: 'Build UI components with React.', type: 'Part-time', requirements: 'React, HTML, CSS', salary: '500 TND/month', location: 'Remote', responsibilities: 'UI development tasks.' },
          { title: 'Social Media Manager', description: 'Manage Instagram and LinkedIn.', type: 'Freelance', requirements: 'Canva, Social Media', salary: '300 TND/month', location: 'Remote', responsibilities: 'Content creation and scheduling.' },
          { title: 'Data Analyst Intern', description: 'Analyze user data with SQL and Python.', type: 'Part-time', requirements: 'SQL, Python, Pandas', salary: '600 TND/month', location: 'Tunis (Hybrid)', responsibilities: 'Data analysis and reporting.' },
          { title: 'UX/UI Designer', description: 'Redesign dashboard and user flows.', type: 'Freelance', requirements: 'Figma, Prototyping', salary: '800 TND/project', location: 'Remote', responsibilities: 'Design and prototyping.' },
          { title: 'Backend Node.js Developer', description: 'Build scalable REST APIs.', type: 'Part-time', requirements: 'Node.js, Express, PostgreSQL', salary: '700 TND/month', location: 'Tunis (Hybrid)', responsibilities: 'API development.' },
        ];
        for (const job of sampleJobs) {
          await seedPrisma.job.create({ data: { ...job, company: 'TechFlow Solutions', employerId: employer.id, status: 'active' } });
        }
        const jobs = await seedPrisma.job.findMany({ take: 3 });
        for (let i = 0; i < jobs.length; i++) {
          await seedPrisma.application.create({ data: { jobId: jobs[i].id, studentId: student.id, status: ['pending','accepted','rejected'][i] } });
        }
        console.log('✅ Demo data seeded successfully!');
      } else {
        console.log('ℹ️  Database already seeded, skipping.');
      }
      await seedPrisma.$disconnect();
    } catch (e) {
      console.error('⚠️  Seed error (non-fatal):', e.message);
    }
  })();
});
