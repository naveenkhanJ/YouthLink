import { PrismaClient } from '../generated/prisma/client.js';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/modules/account/passwordHash.js';
import { encryptNic, getNicLast4 } from '../src/modules/account/nicCrypto.js';
import config from '../src/config/index.js';

const pool = new pg.Pool({ connectionString: config.databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');
  
  // Wipe everything safely
  console.log('Truncating tables...');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "User", "AdminAccount", "GigPosting", "Application", "Engagement", "Rating", "Endorsement", "Notification" CASCADE');

  const defaultPassword = await hashPassword('Password123!');
  
  const workerNic = '200012345678';
  const employerNic = '198012345678';
  const endorserNic = '197012345678';

  // 1. Users
  console.log('Creating users...');
  const worker = await prisma.user.create({
    data: {
      role: 'YOUTH_JOB_SEEKER',
      phone: '+94770000001',
      phoneVerifiedAt: new Date(),
      passwordHash: defaultPassword,
      nicEncrypted: encryptNic(workerNic),
      nicLast4: getNicLast4(workerNic),
      legalName: 'Amal Perera',
      birthdate: new Date('2000-01-01'),
      bio: 'Enthusiastic and reliable worker.',
      tosAcceptedAt: new Date(),
      accountStatus: 'ACTIVE'
    }
  });

  const employer = await prisma.user.create({
    data: {
      role: 'EMPLOYER',
      phone: '+94770000002',
      phoneVerifiedAt: new Date(),
      passwordHash: defaultPassword,
      nicEncrypted: encryptNic(employerNic),
      nicLast4: getNicLast4(employerNic),
      legalName: 'Kamal Silva',
      postingAsType: 'BUSINESS',
      businessName: 'Silva Retailers',
      birthdate: new Date('1980-01-01'),
      tosAcceptedAt: new Date(),
      accountStatus: 'ACTIVE'
    }
  });

  const endorser = await prisma.user.create({
    data: {
      role: 'COMMUNITY_ENDORSER',
      phone: '+94770000003',
      phoneVerifiedAt: new Date(),
      passwordHash: defaultPassword,
      nicEncrypted: encryptNic(endorserNic),
      nicLast4: getNicLast4(endorserNic),
      legalName: 'Sunil Teacher',
      birthdate: new Date('1970-01-01'),
      tosAcceptedAt: new Date(),
      accountStatus: 'ACTIVE',
      endorsementCode: 'SNLTCH'
    }
  });

  // 2. Admin
  console.log('Creating admin...');
  const admin = await prisma.adminAccount.create({
    data: {
      phone: '+94770000004',
      passwordHash: defaultPassword,
      role: 'ADMIN'
    }
  });

  // 3. Gig Postings
  console.log('Creating gigs...');
  const gig1 = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: 'Store Helper Needed',
      description: 'Help organize shelves and manage inventory for the weekend.',
      category: 'RETAIL',
      arrangementType: 'GIG',
      payKind: 'RATE',
      payAmount: 500,
      payRateUnit: 'DAY',
      postedAsType: 'BUSINESS',
      postedBusinessName: 'Silva Retailers',
      locationAddress: '123 Main St, Colombo',
      locationLat: 6.9271,
      locationLng: 79.8612,
      locationAreaLabel: 'Colombo 01',
      workersNeeded: 2,
      startAt: new Date(Date.now() + 86400000 * 2),
      status: 'OPEN'
    }
  });

  const gig2 = await prisma.gigPosting.create({
    data: {
      employerId: employer.id,
      title: 'Flyer Distribution',
      description: 'Distribute flyers around the neighborhood.',
      category: 'DELIVERY',
      arrangementType: 'PART_TIME',
      payKind: 'FIXED_TOTAL',
      payAmount: 2000,
      postedAsType: 'BUSINESS',
      postedBusinessName: 'Silva Retailers',
      locationAddress: '456 Galle Rd, Colombo',
      locationLat: 6.9,
      locationLng: 79.85,
      locationAreaLabel: 'Colombo 03',
      workersNeeded: 1,
      startAt: new Date(Date.now() + 86400000 * 5),
      status: 'OPEN'
    }
  });

  // 4. Applications
  console.log('Creating applications...');
  const application1 = await prisma.application.create({
    data: {
      gigPostingId: gig1.id,
      workerId: worker.id,
      status: 'PENDING',
      note: 'I live nearby and can start immediately.'
    }
  });

  // 5. Engagements
  console.log('Creating engagements...');
  const engagement1 = await prisma.engagement.create({
    data: {
      applicationId: application1.id,
      gigPostingId: gig1.id,
      workerId: worker.id,
      employerId: employer.id,
      status: 'ACTIVE',
      arrivalCode: 'ARR123',
      completionCode: 'CMP456'
    }
  });

  // 6. Endorsement
  console.log('Creating endorsements...');
  await prisma.endorsement.create({
    data: {
      endorserId: endorser.id,
      workerId: worker.id,
      attributes: ['RELIABILITY'],
      reason: 'Amal is always on time.',
      entryPoint: 'CODE'
    }
  });

  console.log('Seed completed successfully!');
  console.log('\\n--- Test Accounts ---');
  console.log('Youth Job-Seeker: +94770000001');
  console.log('Employer:         +94770000002');
  console.log('Endorser:         +94770000003');
  console.log('Admin:            +94770000004');
  console.log('Password (all):   Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
