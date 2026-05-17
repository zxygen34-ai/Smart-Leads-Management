import mongoose from 'mongoose';

import { connectDb } from '../config/db';
import { Lead } from '../models/Lead';

const leads = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@novalite.in', status: 'New', source: 'Website' },
  { name: 'Aditi Iyer', email: 'aditi.iyer@northpeak.in', status: 'Contacted', source: 'Instagram' },
  { name: 'Arjun Rao', email: 'arjun.rao@cobalt.in', status: 'Qualified', source: 'Referral' },
  { name: 'Bhavya Kapoor', email: 'bhavya.kapoor@brightline.in', status: 'Lost', source: 'Website' },
  { name: 'Chirag Bansal', email: 'chirag.bansal@mintlane.in', status: 'New', source: 'Instagram' },
  { name: 'Divya Nair', email: 'divya.nair@silversky.in', status: 'Contacted', source: 'Website' },
  { name: 'Eshan Gupta', email: 'eshan.gupta@bluefield.in', status: 'Qualified', source: 'Referral' },
  { name: 'Farah Khan', email: 'farah.khan@sunrise.in', status: 'Lost', source: 'Instagram' },
  { name: 'Gaurav Mehta', email: 'gaurav.mehta@lynxgrid.in', status: 'New', source: 'Website' },
  { name: 'Harini Das', email: 'harini.das@orbitlane.in', status: 'Contacted', source: 'Referral' },
  { name: 'Ishaan Verma', email: 'ishaan.verma@pivottree.in', status: 'Qualified', source: 'Website' },
  { name: 'Jia Patel', email: 'jia.patel@cloudnest.in', status: 'Lost', source: 'Instagram' },
  { name: 'Kabir Singh', email: 'kabir.singh@opalstack.in', status: 'New', source: 'Referral' },
  { name: 'Lakshmi Menon', email: 'lakshmi.menon@greenwave.in', status: 'Contacted', source: 'Website' },
  { name: 'Manav Joshi', email: 'manav.joshi@starforge.in', status: 'Qualified', source: 'Instagram' },
  { name: 'Nandini Reddy', email: 'nandini.reddy@altitude.in', status: 'Lost', source: 'Website' },
  { name: 'Omkar Kulkarni', email: 'omkar.kulkarni@quanta.in', status: 'New', source: 'Referral' },
  { name: 'Priya Nair', email: 'priya.nair@solarwind.in', status: 'Contacted', source: 'Instagram' },
  { name: 'Rohan Malhotra', email: 'rohan.malhotra@citrine.in', status: 'Qualified', source: 'Website' },
  { name: 'Sanya Chatterjee', email: 'sanya.chatterjee@arclight.in', status: 'Lost', source: 'Referral' },
  { name: 'Tanvi Desai', email: 'tanvi.desai@glowline.in', status: 'New', source: 'Website' },
  { name: 'Uday Mishra', email: 'uday.mishra@crestbridge.in', status: 'Contacted', source: 'Instagram' },
  { name: 'Vikram Shetty', email: 'vikram.shetty@auric.in', status: 'Qualified', source: 'Referral' },
  { name: 'Yashika Goel', email: 'yashika.goel@silverpeak.in', status: 'Lost', source: 'Website' },
  { name: 'Zoya Siddiqui', email: 'zoya.siddiqui@northbay.in', status: 'New', source: 'Instagram' }
];

async function seed(): Promise<void> {
  await connectDb();
  await Lead.syncIndexes();

  let inserted = 0;
  let skipped = 0;

  for (const lead of leads) {
    const email = lead.email.trim().toLowerCase();
    const result = await Lead.updateOne(
      { email },
      { $setOnInsert: { ...lead, email } },
      { upsert: true }
    );

    if (result.upsertedCount && result.upsertedCount > 0) {
      inserted += 1;
    } else {
      skipped += 1;
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Seed complete: ${inserted} inserted, ${skipped} skipped.`);

  await mongoose.connection.close();
}

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed failed', error);
  process.exit(1);
});
