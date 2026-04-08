/**
 * Production Seed Script
 * Creates admin account + sample data on first run.
 * Safe to run multiple times (idempotent).
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production seed...');

  // ─── Admin Account ──────────────────────────────────────────────────────────
  const adminEmail = 'admin@campuscash.tn';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const adminHash = await bcrypt.hash('Admin@2026!', 10);
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, password: adminHash, role: 'admin' }
    });
    console.log('✅ Admin account created: admin@campuscash.tn / Admin@2026!');
  } else {
    console.log('ℹ️  Admin already exists, skipping.');
  }

  // ─── Demo Student ───────────────────────────────────────────────────────────
  const studentEmail = 'student@example.com';
  let studentUser = await prisma.user.findUnique({ where: { email: studentEmail } });
  if (!studentUser) {
    const studentHash = await bcrypt.hash('student123', 10);
    studentUser = await prisma.user.create({
      data: {
        name: 'Yasmine Guedri', email: studentEmail, password: studentHash, role: 'student',
        university: 'INSAT', major: 'Software Engineering', skills: 'React, Node.js, Python, TypeScript',
      }
    });
    console.log('✅ Demo student created');
  }

  // ─── Demo Employer ──────────────────────────────────────────────────────────
  const employerEmail = 'employer@example.com';
  let employerUser = await prisma.user.findUnique({ where: { email: employerEmail } });
  if (!employerUser) {
    const employerHash = await bcrypt.hash('employer123', 10);
    employerUser = await prisma.user.create({
      data: {
        name: 'TechFlow Solutions', email: employerEmail, password: employerHash, role: 'employer',
        companyName: 'TechFlow Solutions',
        companyDescription: 'We build modern SaaS products for enterprise clients.',
        website: 'https://techflow.example.com',
      }
    });
    console.log('✅ Demo employer created');
  }

  // ─── Sample Jobs (only if database is empty) ────────────────────────────────
  const jobCount = await prisma.job.count();
  if (jobCount === 0) {
    const jobsData = [
      { title: 'Frontend Developer Intern', desc: 'Work with React and TypeScript to build UI components for our platform.', type: 'Part-time', req: 'React, HTML, CSS, TypeScript', salary: '500 TND / month', loc: 'Remote' },
      { title: 'Social Media Manager', desc: 'Manage our Instagram and LinkedIn presence and grow our brand.', type: 'Freelance', req: 'Canva, Social Media Strategy, Copywriting', salary: '300 TND / month', loc: 'Remote' },
      { title: 'Data Analyst Intern', desc: 'Analyze user behavior data and create insightful dashboards.', type: 'Part-time', req: 'SQL, Python, Pandas, Power BI', salary: '600 TND / month', loc: 'Tunis (Hybrid)' },
      { title: 'UX/UI Designer', desc: 'Redesign our product dashboard and create beautiful user flows.', type: 'Freelance', req: 'Figma, Prototyping, User Research', salary: '800 TND / project', loc: 'Remote' },
      { title: 'Backend Node.js Developer', desc: 'Help build and scale our REST APIs and services.', type: 'Part-time', req: 'Node.js, Express, PostgreSQL', salary: '700 TND / month', loc: 'Tunis (Hybrid)' },
      { title: 'Content Writer (Tech)', desc: 'Write 4 blog posts a month about tech trends and tutorials.', type: 'Freelance', req: 'Excellent English, Tech Terminology', salary: '40 TND / article', loc: 'Remote' },
      { title: 'Video Editor', desc: 'Edit short-form videos for TikTok and Instagram Reels.', type: 'Freelance', req: 'Premiere Pro, CapCut, Motion Graphics', salary: '150 TND / video', loc: 'Remote' },
      { title: 'Marketing Assistant', desc: 'Assist with email campaigns, market research and brand strategy.', type: 'Part-time', req: 'Mailchimp, Research Skills, Communication', salary: '400 TND / month', loc: 'Tunis (Hybrid)' },
    ];

    for (const j of jobsData) {
      await prisma.job.create({
        data: {
          title: j.title, description: j.desc, company: employerUser.companyName,
          location: j.loc, salary: j.salary, type: j.type,
          requirements: j.req, responsibilities: 'Various tasks related to the role.',
          employerId: employerUser.id, status: 'active',
        }
      });
    }
    console.log(`✅ ${jobsData.length} sample jobs created`);

    // Sample Applications
    const jobs = await prisma.job.findMany({ take: 3 });
    const statuses = ['pending', 'accepted', 'rejected'];
    for (let i = 0; i < 3; i++) {
      await prisma.application.create({
        data: { jobId: jobs[i].id, studentId: studentUser.id, status: statuses[i] }
      });
    }
    console.log('✅ Sample applications created');

    // Sample Payment
    await prisma.payment.createMany({
      data: [
        { amount: 500, currency: 'TND', status: 'paid', description: 'Monthly platform fee', employerId: employerUser.id },
        { amount: 1200, currency: 'TND', status: 'paid', description: 'Student payout - Frontend Project', employerId: employerUser.id },
      ]
    });
    console.log('✅ Sample payments created');
  } else {
    console.log('ℹ️  Jobs already exist, skipping sample data.');
  }

  console.log('\n🎉 Seed completed!');
  console.log('  Admin:    admin@campuscash.tn   / Admin@2026!');
  console.log('  Student:  student@example.com   / student123');
  console.log('  Employer: employer@example.com  / employer123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
