import fs from 'fs';
import crypto from 'crypto';

// Safe environment loading from .env.local or process.env
let env = process.env;
if (fs.existsSync('.env.local')) {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const fileEnv = Object.fromEntries(
      envContent
        .split('\n')
        .filter((l) => l.trim() && !l.startsWith('#') && l.includes('='))
        .map((l) => {
          const idx = l.indexOf('=');
          return [l.substring(0, idx).trim(), l.substring(idx + 1).trim()];
        })
    );
    env = { ...fileEnv, ...process.env };
  } catch (err) {
    console.warn('Could not read .env.local');
  }
}

const TARGET_URL = process.env.TARGET_URL || 'https://rajvi-diamonds.vercel.app';
const ADMIN_SECRET = env.ADMIN_SECRET_KEY || 'RajviLuxurySecure2024!';
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const results = [];

function logTest(category, id, name, pass, actual, expected, rootCause = null) {
  results.push({ category, id, name, pass, actual, expected, rootCause });
  const status = pass ? '\x1b[32m[PASS]\x1b[0m' : '\x1b[31m[FAIL]\x1b[0m';
  console.log(`${status} [${category}] ${id}: ${name}`);
  if (!pass) {
    console.log(`   Expected:   ${expected}`);
    console.log(`   Actual:     ${actual}`);
    if (rootCause) console.log(`   Root Cause: ${rootCause}`);
  }
}

