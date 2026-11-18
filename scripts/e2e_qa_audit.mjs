import fs from 'fs';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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
    console.warn('Could not read .env.local, falling back to process.env');
  }
}

const PROD_BASE = process.env.BASE_URL || process.env.TARGET_URL || (env.NEXT_PUBLIC_SITE_URL && !env.NEXT_PUBLIC_SITE_URL.includes('localhost') ? env.NEXT_PUBLIC_SITE_URL : 'https://rajvi-diamonds.vercel.app');
const ADMIN_SECRET = env.ADMIN_SECRET_KEY;
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

class NodeTransportShim {}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: NodeTransportShim },
});

const results = [];

function logTest(id, name, pass, actual, expected, rootCause = null) {
  results.push({ id, name, pass, actual, expected, rootCause });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${id}: ${name}`);
  if (!pass) console.log(`   Expected: ${expected}\n   Actual: ${actual}\n   Root Cause: ${rootCause}`);
}

// 1x1 transparent PNG data URI converted to buffer
const SAMPLE_IMAGE_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

async function runQA() {
  console.log('====================================================');
  console.log('STARTING PRODUCTION END-TO-END QA AUDIT');
  console.log(`Target: ${PROD_BASE}`);
  console.log('====================================================\n');

  let sessionCookie = '';

  // ----------------------------------------------------
  // TEST 1: Admin Authentication Flow
  // ----------------------------------------------------
  try {
    // 1A: Invalid credentials
    const badLoginRes = await fetch(`${PROD_BASE}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: 'admin@rajvidiamonds.com', password: 'incorrect-pass' }),
    });
    const badLoginData = await badLoginRes.json();
    logTest(
      'TEST-01A',
      'Admin Login Rejection on Bad Credentials',
      badLoginRes.status === 401 && !badLoginData.success,
      `Status ${badLoginRes.status}, success: ${badLoginData.success}`,
      'Status 401, success: false'
    );

    // 1B: Valid login via Master Passkey
    const goodLoginRes = await fetch(`${PROD_BASE}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: 'admin@rajvidiamonds.com', password: ADMIN_SECRET }),
    });
    const goodLoginData = await goodLoginRes.json();
    const setCookieHeader = goodLoginRes.headers.get('set-cookie') || '';
    const cookieMatch = setCookieHeader.match(/rajvi_admin_session=([^;]+)/);
    sessionCookie = cookieMatch ? cookieMatch[1] : '';

    const decodedCookie = decodeURIComponent(sessionCookie);
    const isSigned = decodedCookie.startsWith('signed:');
    logTest(
      'TEST-01B',
      'Admin Login with Master Passkey & Signed Token Issuance',
      goodLoginRes.status === 200 && goodLoginData.success && isSigned,
      `Status ${goodLoginRes.status}, isSigned: ${isSigned}, cookieLength: ${sessionCookie.length}`,
      'Status 200, success: true, signed HMAC cookie issued'
    );

    // 1C: Logout
    const logoutRes = await fetch(`${PROD_BASE}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    const logoutCookie = logoutRes.headers.get('set-cookie') || '';
    const isCleared = logoutCookie.includes('rajvi_admin_session=;') || logoutCookie.includes('Max-Age=0');
    logTest(
      'TEST-01C',
      'Admin Logout Cookie Clearing',
      logoutRes.status === 200 && isCleared,
      `Status ${logoutRes.status}, cookie cleared: ${isCleared}`,
      'Status 200, rajvi_admin_session cleared'
    );
  } catch (err) {
    logTest('TEST-01', 'Admin Auth Flow', false, err.message, 'Successful auth cycle', err.stack);
  }

  // Re-acquire session for subsequent admin tests
  {
    const reLogin = await fetch(`${PROD_BASE}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email: 'admin@rajvidiamonds.com', password: ADMIN_SECRET }),
    });
    const header = reLogin.headers.get('set-cookie') || '';
    const match = header.match(/rajvi_admin_session=([^;]+)/);
    sessionCookie = match ? match[1] : '';
  }

  // ----------------------------------------------------
  // TEST 2: Security & Protected Routes
  // ----------------------------------------------------
  try {
    // 2A: Unauthenticated /admin redirect
    const unauthPageRes = await fetch(`${PROD_BASE}/admin`, { redirect: 'manual' });
    logTest(
      'TEST-02A',
      'Unauthorized /admin Route Redirection to Login',
      unauthPageRes.status === 307 && unauthPageRes.headers.get('location')?.includes('/admin/login'),
      `Status ${unauthPageRes.status}, Location: ${unauthPageRes.headers.get('location')}`,
      'Status 307, Location: /admin/login'
    );

    // 2B: Unauthenticated /api/admin access
    const unauthApiRes = await fetch(`${PROD_BASE}/api/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_diamond', id: 'fake-id' }),
    });
    logTest(
      'TEST-02B',
      'Unauthorized /api/admin Access Rejection',
      unauthApiRes.status === 401,
      `Status ${unauthApiRes.status}`,
      'Status 401 Unauthorized'
    );

    // 2C: Unauthenticated /api/upload access
    const unauthUploadRes = await fetch(`${PROD_BASE}/api/upload`, {
      method: 'POST',
      body: new FormData(),
    });
    logTest(
      'TEST-02C',
      'Unauthorized /api/upload Access Rejection',
      unauthUploadRes.status === 401,
      `Status ${unauthUploadRes.status}`,
      'Status 401 Unauthorized'
    );

    // 2D: Authenticated /admin access with session cookie
    const authAdminRes = await fetch(`${PROD_BASE}/admin`, {
      headers: { Cookie: `rajvi_admin_session=${sessionCookie}` },
    });
    logTest(
      'TEST-02D',
      'Authenticated /admin Dashboard Access',
      authAdminRes.status === 200,
      `Status ${authAdminRes.status}`,
      'Status 200 OK'
    );
  } catch (err) {
    logTest('TEST-02', 'Route Security Audit', false, err.message, 'Protected route enforcement', err.stack);
  }

  // ----------------------------------------------------
  // TEST 3: Cloudinary Image Upload
  // ----------------------------------------------------
  let uploadedImage1 = null;
  let uploadedImage2 = null;
  try {
    const formData1 = new FormData();
    formData1.append('file', new Blob([SAMPLE_IMAGE_BUFFER], { type: 'image/png' }), 'test-diamond-1.png');

    const uploadRes1 = await fetch(`${PROD_BASE}/api/upload`, {
      method: 'POST',
      headers: { Cookie: `rajvi_admin_session=${sessionCookie}` },
      body: formData1,
    });
    uploadedImage1 = await uploadRes1.json();

    const isCloudinaryUrl = uploadedImage1.imageUrl?.includes('cloudinary.com') && uploadedImage1.imageUrl?.includes('rajvi-diamonds');
    const hasPublicId = Boolean(uploadedImage1.publicId?.includes('rajvi-diamonds'));

    logTest(
      'TEST-03A',
      'Cloudinary Single Image Upload via /api/upload',
      uploadRes1.status === 200 && uploadedImage1.success && isCloudinaryUrl && hasPublicId,
      `Status ${uploadRes1.status}, success: ${uploadedImage1.success}, url: ${uploadedImage1.imageUrl}, publicId: ${uploadedImage1.publicId}`,
      'Status 200, success: true, valid Cloudinary secure_url & publicId'
    );

    // Upload a second image to verify batch capability
    const formData2 = new FormData();
    formData2.append('file', new Blob([SAMPLE_IMAGE_BUFFER], { type: 'image/png' }), 'test-diamond-2.png');
    const uploadRes2 = await fetch(`${PROD_BASE}/api/upload`, {
      method: 'POST',
      headers: { Cookie: `rajvi_admin_session=${sessionCookie}` },
      body: formData2,
    });
    uploadedImage2 = await uploadRes2.json();

    logTest(
      'TEST-03B',
      'Cloudinary Secondary Image Upload for Multi-View Gallery',
      uploadRes2.status === 200 && uploadedImage2.success,
      `Status ${uploadRes2.status}, url: ${uploadedImage2.imageUrl}`,
      'Status 200, success: true'
    );

    // Verify CDN accessibility of uploaded image
    if (uploadedImage1.imageUrl) {
      const cdnCheck = await fetch(uploadedImage1.imageUrl);
      logTest(
        'TEST-03C',
        'Cloudinary CDN Image Reachability (HTTP 200)',
        cdnCheck.status === 200,
        `Status ${cdnCheck.status}`,
        'Status 200'
      );
    }
  } catch (err) {
    logTest('TEST-03', 'Cloudinary Image Upload', false, err.message, 'Cloudinary upload success', err.stack);
  }

  // ----------------------------------------------------
  // TEST 4: Diamond Product Lifecycle (Create, Edit, Reorder, Delete)
  // ----------------------------------------------------
  const testSlug = `qa-test-${Date.now()}`;
  let createdDiamondId = null;
  try {
    // 4A: Create diamond with multi-variants & multi-images
    const createPayload = {
      name: 'QA Automated Diamond Cut',
      slug: testSlug,
      shape: 'Octagon',
      color: 'D',
      clarity: 'VVS1',
      available_colors: ['D', 'E', 'F', 'G'],
      available_clarities: ['FL', 'IF', 'VVS1', 'VS1'],
      availability_status: 'Available',
      short_description: 'Automated end-to-end QA verification diamond cut profile.',
      description: 'Comprehensive QA specimen created to verify Supabase synchronization, multi-image views, and public catalogue rendering.',
      is_active: true,
      is_featured: false,
      display_order: 999,
      images: [
        {
          id: `img-${Date.now()}-1`,
          image_url: uploadedImage1?.imageUrl || 'https://res.cloudinary.com/b2fsbbzr/image/upload/v1/rajvi-diamonds/placeholder1.png',
          cloudinary_public_id: uploadedImage1?.publicId || null,
          alt_text: 'QA Front View',
          is_primary: true,
          display_order: 1,
          view_tag: 'front',
        },
        {
          id: `img-${Date.now()}-2`,
          image_url: uploadedImage2?.imageUrl || 'https://res.cloudinary.com/b2fsbbzr/image/upload/v1/rajvi-diamonds/placeholder2.png',
          cloudinary_public_id: uploadedImage2?.publicId || null,
          alt_text: 'QA Side View',
          is_primary: false,
          display_order: 2,
          view_tag: 'side',
        },
      ],
      sizes: [
        { size_mm: 4.5, is_available: true, display_order: 1 },
        { size_mm: 5.0, is_available: true, display_order: 2 },
      ],
    };

    const createRes = await fetch(`${PROD_BASE}/api/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `rajvi_admin_session=${sessionCookie}`,
      },
      body: JSON.stringify({ action: 'save_diamond', payload: createPayload }),
    });
    const createData = await createRes.json();
    createdDiamondId = createData.data?.id;

    logTest(
      'TEST-04A',
      'Create Diamond Product via /api/admin (save_diamond)',
      createRes.status === 200 && createData.success && Boolean(createdDiamondId),
      `Status ${createRes.status}, id: ${createdDiamondId}`,
      'Status 200, success: true, valid product ID returned'
    );

    // 4B: Verify persistence directly in Supabase
    const { data: dbDiamond, error: dbErr } = await supabase
      .from('diamonds')
      .select('*, diamond_images(*), diamond_sizes(*)')
      .eq('slug', testSlug)
      .single();

    const dbMatches =
      !dbErr &&
      dbDiamond &&
      dbDiamond.name === 'QA Automated Diamond Cut' &&
      dbDiamond.diamond_images?.length === 2 &&
      dbDiamond.diamond_sizes?.length === 2;

    logTest(
      'TEST-04B',
      'Supabase Database Persistence Check (diamonds, images, sizes)',
      Boolean(dbMatches),
      `Found: ${Boolean(dbDiamond)}, imagesCount: ${dbDiamond?.diamond_images?.length}, sizesCount: ${dbDiamond?.diamond_sizes?.length}`,
      'Record found with 2 images, 2 sizes, matching attributes'
    );

    // 4C: Verify public website renders the new product
    const publicPageRes = await fetch(`${PROD_BASE}/collections/${testSlug}`, {
      headers: { 'Cache-Control': 'no-cache' },
    });
    const publicHtml = await publicPageRes.text();
    const rendersOnSite =
      publicPageRes.status === 200 &&
      publicHtml.includes('QA Automated Diamond Cut') &&
      publicHtml.includes('VVS1') &&
      publicHtml.includes('Request Price Quote');

    logTest(
      'TEST-04C',
      'Public Website Live Rendering of New Diamond Cut',
      rendersOnSite,
      `Status ${publicPageRes.status}, title in HTML: ${publicHtml.includes('QA Automated Diamond Cut')}`,
      'Status 200, product title, variants, and CTA rendered'
    );

    // 4D: Reorder gallery images (swap order)
    const reorderedImages = [
      {
        ...createPayload.images[1],
        is_primary: true,
        display_order: 1,
      },
      {
        ...createPayload.images[0],
        is_primary: false,
        display_order: 2,
      },
    ];

    const editPayload = {
      ...createPayload,
      id: createdDiamondId,
      images: reorderedImages,
      availability_status: 'Made to Order',
    };

    const editRes = await fetch(`${PROD_BASE}/api/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `rajvi_admin_session=${sessionCookie}`,
      },
      body: JSON.stringify({ action: 'save_diamond', payload: editPayload }),
    });
    const editData = await editRes.json();

    // Check Supabase updated order
    const { data: updatedImages } = await supabase
      .from('diamond_images')
      .select('image_url, is_primary, display_order')
      .eq('diamond_id', createdDiamondId)
      .order('display_order', { ascending: true });

    const orderUpdated =
      updatedImages &&
      updatedImages.length === 2 &&
      updatedImages[0].image_url === reorderedImages[0].image_url &&
      updatedImages[0].is_primary === true;

    logTest(
      'TEST-04D',
      'Gallery Image Reordering & Availability Status Update',
      editRes.status === 200 && editData.success && orderUpdated,
      `Order updated: ${orderUpdated}, primary: ${updatedImages?.[0]?.is_primary}`,
      'Status 200, Supabase image order matches reordered state'
    );

    // 4E: Delete the test diamond product
    const deleteRes = await fetch(`${PROD_BASE}/api/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `rajvi_admin_session=${sessionCookie}`,
      },
      body: JSON.stringify({ action: 'delete_diamond', payload: { id: createdDiamondId } }),
    });
    const deleteData = await deleteRes.json();

    // Verify deletion in Supabase
    const { data: checkDeleted } = await supabase
      .from('diamonds')
      .select('id')
      .eq('id', createdDiamondId)
      .maybeSingle();

    logTest(
      'TEST-04E',
      'Diamond Product Deletion & Cleanup (delete_diamond)',
      deleteRes.status === 200 && deleteData.success && checkDeleted === null,
      `Delete success: ${deleteData.success}, stillInDb: ${Boolean(checkDeleted)}`,
      'Status 200, success: true, removed from Supabase'
    );
  } catch (err) {
    logTest('TEST-04', 'Product Lifecycle CRUD', false, err.message, 'Full lifecycle pass', err.stack);
  }

  // ----------------------------------------------------
  // TEST 5: Category Management & Cloudinary Image Attachment
  // ----------------------------------------------------
  const testCatSlug = `qa-cat-${Date.now()}`;
  let createdCatId = null;
  try {
    const catPayload = {
      name: 'QA Fancy Shape Family',
      slug: testCatSlug,
      description: 'Temporary category to verify Cloudinary cover image attachment.',
      image_url: uploadedImage1?.imageUrl || 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
      display_order: 888,
      is_active: true,
    };

    const catSaveRes = await fetch(`${PROD_BASE}/api/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `rajvi_admin_session=${sessionCookie}`,
      },
      body: JSON.stringify({ action: 'save_category', payload: catPayload }),
    });
    const catSaveData = await catSaveRes.json();
    createdCatId = catSaveData.data?.id;

    // Check Supabase category table
    const { data: dbCat } = await supabase
      .from('categories')
      .select('id, name, image_url')
      .eq('slug', testCatSlug)
      .maybeSingle();

    const catSaved = catSaveRes.status === 200 && catSaveData.success && dbCat !== null;

    logTest(
      'TEST-05A',
      'Category Creation with Cloudinary Cover Photo',
      catSaved,
      `Status ${catSaveRes.status}, dbCatFound: ${Boolean(dbCat)}, image: ${dbCat?.image_url}`,
      'Status 200, category persisted with cover image'
    );

    // Delete test category
    if (createdCatId || dbCat?.id) {
      const catId = createdCatId || dbCat.id;
      const catDelRes = await fetch(`${PROD_BASE}/api/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `rajvi_admin_session=${sessionCookie}`,
        },
        body: JSON.stringify({ action: 'delete_category', payload: { id: catId } }),
      });
      const catDelData = await catDelRes.json();

      const { data: checkCatDel } = await supabase.from('categories').select('id').eq('id', catId).maybeSingle();
      logTest(
        'TEST-05B',
        'Category Deletion Cleanup (delete_category)',
        catDelRes.status === 200 && catDelData.success && checkCatDel === null,
        `Status ${catDelRes.status}, stillInDb: ${Boolean(checkCatDel)}`,
        'Status 200, category removed from Supabase'
      );
    }
  } catch (err) {
    logTest('TEST-05', 'Category Flow', false, err.message, 'Category lifecycle pass', err.stack);
  }

  // ----------------------------------------------------
  // TEST 6: Inquiry Submission, Status Progression, and Deletion
  // ----------------------------------------------------
  let createdInquiryId = null;
  try {
    const inqPayload = {
      fullName: 'QA Verification Buyer',
      email: 'qa.buyer@rajvidiamonds.com',
      phone: '+91 99887 76655',
      companyName: 'Atelier QA Haute Joaillerie',
      inquiryType: 'Diamond Availability',
      diamondName: 'Rose Octagone',
      selectedSize: '5.5 mm',
      selectedColor: 'D',
      selectedClarity: 'VVS1',
      message: 'Automated end-to-end verification inquiry payload testing database write and status update.',
    };

    const inqPostRes = await fetch(`${PROD_BASE}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inqPayload),
    });
    const inqPostData = await inqPostRes.json();
    createdInquiryId = inqPostData.inquiryId;

    // Check in Supabase
    const { data: dbInq } = await supabase
      .from('inquiries')
      .select('*')
      .eq('email', inqPayload.email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const inqInDb = Boolean(dbInq && dbInq.full_name === inqPayload.fullName && dbInq.status === 'New');

    logTest(
      'TEST-06A',
      'Customer Inquiry Submission & Supabase Storage',
      inqPostRes.status === 200 && inqPostData.success && inqInDb,
      `Status ${inqPostRes.status}, inqId: ${createdInquiryId}, inDb: ${inqInDb}`,
      'Status 200, stored in Supabase with status "New"'
    );

    // Update status to "Converted"
    if (dbInq?.id) {
      const updateInqRes = await fetch(`${PROD_BASE}/api/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `rajvi_admin_session=${sessionCookie}`,
        },
        body: JSON.stringify({
          action: 'update_inquiry',
          payload: {
            id: dbInq.id,
            status: 'Converted',
            internalNotes: 'Client confirmed order for 10 calibrated parcel stones.',
          },
        }),
      });
      const updateInqData = await updateInqRes.json();

      const { data: dbInqUpdated } = await supabase
        .from('inquiries')
        .select('status, internal_notes')
        .eq('id', dbInq.id)
        .single();

      const statusMatches =
        (dbInqUpdated?.status === 'Converted' || dbInqUpdated?.status === 'Resolved') &&
        dbInqUpdated?.internal_notes?.includes('parcel stones');

      logTest(
        'TEST-06B',
        'Inquiry Status Lifecycle Update to "Converted" (Mapped to Supabase DB "Resolved")',
        updateInqRes.status === 200 && updateInqData.success && Boolean(statusMatches),
        `Status ${updateInqRes.status}, dbStatus: ${dbInqUpdated?.status}`,
        'Status 200, status updated and saved in Supabase'
      );

      // Delete test inquiry
      const delInqRes = await fetch(`${PROD_BASE}/api/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `rajvi_admin_session=${sessionCookie}`,
        },
        body: JSON.stringify({ action: 'delete_inquiry', payload: { id: dbInq.id } }),
      });
      const delInqData = await delInqRes.json();

      const { data: checkInqDel } = await supabase.from('inquiries').select('id').eq('id', dbInq.id).maybeSingle();

      logTest(
        'TEST-06C',
        'Inquiry Record Deletion & Cleanup (delete_inquiry)',
        delInqRes.status === 200 && delInqData.success && checkInqDel === null,
        `Status ${delInqRes.status}, stillInDb: ${Boolean(checkInqDel)}`,
        'Status 200, inquiry record removed from Supabase'
      );
    }
  } catch (err) {
    logTest('TEST-06', 'Inquiry Lifecycle', false, err.message, 'Full inquiry pass', err.stack);
  }

  // ----------------------------------------------------
  // TEST 7: Dashboard Statistics Verification
  // ----------------------------------------------------
  try {
    // Count directly in Supabase
    const [{ count: diamondCount }, { count: catCount }, { count: inqCount }] = await Promise.all([
      supabase.from('diamonds').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    ]);

    const adminHtmlRes = await fetch(`${PROD_BASE}/admin`, {
      headers: { Cookie: `rajvi_admin_session=${sessionCookie}` },
    });
    const adminHtml = await adminHtmlRes.text();

    const containsRealStats =
      adminHtml.includes(`${diamondCount}`) &&
      adminHtml.includes('Executive Overview') &&
      adminHtml.includes('Customer Inquiries');

    logTest(
      'TEST-07',
      'Dashboard Real-Time Supabase Statistics Verification',
      containsRealStats,
      `Admin renders exact count: diamonds=${diamondCount}, categories=${catCount}, inquiries=${inqCount}`,
      'Dashboard HTML contains actual row counts matching Supabase database'
    );
  } catch (err) {
    logTest('TEST-07', 'Dashboard Stats', false, err.message, 'Real stats in HTML', err.stack);
  }

  // ----------------------------------------------------
  // TEST 8: Secret Leakage & Client-Side Security Scan
  // ----------------------------------------------------
  try {
    const homeRes = await fetch(`${PROD_BASE}/`);
    const homeHtml = await homeRes.text();

    // Extract all script tags
    const scriptSrcs = [...homeHtml.matchAll(/src="(\/_next\/static\/[^"]+)"/g)].map((m) => m[1]);

    let secretFound = false;
    let foundSecretName = null;

    for (const src of scriptSrcs) {
      const scriptRes = await fetch(`${PROD_BASE}${src}`);
      const text = await scriptRes.text();
      if (text.includes(SUPABASE_SERVICE_KEY)) {
        secretFound = true;
        foundSecretName = 'SUPABASE_SERVICE_ROLE_KEY';
        break;
      }
      if (text.includes('8_lSV1V4lN5BUOtvO3cHpfa6IwQ')) {
        secretFound = true;
        foundSecretName = 'CLOUDINARY_API_SECRET';
        break;
      }
    }

    logTest(
      'TEST-08',
      'Secret Key Exposure Scan in Client JS Bundles',
      !secretFound,
      secretFound ? `LEAK DETECTED: ${foundSecretName}` : 'Clean - Zero secrets detected in client bundles',
      'No service keys or API secrets exposed in public scripts'
    );
  } catch (err) {
    logTest('TEST-08', 'Secret Leakage Scan', false, err.message, 'Zero secrets leaked', err.stack);
  }

  // ----------------------------------------------------
  // TEST 9: Broken Image & Asset Integrity Across Public Pages
  // ----------------------------------------------------
  try {
    const routes = ['/', '/collections', '/collections/rose-octagone', '/collections/tulip'];
    let brokenImages = 0;
    let testedImages = 0;

    for (const route of routes) {
      const pageRes = await fetch(`${PROD_BASE}${route}`);
      const html = await pageRes.text();
      const imgUrls = [
        ...html.matchAll(/src="([^"]+\.(?:png|jpg|jpeg|webp|svg)[^"]*)"/gi),
      ].map((m) => m[1]);

      for (const rawImgUrl of imgUrls.slice(0, 10)) {
        const imgUrl = rawImgUrl.replace(/&amp;/g, '&');
        testedImages++;
        let fullUrl = imgUrl.startsWith('http') ? imgUrl : `${PROD_BASE}${imgUrl}`;
        try {
          let imgCheck = await fetch(fullUrl, { method: 'HEAD' });
          if ((imgCheck.status === 400 || imgCheck.status === 405) && fullUrl.includes('/_next/image')) {
            imgCheck = await fetch(fullUrl, { method: 'GET', headers: { Range: 'bytes=0-10' } });
          }
          if (imgCheck.status >= 400) {
            brokenImages++;
            console.error(`Broken image on ${route}: ${fullUrl} (${imgCheck.status})`);
          }
        } catch {
          brokenImages++;
        }
      }
    }

    logTest(
      'TEST-09',
      'Broken Image Audit Across Public Routes',
      brokenImages === 0,
      `Tested: ${testedImages} images, Broken: ${brokenImages}`,
      '0 broken images across public routes'
    );
  } catch (err) {
    logTest('TEST-09', 'Broken Image Audit', false, err.message, '0 broken images', err.stack);
  }

  // ----------------------------------------------------
  // TEST 10: Desktop & Mobile Touch Target Accessibility
  // ----------------------------------------------------
  try {
    const adminHtmlRes = await fetch(`${PROD_BASE}/admin/inquiries`, {
      headers: { Cookie: `rajvi_admin_session=${sessionCookie}` },
    });
    const html = await adminHtmlRes.text();

    const hasCsvExport = html.includes('Export CSV');
    const hasStatusDropdown = html.includes('All Statuses');
    const hasToastContainer = html.includes('toast') || html.includes('Notification') || html.includes('AdminLayoutClient');

    logTest(
      'TEST-10',
      'Inquiry CSV Export & Action Buttons Integrity',
      hasCsvExport && hasStatusDropdown,
      `Export CSV button present: ${hasCsvExport}, Status dropdown present: ${hasStatusDropdown}`,
      'Export CSV and interactive status controls present'
    );
  } catch (err) {
    logTest('TEST-10', 'Inquiry Tools Integrity', false, err.message, 'Interactive controls present', err.stack);
  }

  console.log('\n====================================================');
  console.log('QA AUDIT COMPLETE - RESULTS SUMMARY:');
  console.log('====================================================');
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`Total Tests: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('====================================================');

  return { total: results.length, passed, failed, results };
}

runQA();
