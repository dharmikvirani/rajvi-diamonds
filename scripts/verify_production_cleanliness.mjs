import fs from 'fs';
import path from 'path';

// Parse .env.local manually
if (fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing.');
  process.exit(1);
}

const headers = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function dbFetch(endpoint, options = {}) {
  const url = `${supabaseUrl}/rest/v1${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`DB Error [${res.status}]: ${errText}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function verifyCleanliness() {
  console.log('================================================================');
  console.log('PRODUCTION CLEANLINESS & ANALYTICS AUDIT');
  console.log('================================================================\n');

  // 1. Inquiries Audit
  console.log('--- 1. INQUIRIES AUDIT ---');
  const inquiries = await dbFetch('/inquiries?select=*&order=created_at.desc');
  console.log(`Total inquiries in Supabase: ${inquiries.length}`);

  const testInquiries = inquiries.filter(
    (inq) =>
      inq.email?.includes('example.com') ||
      inq.email?.includes('qa.audit') ||
      inq.email?.includes('test') ||
      inq.name?.toLowerCase().includes('qa test') ||
      inq.name?.toLowerCase().includes('qa audit') ||
      inq.name?.toLowerCase().includes('automated test')
  );

  console.log(`Found ${testInquiries.length} test inquiries:`);
  for (const ti of testInquiries) {
    console.log(` - ID: ${ti.id} | Name: ${ti.name} | Email: ${ti.email} | Created: ${ti.created_at}`);
    await dbFetch(`/inquiries?id=eq.${ti.id}`, { method: 'DELETE' });
    console.log(`   [CLEANED] Deleted test inquiry ${ti.id}`);
  }

  const cleanInquiries = await dbFetch('/inquiries?select=*&order=created_at.desc');
  console.log(`Remaining genuine business inquiries: ${cleanInquiries.length}`);
  cleanInquiries.forEach((ci) => {
    console.log(` * ID: ${ci.id} | Name: ${ci.name} | Email: ${ci.email} | Status: ${ci.status} | Diamond: ${ci.diamond_name || ci.diamond_id}`);
  });

  // 2. Diamonds Audit
  console.log('\n--- 2. DIAMONDS AUDIT ---');
  const diamonds = await dbFetch('/diamonds?select=id,name,slug,shape,is_active,is_featured,created_at&order=created_at.desc');
  console.log(`Total diamonds in Supabase: ${diamonds.length}`);
  const testDiamonds = diamonds.filter(
    (d) =>
      d.name?.toLowerCase().includes('test') ||
      d.slug?.toLowerCase().includes('test')
  );
  console.log(`Test diamonds found: ${testDiamonds.length}`);
  for (const td of testDiamonds) {
    console.log(` - Deleting test diamond: ${td.id} | ${td.name}`);
    await dbFetch(`/diamonds?id=eq.${td.id}`, { method: 'DELETE' });
  }
  const cleanDiamonds = await dbFetch('/diamonds?select=id,name,slug,shape,is_active');
  console.log(`Active genuine diamonds in Supabase: ${cleanDiamonds.length}`);
  cleanDiamonds.forEach((d) => console.log(` * ${d.name} (${d.shape}) - Active: ${d.is_active}`));

  // 3. Categories Audit
  console.log('\n--- 3. CATEGORIES AUDIT ---');
  const categories = await dbFetch('/categories?select=*');
  console.log(`Total categories in Supabase: ${categories.length}`);
  categories.forEach((c) => console.log(` * ${c.name} (${c.slug})`));

  // 4. Site Settings & CMS Sections Audit
  console.log('\n--- 4. SITE SETTINGS & CMS SECTIONS AUDIT ---');
  const settingsRows = await dbFetch('/site_settings?select=*&limit=1');
  const settingsRow = settingsRows[0];
  if (settingsRow) {
    console.log(`Site Name: ${settingsRow.site_name}`);
    console.log(`Contact Email: ${settingsRow.contact_email}`);
    console.log(`WhatsApp: ${settingsRow.whatsapp_number}`);
    console.log(`Phone: ${settingsRow.contact_phone}`);
    console.log(`Address: ${settingsRow.contact_address}`);
    console.log(`CMS Sections stored in DB: ${Array.isArray(settingsRow.cms_sections) ? settingsRow.cms_sections.length : 'None'}`);

    if (Array.isArray(settingsRow.cms_sections)) {
      const heroSec = settingsRow.cms_sections.find((s) => s.key === 'hero');
      console.log(`Hero Badge in DB: "${heroSec?.content?.badge}"`);
      const ctaSec = settingsRow.cms_sections.find((s) => s.key === 'inquiry_cta');
      console.log(`Inquiry CTA Visible in DB: ${ctaSec?.visible}`);

      // Ensure Hero Badge is standard production copy
      if (heroSec && heroSec.content?.badge !== 'Master Diamond Cutters • Surat Atelier') {
        console.log('Restoring hero badge to "Master Diamond Cutters • Surat Atelier"...');
        heroSec.content.badge = 'Master Diamond Cutters • Surat Atelier';
        heroSec.status = 'published';
        await dbFetch(`/site_settings?id=eq.${settingsRow.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ cms_sections: settingsRow.cms_sections }),
        });
        console.log('Hero badge restored in Supabase site_settings.');
      }
    }
  }

  // 5. Compare Dashboard Analytics Against Actual Records
  console.log('\n--- 5. DASHBOARD ANALYTICS RECONCILIATION ---');
  const activeDiamondsCount = cleanDiamonds.filter((d) => d.is_active !== false).length;
  const categoriesCount = categories.length;
  const totalInquiriesCount = cleanInquiries.length;
  const pendingInquiriesCount = cleanInquiries.filter(
    (i) => i.status === 'New' || i.status === 'Contacted' || i.status === 'In Progress'
  ).length;

  console.log(`Supabase Active Diamonds: ${activeDiamondsCount}`);
  console.log(`Supabase Categories: ${categoriesCount}`);
  console.log(`Supabase Total Inquiries: ${totalInquiriesCount}`);
  console.log(`Supabase Pending Inquiries: ${pendingInquiriesCount}`);

  // 6. Secret Exposure Scan in client bundles
  console.log('\n--- 6. CLIENT BUNDLE SECRET SCAN ---');
  const staticDir = path.join(process.cwd(), '.next', 'static');
  if (fs.existsSync(staticDir)) {
    const secrets = [
      process.env.ADMIN_SECRET_KEY,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      process.env.CLOUDINARY_API_SECRET,
    ].filter(Boolean);

    let exposedCount = 0;
    function scanDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith('.js')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const s of secrets) {
            if (content.includes(s)) {
              console.error(`[EXPOSED] Secret found in ${file}!`);
              exposedCount++;
            }
          }
        }
      }
    }
    scanDir(staticDir);
    if (exposedCount === 0) {
      console.log('[PASS] Client bundle secret scan: 0 secrets found in .next/static.');
    } else {
      console.error(`[FAIL] ${exposedCount} secret exposures detected!`);
    }
  } else {
    console.log('No local .next/static build directory found. Skipping static folder check.');
  }

  console.log('\n================================================================');
  console.log('CLEANLINESS & ANALYTICS AUDIT COMPLETED');
  console.log('================================================================');
}

verifyCleanliness().catch(console.error);