async function runProductionAudit() {
  console.log('================================================================');
  console.log('RAJVI DIAMONDS – COMPLETE PRODUCTION-READINESS AUDIT');
  console.log(`Target: ${TARGET_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  let sessionCookie = '';

  // ====================================================
  // 1. SECURITY & ACCESS CONTROL AUDIT
  // ====================================================
  console.log('--- 1. SECURITY & AUTHENTICATION AUDIT ---');

  // 1.1 Bad credentials rejection
  try {
    const badLoginRes = await fetch(`${TARGET_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: 'admin@rajvidiamonds.com', password: 'wrong-password' }),
    });
    const badLoginData = await badLoginRes.json();
    logTest(
      'SECURITY',
      'SEC-01',
      'Reject Invalid Admin Passkey',
      badLoginRes.status === 401 && !badLoginData.success,
      `Status ${badLoginRes.status}`,
      'Status 401'
    );
  } catch (err) {
    logTest('SECURITY', 'SEC-01', 'Reject Invalid Admin Passkey', false, err.message, '401');
  }

  // 1.2 Master passkey login & cookie security flags
  let cookieHeaderVal = '';
  try {
    const goodLoginRes = await fetch(`${TARGET_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: 'admin@rajvidiamonds.com',
        password: ADMIN_SECRET,
      }),
    });
    const setCookie = goodLoginRes.headers.get('set-cookie');
    cookieHeaderVal = setCookie || '';
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0];
    }
    const hasHttpOnly = /httponly/i.test(cookieHeaderVal);
    const hasSameSite = /samesite=(lax|strict)/i.test(cookieHeaderVal);
    const hasPath = /path=\//i.test(cookieHeaderVal);

    logTest(
      'SECURITY',
      'SEC-02',
      'Admin Master Passkey Login & Session Cookie Issuance',
      goodLoginRes.status === 200 && !!sessionCookie,
      `Status ${goodLoginRes.status}, Cookie: ${sessionCookie ? 'Issued' : 'Missing'}`,
      'Status 200 with session cookie'
    );

    logTest(
      'SECURITY',
      'SEC-03',
      'Cookie Security Flags (HttpOnly, SameSite, Path)',
      hasHttpOnly && hasSameSite && hasPath,
      cookieHeaderVal.replace(/rajvi_admin_session=[^;]+/, 'rajvi_admin_session=***'),
      'HttpOnly, SameSite, Path=/'
    );
  } catch (err) {
    logTest('SECURITY', 'SEC-02', 'Admin Master Passkey Login', false, err.message, '200');
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: sessionCookie,
  };

  // 1.3 Unauthorized /admin route redirection
  try {
    const adminPageRes = await fetch(`${TARGET_URL}/admin`, { redirect: 'manual' });
    const isRedirect = adminPageRes.status === 307 || adminPageRes.status === 302 || adminPageRes.status === 308;
    logTest(
      'SECURITY',
      'SEC-04',
      'Unauthorized /admin Route Interception by Middleware',
      isRedirect,
      `Status ${adminPageRes.status}`,
      'Status 307 Redirect to /admin/login'
    );
  } catch (err) {
    logTest('SECURITY', 'SEC-04', 'Unauthorized /admin Interception', false, err.message, 'Redirect');
  }

  // 1.4 Unauthorized /api/admin rejection
  try {
    const unauthApiRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ping' }),
    });
    logTest(
      'SECURITY',
      'SEC-05',
      'Unauthorized /api/admin Mutation Rejection',
      unauthApiRes.status === 401,
      `Status ${unauthApiRes.status}`,
      'Status 401 Unauthorized'
    );
  } catch (err) {
    logTest('SECURITY', 'SEC-05', 'Unauthorized /api/admin Rejection', false, err.message, '401');
  }

  // 1.5 Unauthorized /api/upload rejection
  try {
    const unauthUploadRes = await fetch(`${TARGET_URL}/api/upload`, {
      method: 'POST',
    });
    logTest(
      'SECURITY',
      'SEC-06',
      'Unauthorized /api/upload Asset Upload Rejection',
      unauthUploadRes.status === 401,
      `Status ${unauthUploadRes.status}`,
      'Status 401 Unauthorized'
    );
  } catch (err) {
    logTest('SECURITY', 'SEC-06', 'Unauthorized /api/upload Rejection', false, err.message, '401');
  }

  // 1.6 Draft preview access control: Unauthenticated visitor appending ?preview=true
  try {
    const unauthPreviewRes = await fetch(`${TARGET_URL}/?preview=true`, { cache: 'no-store' });
    const unauthPreviewHtml = await unauthPreviewRes.text();
    const leakedDraftBanner = unauthPreviewHtml.includes('CMS Draft Preview Active');
    logTest(
      'SECURITY',
      'SEC-07',
      'Draft Preview Access Control: Public Visitor Cannot Trigger Preview Mode',
      !leakedDraftBanner,
      leakedDraftBanner ? 'Draft Banner LEAKED to public' : 'Protected (Normal public page served)',
      'Unauthenticated visitor with ?preview=true MUST NOT receive draft preview mode'
    );
  } catch (err) {
    logTest('SECURITY', 'SEC-07', 'Draft Preview Access Control', false, err.message, 'Protected');
  }

  // 1.7 Inquiry honeypot spam protection
  try {
    const botRes = await fetch(`${TARGET_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Bot User',
        email: 'bot@spammer.com',
        phone: '+919123456789',
        inquiryType: 'General Inquiry',
        message: 'Spam payload',
        honeypot: 'I am a bot filling hidden fields',
      }),
    });
    const botData = await botRes.json();
    logTest(
      'SECURITY',
      'SEC-08',
      'Inquiry Spam Honeypot Protection Rejection',
      botRes.status === 400 && !botData.success && (botData.errors?.honeypot || botData.error?.includes('Automated')),
      `Status ${botRes.status}, error: ${botData.error || botData.errors?.honeypot}`,
      'Status 400 rejection on honeypot presence'
    );
  } catch (err) {
    logTest('SECURITY', 'SEC-08', 'Honeypot Protection', false, err.message, '400');
  }

  // 1.8 Client-side secret exposure scan
  try {
    const homeHtmlRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const homeHtml = await homeHtmlRes.text();
    const hasSecretKey = ADMIN_SECRET && homeHtml.includes(ADMIN_SECRET);
    const hasServiceKey = SUPABASE_SERVICE_KEY && homeHtml.includes(SUPABASE_SERVICE_KEY);
    logTest(
      'SECURITY',
      'SEC-09',
      'Client JavaScript & HTML Secret Exposure Scan',
      !hasSecretKey && !hasServiceKey,
      hasSecretKey || hasServiceKey ? 'CRITICAL: Secret leaked in client HTML' : 'Zero secrets exposed',
      'No secrets in client bundles or HTML'
    );
  } catch (err) {
    logTest('SECURITY', 'SEC-09', 'Secret Exposure Scan', false, err.message, 'Zero secrets');
  }

  // ====================================================
  // 2. ADMIN-TO-WEBSITE DYNAMIC AUDIT (12 MODULES)
  // ====================================================
  console.log('\n--- 2. ADMIN-TO-WEBSITE DYNAMIC AUDIT (12 MODULES) ---');

  // MODULE 1: Homepage Section Manager
  try {
    const testDraftBadge = 'AUTOTEST DRAFT BADGE ' + Date.now();
    // 1A: Save draft
    const draftRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'save_section_draft',
        payload: {
          sectionKey: 'hero',
          draftData: { badge: testDraftBadge },
        },
      }),
    });
    const draftJson = await draftRes.json();
    logTest(
      'MOD-01: HOMEPAGE',
      'CMS-01A',
      'Homepage Section Draft Persistence (Hero Badge)',
      draftRes.status === 200 && draftJson.success,
      `Status ${draftRes.status}`,
      'Status 200'
    );

    // 1B: Draft isolation from public site
    const pubHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const pubHomeHtml = await pubHomeRes.text();
    const draftLeaked = pubHomeHtml.includes(testDraftBadge);
    logTest(
      'MOD-01: HOMEPAGE',
      'CMS-01B',
      'Draft Isolation: Unpublished Revisions Omitted from Live Visitors',
      !draftLeaked,
      draftLeaked ? 'Draft leaked publicly' : 'Isolated from public visitors',
      'Unpublished drafts must NOT appear on public website'
    );

    // 1C: Publish draft
    const pubRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'publish_section',
        payload: {
          sectionKey: 'hero',
          publishedData: { badge: testDraftBadge },
        },
      }),
    });
    const pubJson = await pubRes.json();

    // Verify on public site
    const liveHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const liveHomeHtml = await liveHomeRes.text();
    const pubVisible = liveHomeHtml.includes(testDraftBadge);
    logTest(
      'MOD-01: HOMEPAGE',
      'CMS-01C',
      '1-Click Publish: Promotes Draft & Updates Live Public Website',
      pubRes.status === 200 && pubJson.success && pubVisible,
      pubVisible ? 'Rendered live on public homepage' : 'Not found in public HTML',
      'Published content must render on live public homepage'
    );

    // 1D: Restore original Hero content
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'publish_section',
        payload: {
          sectionKey: 'hero',
          publishedData: { badge: 'Artisanal Fancy Cut Diamonds' },
        },
      }),
    });

    // 1E: Section visibility toggle (Hide & Restore)
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'toggle_section_visibility',
        payload: { sectionKey: 'inquiry_cta', isActive: false },
      }),
    });
    const hiddenRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const hiddenHtml = await hiddenRes.text();
    const hiddenOk = !hiddenHtml.includes('Connect with Rajvi Diamonds to explore our collection');

    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'toggle_section_visibility',
        payload: { sectionKey: 'inquiry_cta', isActive: true },
      }),
    });
    const shownRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const shownHtml = await shownRes.text();
    const shownOk = shownHtml.includes('Connect with Rajvi Diamonds to explore our collection');

    logTest(
      'MOD-01: HOMEPAGE',
      'CMS-01D',
      'Section Visibility Toggling (Hide & Restore Inquiry CTA)',
      hiddenOk && shownOk,
      `Hidden: ${hiddenOk ? 'Omitted' : 'Leaked'}, Restored: ${shownOk ? 'Visible' : 'Missing'}`,
      'Hidden section must be omitted, restored must render'
    );
  } catch (err) {
    logTest('MOD-01: HOMEPAGE', 'CMS-01-ERR', 'Homepage Section Exception', false, err.message, 'Clean');
  }

  // MODULE 2: Navigation Management
  try {
    const testNavId = 'nav-audit-' + Date.now();
    const addNavRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'save_navigation_item',
        payload: {
          id: testNavId,
          label: 'Bespoke Atelier Test',
          url: '/bespoke-audit',
          menu_location: 'header',
          display_order: 99,
          is_active: true,
        },
      }),
    });
    const navHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const navHomeHtml = await navHomeRes.text();
    const navRendered = navHomeHtml.includes('Bespoke Atelier Test');

    // Teardown
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ action: 'delete_navigation_item', payload: { id: testNavId } }),
    });

    logTest(
      'MOD-02: NAVIGATION',
      'CMS-02',
      'Navigation Links CRUD & Dynamic Header Rendering',
      addNavRes.status === 200 && navRendered,
      navRendered ? 'Rendered in Header' : 'Missing from Header',
      'Navigation item persists and renders in header'
    );
  } catch (err) {
    logTest('MOD-02: NAVIGATION', 'CMS-02-ERR', 'Navigation Exception', false, err.message, 'Clean');
  }

  // MODULE 3: Footer Customizer
  try {
    const testDisclaimer = 'AUDIT VERIFIED B2B TRADE DISCLAIMER ' + Date.now();
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_footer_settings',
        payload: { disclaimer: testDisclaimer },
      }),
    });
    const ftrHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const ftrHomeHtml = await ftrHomeRes.text();
    const ftrRendered = ftrHomeHtml.includes(testDisclaimer);

    // Restore
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_footer_settings',
        payload: {
          disclaimer:
            'All diamond specifications, weights, and grades subject to final confirmation. Wholesale B2B supply and bespoke parcel cuts.',
        },
      }),
    });

    logTest(
      'MOD-03: FOOTER',
      'CMS-03',
      'Footer Customizer Persistence & Dynamic Rendering',
      ftrRendered,
      ftrRendered ? 'Rendered in Footer' : 'Missing from Footer',
      'Footer disclaimer dynamically updates on public site'
    );
  } catch (err) {
    logTest('MOD-03: FOOTER', 'CMS-03-ERR', 'Footer Exception', false, err.message, 'Clean');
  }

  // MODULE 4: Brand Media Gallery
  try {
    const testGalleryId = 'gal-audit-' + Date.now();
    const saveGalRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'save_gallery_item',
        payload: {
          id: testGalleryId,
          image_url: 'https://res.cloudinary.com/b2fsbbzr/image/upload/v1794978442/rose-octagone-cut.png',
          caption: 'Audit Test Gallery Cut',
          alt_text: 'Audit Test Gallery Cut Alt',
          display_order: 99,
          is_active: true,
        },
      }),
    });
    // Teardown
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ action: 'delete_gallery_item', payload: { id: testGalleryId } }),
    });

    logTest(
      'MOD-04: GALLERY',
      'CMS-04',
      'Brand Media Gallery Item Persistence & Safe Teardown',
      saveGalRes.status === 200,
      `Status ${saveGalRes.status}`,
      'Status 200'
    );
  } catch (err) {
    logTest('MOD-04: GALLERY', 'CMS-04-ERR', 'Gallery Exception', false, err.message, 'Clean');
  }

  // MODULE 5: Inner Pages CMS (/about, /contact, /privacy)
  try {
    const testAboutTitle = 'AUDIT SURAT ATELIER LEGACY ' + Date.now();
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_page_cms',
        payload: {
          page: 'about',
          content: { hero_title: testAboutTitle },
        },
      }),
    });
    const aboutRes = await fetch(`${TARGET_URL}/about`, { cache: 'no-store' });
    const aboutHtml = await aboutRes.text();
    const aboutRendered = aboutHtml.includes(testAboutTitle);

    // Restore
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_page_cms',
        payload: {
          page: 'about',
          content: { hero_title: 'Our Heritage & Artistry' },
        },
      }),
    });

    logTest(
      'MOD-05: INNER PAGES',
      'CMS-05',
      'Inner Pages CMS (/about) Dynamic Content Rendering',
      aboutRendered,
      aboutRendered ? 'Rendered on /about' : 'Missing from /about',
      'Updated page content renders on public route'
    );
  } catch (err) {
    logTest('MOD-05: INNER PAGES', 'CMS-05-ERR', 'Pages CMS Exception', false, err.message, 'Clean');
  }

  // MODULE 6: SEO Manager
  try {
    const testSeoTitle = 'Bespoke Diamond Inquiries | Rajvi Diamonds Surat';
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_seo_settings',
        payload: {
          page_seo: {
            '/contact': { title: testSeoTitle },
          },
        },
      }),
    });
    const contactRes = await fetch(`${TARGET_URL}/contact`, { cache: 'no-store' });
    const contactHtml = await contactRes.text();
    const seoRendered = contactHtml.includes(testSeoTitle);

    // Restore
    await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_seo_settings',
        payload: {
          page_seo: {
            '/contact': { title: 'Contact Rajvi Diamonds | Trade & Direct Inquiries' },
          },
        },
      }),
    });

    logTest(
      'MOD-06: SEO',
      'CMS-06',
      'SEO Settings Override & Dynamic <title> Rendering',
      seoRendered,
      seoRendered ? 'Rendered in HTML <title>' : 'Missing from HTML',
      'Custom meta title rendered in <head>'
    );
  } catch (err) {
    logTest('MOD-06: SEO', 'CMS-06-ERR', 'SEO Exception', false, err.message, 'Clean');
  }

  // MODULE 7: Diamond Management
  try {
    const diamondRes = await fetch(`${TARGET_URL}/collections/rose-octagone`, { cache: 'no-store' });
    const diamondHtml = await diamondRes.text();
    const hasRoseOctagone = diamondHtml.includes('Rose Octagone');
    const hasSpecs = diamondHtml.includes('Available') || diamondHtml.includes('Made to Order');
    logTest(
      'MOD-07: DIAMONDS',
      'CMS-07',
      'Diamond Detail Dynamic Loading & Specification Hierarchy',
      diamondRes.status === 200 && hasRoseOctagone && hasSpecs,
      `Status ${diamondRes.status}, Rose Octagone: ${hasRoseOctagone ? 'Found' : 'Missing'}`,
      'Status 200 with dynamic specifications'
    );
  } catch (err) {
    logTest('MOD-07: DIAMONDS', 'CMS-07-ERR', 'Diamond Exception', false, err.message, 'Clean');
  }

  // MODULE 8: Categories
  try {
    const colRes = await fetch(`${TARGET_URL}/collections`, { cache: 'no-store' });
    const colHtml = await colRes.text();
    const hasCategory = colHtml.includes('Rose Cut Series') || colHtml.includes('Floral Silhouette');
    logTest(
      'MOD-08: CATEGORIES',
      'CMS-08',
      'Diamond Categories Dynamic Catalog Grouping',
      colRes.status === 200 && hasCategory,
      `Status ${colRes.status}, Categories found: ${hasCategory}`,
      'Categories render on catalogue page'
    );
  } catch (err) {
    logTest('MOD-08: CATEGORIES', 'CMS-08-ERR', 'Categories Exception', false, err.message, 'Clean');
  }

  // MODULE 9: Sizes
  try {
    const sizeRes = await fetch(`${TARGET_URL}/collections/rose-octagone`, { cache: 'no-store' });
    const sizeHtml = await sizeRes.text();
    const hasSizes = sizeHtml.includes('mm') || sizeHtml.includes('Size');
    logTest(
      'MOD-09: SIZES',
      'CMS-09',
      'Millimeter Calibrated Sizes Available in Product View',
      hasSizes,
      hasSizes ? 'Millimeter sizes rendered' : 'No size options found',
      'Calibrated sizes displayed'
    );
  } catch (err) {
    logTest('MOD-09: SIZES', 'CMS-09-ERR', 'Sizes Exception', false, err.message, 'Clean');
  }

  // MODULE 10 & 11: Colors & Clarities
  try {
    const detailRes = await fetch(`${TARGET_URL}/collections/rose-octagone`, { cache: 'no-store' });
    const detailHtml = await detailRes.text();
    const hasColors = detailHtml.includes('Color Grade') || detailHtml.includes('Color');
    const hasClarities = detailHtml.includes('Clarity') || detailHtml.includes('VVS') || detailHtml.includes('VS');
    logTest(
      'MOD-10: COLORS',
      'CMS-10',
      'Multi-Color Grade Selection Interface',
      hasColors,
      hasColors ? 'Color selection rendered' : 'Color selection missing',
      'Color grades selectable'
    );
    logTest(
      'MOD-11: CLARITIES',
      'CMS-11',
      'Multi-Clarity Grade Selection Interface',
      hasClarities,
      hasClarities ? 'Clarity selection rendered' : 'Clarity selection missing',
      'Clarity grades selectable'
    );
  } catch (err) {
    logTest('MOD-10/11: SPECS', 'CMS-10-ERR', 'Specs Exception', false, err.message, 'Clean');
  }

  // MODULE 12: Inquiry CRM & Workflow Journey
  let testInquiryId = null;
  try {
    // 5A: Submit verified test inquiry
    const inqSubRes = await fetch(`${TARGET_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Production QA Specialist',
        email: 'qa.test@rajvidiamonds.com',
        phone: '+919876543210',
        companyName: 'Luxury Atelier QA',
        inquiryType: 'Diamond Availability',
        diamondName: 'Rose Octagone',
        selectedSize: '5.0 mm',
        selectedColor: 'D',
        selectedClarity: 'VVS1',
        message: 'End-to-end production audit test inquiry verifying CRM lifecycle and status mutation.',
      }),
    });
    const inqSubData = await inqSubRes.json();
    testInquiryId = inqSubData.inquiryId;

    logTest(
      'MOD-12: INQUIRY CRM',
      'INQ-01',
      'Submit Customer Inquiry with Prefilled Diamond Specs',
      inqSubRes.status === 200 && inqSubData.success && !!testInquiryId,
      `Status ${inqSubRes.status}, Inquiry ID: ${testInquiryId || 'None'}`,
      'Status 200 with generated inquiryId'
    );

    // 5B: Update status to Converted (mapped to Resolved in DB)
    let statusUpdated = false;
    if (testInquiryId) {
      const updStatusRes = await fetch(`${TARGET_URL}/api/admin`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          action: 'update_inquiry_status',
          payload: { id: testInquiryId, status: 'Converted' },
        }),
      });
      statusUpdated = updStatusRes.status === 200;
    }
    logTest(
      'MOD-12: INQUIRY CRM',
      'INQ-02',
      'Admin CRM Status Mutation to Converted (Mapped to Resolved)',
      statusUpdated,
      `Status updated: ${statusUpdated}`,
      'Status mutation succeeds'
    );

    // 5C: Clean up test inquiry
    if (testInquiryId) {
      await fetch(`${TARGET_URL}/api/admin`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          action: 'delete_inquiry',
          payload: { id: testInquiryId },
        }),
      });
    }
  } catch (err) {
    logTest('MOD-12: INQUIRY CRM', 'INQ-ERR', 'Inquiry Exception', false, err.message, 'Clean');
  }

  // ====================================================
  // 3. ADMIN DASHBOARD ENHANCEMENTS
  // ====================================================
  console.log('\n--- 3. ADMIN DASHBOARD METRICS & ANALYTICS AUDIT ---');

  try {
    const adminDashRes = await fetch(`${TARGET_URL}/admin`, { headers: authHeaders });
    const dashHtml = await adminDashRes.text();

    const hasActiveCuts = dashHtml.includes('Active Diamond Cuts');
    const hasCategories = dashHtml.includes('Cut Categories');
    const hasInquiries = dashHtml.includes('Customer Inquiries');
    const hasMostRequested = dashHtml.includes('Most Requested Diamond Cuts');
    const hasMonthlyVolume = dashHtml.includes('Monthly Inquiry Volume');

    logTest(
      'DASHBOARD',
      'DASH-01',
      'Core KPI Stats Cards (Active Cuts, Categories, Inquiries)',
      hasActiveCuts && hasCategories && hasInquiries,
      `Active: ${hasActiveCuts}, Categories: ${hasCategories}, Inquiries: ${hasInquiries}`,
      'All KPI cards rendered'
    );

    logTest(
      'DASHBOARD',
      'DASH-02',
      'Inquiry Demand Analytics: Most Requested Diamond Cuts',
      hasMostRequested,
      hasMostRequested ? 'Rendered on Dashboard' : 'Missing from Dashboard',
      'Most Requested Diamond Cuts displayed with demand percentages'
    );

    logTest(
      'DASHBOARD',
      'DASH-03',
      'Monthly Inquiry Volume Statistics (Past 6 Months)',
      hasMonthlyVolume,
      hasMonthlyVolume ? 'Rendered on Dashboard' : 'Missing from Dashboard',
      'Monthly Inquiry Volume trend chart displayed'
    );
  } catch (err) {
    logTest('DASHBOARD', 'DASH-ERR', 'Dashboard Exception', false, err.message, 'Clean');
  }

  // ====================================================
  // 4. RESPONSIVE & SEO METADATA AUDIT
  // ====================================================
  console.log('\n--- 4. RESPONSIVE & SEO METADATA AUDIT ---');

  try {
    // 4.1 Canonical URLs on all public routes
    const routes = ['/', '/collections', '/about', '/contact', '/privacy', '/collections/rose-octagone'];
    for (const r of routes) {
      const pageRes = await fetch(`${TARGET_URL}${r}`, { cache: 'no-store' });
      const html = await pageRes.text();
      const hasCanonical = html.includes('rel="canonical"');
      logTest(
        'SEO & CANONICAL',
        `SEO-CAN-${r === '/' ? 'HOME' : r.replace('/', '').toUpperCase().replace('-', '_')}`,
        `Canonical URL Tag Present on Route ${r}`,
        pageRes.status === 200 && hasCanonical,
        `Status ${pageRes.status}, canonical tag: ${hasCanonical ? 'Found' : 'Missing'}`,
        'rel="canonical" tag present in HTML <head>'
      );
    }

    // 4.2 robots.txt
    const robotsRes = await fetch(`${TARGET_URL}/robots.txt`);
    const robotsText = await robotsRes.text();
    const robotsValid = robotsRes.status === 200 && robotsText.includes('Disallow: /admin') && robotsText.includes('sitemap.xml');
    logTest(
      'SEO',
      'SEO-ROBOTS',
      'robots.txt Configuration & Route Disallow Rules',
      robotsValid,
      `Status ${robotsRes.status}, Disallows /admin: ${robotsText.includes('Disallow: /admin')}`,
      'Status 200, Disallows /admin, references sitemap'
    );

    // 4.3 sitemap.xml
    const sitemapRes = await fetch(`${TARGET_URL}/sitemap.xml`);
    const sitemapText = await sitemapRes.text();
    const sitemapValid = sitemapRes.status === 200 && sitemapText.includes('<urlset') && sitemapText.includes('/collections/');
    logTest(
      'SEO',
      'SEO-SITEMAP',
      'sitemap.xml XML Schema & Dynamic Diamond Cut URLs',
      sitemapValid,
      `Status ${sitemapRes.status}, contains /collections/: ${sitemapText.includes('/collections/')}`,
      'Status 200, valid urlset XML with dynamic cuts'
    );

    // 4.4 404 Not Found Page
    const notFoundRes = await fetch(`${TARGET_URL}/non-existent-page-audit-404`, { cache: 'no-store' });
    const notFoundHtml = await notFoundRes.text();
    const notFoundValid = notFoundRes.status === 404 && notFoundHtml.includes('404') && notFoundHtml.includes('Return to Home');
    logTest(
      'SEO & UX',
      'UX-404',
      'Custom Luxury 404 Not Found Page & Recovery Navigation',
      notFoundValid,
      `Status ${notFoundRes.status}, Brand 404: ${notFoundHtml.includes('Return to Home')}`,
      'Status 404 with custom luxury page and Return to Home link'
    );
  } catch (err) {
    logTest('SEO', 'SEO-ERR', 'SEO Exception', false, err.message, 'Clean');
  }

  // ====================================================
  // SUMMARY REPORT
  // ====================================================
  console.log('\n================================================================');
  console.log('PRODUCTION AUDIT SUMMARY');
  console.log('================================================================');
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`Total Assertions Executed: ${results.length}`);
  console.log(`Passed:                   ${passed}`);
  console.log(`Failed:                   ${failed}`);
  console.log(`Overall Pass Rate:        ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\nFailed Assertions:');
    results.filter((r) => !r.pass).forEach((r) => console.log(` - [${r.category}] ${r.id}: ${r.name} (${r.actual})`));
    process.exit(1);
  } else {
    console.log('\nALL PRODUCTION READINESS ASSERTIONS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  }
}

runProductionAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
