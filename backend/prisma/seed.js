const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with massive fake data...');

  // Clear existing data (order matters because of foreign keys)
  await prisma.message.deleteMany();
  await prisma.review.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);
  const studentHash = await bcrypt.hash('student123', 10);
  const employerHash = await bcrypt.hash('employer123', 10);

  // 1. Create Default Users for testing
  const studentUser = await prisma.user.create({
    data: {
      name: 'Yasmine Guedri',
      email: 'student@example.com',
      password: studentHash,
      role: 'student',
      university: 'INSAT',
      major: 'Software Engineering',
      skills: 'React, Node.js, Python, TypeScript',
    },
  });

  const employerUser = await prisma.user.create({
    data: {
      name: 'TechFlow Solutions',
      email: 'employer@example.com',
      password: employerHash,
      role: 'employer',
      companyName: 'TechFlow Solutions',
      companyDescription: 'We build modern SaaS products for enterprise clients.',
      website: 'https://techflow.example.com',
    },
  });

  // 2. Additional Students
  const students = [];
  const studentNames = ['Ali Mansour', 'Sarah Oueslati', 'Ahmed Trabelsi', 'Nour Elhouda', 'Omar Khemiri'];
  const universities = ['ESPRIT', 'ENIT', 'IHEC Carthage', 'ISG Tunis', 'FST'];
  const majors = ['Computer Science', 'Data Science', 'Marketing', 'Business Administration', 'Graphic Design'];
  const skillsList = ['Python, SQL', 'Figma, Adobe XD', 'SEO, Marketing', 'Excel, Finance', 'JavaScript, HTML/CSS'];

  for (let i = 0; i < 5; i++) {
    const s = await prisma.user.create({
      data: {
        name: studentNames[i],
        email: `student${i + 1}@example.com`,
        password: passwordHash,
        role: 'student',
        university: universities[i],
        major: majors[i],
        skills: skillsList[i],
      },
    });
    students.push(s);
  }
  students.push(studentUser);

  // 3. Additional Employers
  const employers = [];
  const employerCompanies = ['Vortex AI', 'Creative Spark', 'Global Logistics Co', 'HealthSync', 'EduPlatform'];
  const companyDesc = ['AI solutions', 'Creative ad agency', 'Supply chain tech', 'Healthcare software', 'EdTech platform'];

  for (let i = 0; i < 5; i++) {
    const e = await prisma.user.create({
      data: {
        name: employerCompanies[i],
        email: `employer${i + 1}@example.com`,
        password: passwordHash,
        role: 'employer',
        companyName: employerCompanies[i],
        companyDescription: companyDesc[i],
        website: `https://${employerCompanies[i].toLowerCase().replace(' ', '')}.com`,
      },
    });
    employers.push(e);
  }
  employers.push(employerUser);

  // 4. Create Jobs
  const jobsData = [
    { title: 'Frontend Developer Intern', desc: 'Work with React and Tailwind to build UI components.', type: 'Part-time', req: 'React, HTML, CSS', salary: '500 TND / month' },
    { title: 'Social Media Manager', desc: 'Manage our Instagram and LinkedIn presence.', type: 'Freelance', req: 'Canva, Social Media Strategy', salary: '300 TND / month' },
    { title: 'Data Analyst Intern', desc: 'Help us analyze user behavior data using SQL and Python.', type: 'Part-time', req: 'SQL, Python, Pandas', salary: '600 TND / month' },
    { title: 'UX/UI Designer', desc: 'Redesign our dashboard and user flows.', type: 'Freelance', req: 'Figma, Prototyping', salary: '800 TND / project' },
    { title: 'Content Writer', desc: 'Write 4 blog posts a month about tech trends.', type: 'Freelance', req: 'Excellent English, Tech terminology', salary: '40 TND / article' },
    { title: 'Backend Node.js Dev', desc: 'Help build scalable APIs.', type: 'Part-time', req: 'Node.js, Express, PostgreSQL', salary: '700 TND / month' },
    { title: 'Marketing Assistant', desc: 'Assist with email campaigns and market research.', type: 'Part-time', req: 'Mailchimp, Research skills', salary: '400 TND / month' },
    { title: 'Video Editor', desc: 'Edit short-form videos for TikTok and Reels.', type: 'Freelance', req: 'Premiere Pro, CapCut', salary: '150 TND / video' },
    { title: 'SEO Specialist', desc: 'Optimize our landing pages for search engines.', type: 'Freelance', req: 'SEO optimization, Google Analytics', salary: '500 TND / project' },
    { title: 'Customer Support Representative', desc: 'Answer customer tickets on weekends.', type: 'Part-time', req: 'Good communication, English', salary: '450 TND / month' }
  ];

  const jobs = [];
  for (let i = 0; i < jobsData.length; i++) {
    const employer = employers[i % employers.length];
    const job = await prisma.job.create({
      data: {
        title: jobsData[i].title,
        description: jobsData[i].desc,
        company: employer.companyName,
        location: i % 2 === 0 ? 'Remote' : 'Tunis (Hybrid)',
        salary: jobsData[i].salary,
        type: jobsData[i].type,
        requirements: jobsData[i].req,
        responsibilities: 'Various tasks related to the role.',
        employerId: employer.id,
        status: 'active',
      },
    });
    jobs.push(job);
  }

  // 5. Create Applications
  for (let i = 0; i < 15; i++) {
    const student = students[i % students.length];
    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const statusOpts = ['pending', 'accepted', 'rejected'];
    await prisma.application.create({
      data: {
        jobId: job.id,
        studentId: student.id,
        status: statusOpts[i % 3],
      },
    });
  }

  // Generate specific applications for the test users so their dashboards look good
  await prisma.application.create({ data: { jobId: jobs[0].id, studentId: studentUser.id, status: 'pending' } });
  await prisma.application.create({ data: { jobId: jobs[1].id, studentId: studentUser.id, status: 'accepted' } });
  await prisma.application.create({ data: { jobId: jobs[2].id, studentId: studentUser.id, status: 'rejected' } });

  // 6. Messages
  await prisma.message.createMany({
    data: [
      { content: 'Hi there! I saw your application for the Frontend role.', senderId: employerUser.id, receiverId: studentUser.id },
      { content: 'Hello! Yes, I am very interested. I have 2 years of experience with React.', senderId: studentUser.id, receiverId: employerUser.id },
      { content: 'Great! Let us schedule a quick interview next week.', senderId: employerUser.id, receiverId: studentUser.id },
    ]
  });

  // 7. Reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Excellent work! Delivered the project ahead of schedule with high quality.',
      reviewerId: employerUser.id,
      reviewedId: studentUser.id,
      jobId: jobs[1].id,
    }
  });
  
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Great employer, very clear instructions and prompt payment.',
      reviewerId: studentUser.id,
      reviewedId: employerUser.id,
      jobId: jobs[1].id,
    }
  });

  // 8. Payments for employer dashboard
  await prisma.payment.createMany({
    data: [
      { amount: 500, currency: 'TND', status: 'paid', description: 'Monthly platform fee', employerId: employerUser.id },
      { amount: 1200, currency: 'TND', status: 'paid', description: 'Student payout - Frontend Project', employerId: employerUser.id },
      { amount: 150, currency: 'TND', status: 'pending', description: 'Job listing promotion', employerId: employerUser.id },
      { amount: 300, currency: 'TND', status: 'paid', description: 'Platform fee', employerId: employers[0].id },
    ]
  });

  console.log('✅ Seed completed successfully!');
  console.log('Test accounts:');
  console.log('- Student:  email=student@example.com  password=student123');
  console.log('- Employer: email=employer@example.com password=employer123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
