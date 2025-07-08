import { PrismaClient, JobStatus, GenderEligibility } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Read the job data from your data.json file
const dataPath = path.join(process.cwd(), '..', 'data.json');
const fullDataPath = path.join(process.cwd(), '..', 'fulldata.json');

interface JobData {
  applicationOpen: string;
  applicationClosed: string;
  psu: boolean;
  genderOpen: string;
  pwdOnly: boolean;
  status: string;
  btech: boolean;
  btechCutoff: number;
  btechBranches: number[];
  mtech: boolean;
  mtechCutoff: number;
  mtechBranches: number[];
  mba: boolean;
  mbaBranches: number[];
  mbaCutoff: number;
  bdes: boolean;
  bdesCutoff: number;
  mdes: boolean;
  mdesCutoff: number;
  ba: boolean;
  baCutoff: number;
  ma: boolean;
  maCutoff: number;
  bba: boolean;
  bbaCutoff: number;
  msc: boolean;
  mscBranches: number[];
  mscCutoff: number;
  tenthPercentageCutoff: number;
  twelfthPercentageCutoff: number;
  undergraduatePercentageCutoff: number;
  jobDescription: string;
  formLink: string;
  location: string;
  backlogsAllowed: number;
  drive: string;
  postData: string;
  openForPlaced: boolean;
  ctcCutoff: number;
  _id: string;
  company: {
    _id: string;
    name: string;
  };
  name: string;
  gradYear: string;
  jobType: string;
  ctc: number;
  handledBy: {
    _id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Function to map gender values
function mapGenderEligibility(genderOpen: string): GenderEligibility {
  switch (genderOpen.toLowerCase()) {
    case 'male':
      return GenderEligibility.MALE;
    case 'female':
      return GenderEligibility.FEMALE;
    case 'both':
    default:
      return GenderEligibility.BOTH;
  }
}

// Function to map job status
function mapJobStatus(status: string): JobStatus {
  switch (status.toLowerCase()) {
    case 'open':
      return JobStatus.OPEN;
    case 'closed':
      return JobStatus.CLOSED;
    case 'draft':
      return JobStatus.DRAFT;
    case 'cancelled':
      return JobStatus.CANCELLED;
    default:
      return JobStatus.OPEN;
  }
}

async function seedJobs() {
  try {
    console.log('🚀 Starting job seeding process...');

    // Read the data file
    let selectedPath = dataPath;
    if (!fs.existsSync(dataPath)) {
      if (fs.existsSync(fullDataPath)) {
        selectedPath = fullDataPath;
        console.log('📁 Using fulldata.json instead of data.json');
      } else {
        console.error('❌ Neither data.json nor fulldata.json found at:', dataPath);
        return;
      }
    } else {
      console.log('📁 Using data.json');
    }

    const rawData = fs.readFileSync(selectedPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const jobs: JobData[] = jsonData.data;

    console.log(`📊 Found ${jobs.length} jobs to seed`);

    // Clear existing jobs (optional - remove this if you want to keep existing jobs)
    await prisma.job.deleteMany({});
    console.log('🗑️ Cleared existing jobs');

    let successCount = 0;
    let errorCount = 0;

    // Process each job
    for (const [index, jobData] of jobs.entries()) {
      try {
        const mappedJob = {
          // Basic Job Information
          name: jobData.name || 'Untitled Job',
          jobDescription: jobData.jobDescription || null,
          formLink: jobData.formLink || null,
          location: jobData.location || null,

          // Company Information
          companyName: jobData.company?.name || 'Unknown Company',
          companyId: jobData.company?._id || null,

          // Job Details
          jobType: jobData.jobType || 'fte',
          ctc: jobData.ctc || 0,
          gradYear: jobData.gradYear || '2025',
          drive: jobData.drive || null,
          postData: jobData.postData || null,

          // Application Timing
          applicationOpen: new Date(jobData.applicationOpen),
          applicationClosed: new Date(jobData.applicationClosed),

          // General Eligibility
          status: mapJobStatus(jobData.status),
          genderOpen: mapGenderEligibility(jobData.genderOpen),
          pwdOnly: jobData.pwdOnly,
          psu: jobData.psu,
          backlogsAllowed: jobData.backlogsAllowed || 0,
          openForPlaced: jobData.openForPlaced,
          ctcCutoff: jobData.ctcCutoff || 0,

          // Academic Cutoffs
          tenthPercentageCutoff: jobData.tenthPercentageCutoff || 0,
          twelfthPercentageCutoff: jobData.twelfthPercentageCutoff || 0,
          undergraduatePercentageCutoff: jobData.undergraduatePercentageCutoff || 0,

          // Degree-Specific Eligibility
          // B.Tech
          btech: jobData.btech,
          btechCutoff: jobData.btechCutoff || 0,
          btechBranches: jobData.btechBranches || [],

          // M.Tech
          mtech: jobData.mtech,
          mtechCutoff: jobData.mtechCutoff || 0,
          mtechBranches: jobData.mtechBranches || [],

          // MBA
          mba: jobData.mba,
          mbaCutoff: jobData.mbaCutoff || 0,
          mbaBranches: jobData.mbaBranches || [],

          // B.Des
          bdes: jobData.bdes,
          bdesCutoff: jobData.bdesCutoff || 0,

          // M.Des
          mdes: jobData.mdes,
          mdesCutoff: jobData.mdesCutoff || 0,

          // BA
          ba: jobData.ba,
          baCutoff: jobData.baCutoff || 0,

          // MA
          ma: jobData.ma,
          maCutoff: jobData.maCutoff || 0,

          // BBA
          bba: jobData.bba,
          bbaCutoff: jobData.bbaCutoff || 0,

          // M.Sc
          msc: jobData.msc,
          mscCutoff: jobData.mscCutoff || 0,
          mscBranches: jobData.mscBranches || [],

          // Admin Information
          handledBy: jobData.handledBy?.email || 'unknown@dtu.ac.in',

          // Timestamps (use original timestamps)
          createdAt: new Date(jobData.createdAt),
          updatedAt: new Date(jobData.updatedAt),
        };

        // Create the job in database
        await prisma.job.create({
          data: mappedJob,
        });

        successCount++;

        // Progress logging
        if ((index + 1) % 50 === 0) {
          console.log(`✅ Processed ${index + 1}/${jobs.length} jobs...`);
        }

      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing job ${index + 1} (${jobData.name || 'Unknown'}):`, error);
        
        // Log the problematic job data for debugging
        if (errorCount <= 3) { // Only log first 3 errors to avoid spam
          console.error('📋 Problematic job data:', {
            name: jobData.name,
            company: jobData.company?.name,
            undergraduatePercentageCutoff: jobData.undergraduatePercentageCutoff,
            backlogsAllowed: jobData.backlogsAllowed,
            mscCutoff: jobData.mscCutoff,
            mtechCutoff: jobData.mtechCutoff,
          });
        }
      }
    }

    console.log(`\n🎉 Job seeding completed!`);
    console.log(`✅ Successfully created: ${successCount} jobs`);
    console.log(`❌ Errors: ${errorCount} jobs`);

    // Optional: Show some stats
    const totalJobs = await prisma.job.count();
    console.log(`📊 Total jobs in database: ${totalJobs}`);

  } catch (error) {
    console.error('❌ Fatal error during job seeding:', error);
    throw error;
  }
}

async function main() {
  await seedJobs();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  })
  .catch(async (e) => {
    console.error('💥 Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 