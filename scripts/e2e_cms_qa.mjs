import fs from 'fs';
import crypto from 'crypto';

// Load .env.local
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

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3005';
const ADMIN_SECRET = env.ADMIN_SECRET_KEY;

const results = [];

function logTest(id, name, pass, actual, expected, rootCause = null) {
  results.push({ id, name, pass, actual, expected, rootCause });
  console.log(`[${pass ? 'PASS' : 'FAIL'}] ${id}: ${name}`);
  if (!pass) {
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
    if (rootCause) console.log(`   Cause:    ${rootCause}`);
  }
}

async function runCMSAudit() {
  console.log('====================================================');
  console.log('RAJVI DIAMONDS – CMS END-TO-END AUTOMATED QA AUDIT');
  console.log(`Target: ${TARGET_URL}`);
  console.log('====================================================\n');

  let sessionCookie = '';

  // ----------------------------------------------------
  // TEST 1: Admin Authentication & Security Boundary
  // ----------------------------------------------------
  try {
    // 1A: Unauthorized API call rejection
    const unauthRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_header_settings', payload: {} }),
    });
    logTest(
      'CMS-AUTH-01',
      'CMS API Rejection Without Admin Authentication',
      unauthRes.status === 401,
      `Status ${unauthRes.status}`,
      'Status 401 Unauthorized'
    );

    // 1B: Login with valid admin passkey
    const loginRes = await fetch(`${TARGET_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: 'admin@rajvidiamonds.com',
        password: ADMIN_SECRET,
      }),
    });
    const loginData = await loginRes.json();
    const setCookie = loginRes.headers.get('set-cookie');
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0];
    }
    logTest(
      'CMS-AUTH-02',
      'Admin Login via Master Passkey & Session Cookie Issuance',
      loginRes.status === 200 && loginData.success && !!sessionCookie,
      `Status ${loginRes.status}, Cookie: ${sessionCookie ? 'Issued' : 'Missing'}`,
      'Status 200, success: true, cookie issued'
    );
  } catch (err) {
    logTest('CMS-AUTH-00', 'Admin Auth Exception', false, err.message, 'Clean auth');
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Cookie: sessionCookie,
  };

  // ----------------------------------------------------
  // TEST 2: Homepage CMS - Draft vs Published Isolation
  // ----------------------------------------------------
  try {
    const testDraftBadge = 'EXCLUSIVE TEST DRAFT BADGE 2026';

    // 2A: Save Draft to Hero Section
    const draftRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'save_section_draft',
        payload: {
          sectionKey: 'hero',
          draftData: {
            badge: testDraftBadge,
            title: 'Architectural Fancy Cut Diamonds',
            subtitle: 'Crafted with Mathematical Precision in Surat',
          },
        },
      }),
    });
    const draftJson = await draftRes.json();
    logTest(
      'CMS-DRAFT-01',
      'Save Hero Section Draft via Admin CMS API',
      draftRes.status === 200 && draftJson.success,
      `Status ${draftRes.status}, success: ${draftJson.success}`,
      'Status 200, success: true'
    );

    // 2B: Public site MUST NOT display draft content (Draft Isolation)
    const publicHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const publicHomeHtml = await publicHomeRes.text();
    const draftLeaked = publicHomeHtml.includes(testDraftBadge);
    logTest(
      'CMS-DRAFT-02',
      'Draft Content Isolation: Public Site Excludes Unpublished Drafts',
      !draftLeaked,
      draftLeaked ? 'LEAKED into public HTML' : 'Isolated (Draft not rendered publicly)',
      'Unpublished draft must NOT render on public live website'
    );

    // 2C: Publish the draft
    const pubRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'publish_section',
        payload: {
          sectionKey: 'hero',
          publishedData: {
            badge: testDraftBadge,
            title: 'Architectural Fancy Cut Diamonds',
            subtitle: 'Crafted with Mathematical Precision in Surat',
          },
        },
      }),
    });
    const pubJson = await pubRes.json();
    logTest(
      'CMS-PUB-01',
      'Publish Hero Section Draft to Live Website',
      pubRes.status === 200 && pubJson.success,
      `Status ${pubRes.status}, success: ${pubJson.success}`,
      'Status 200, success: true'
    );

    // 2D: Public site MUST now display the published badge
    const liveHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const liveHomeHtml = await liveHomeRes.text();
    const publishedVisible = liveHomeHtml.includes(testDraftBadge);
    logTest(
      'CMS-PUB-02',
      'Published Hero Section Immediately Renders on Public Site',
      publishedVisible,
      publishedVisible ? 'Rendered live in public HTML' : 'Not found in public HTML',
      'Published content must render dynamically on public homepage'
    );

    // 2E: Restore original pristine Hero section
    const restoreRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'publish_section',
        payload: {
          sectionKey: 'hero',
          publishedData: {
            badge: 'Artisanal Fancy Cut Diamonds',
            title: 'Surat Atelier Fancy Cut Diamonds',
            subtitle:
              'Crafting distinct geometric silhouettes with mathematical precision, exceptional fire, and generational lapidary expertise.',
          },
        },
      }),
    });
    const restoreJson = await restoreRes.json();
    logTest(
      'CMS-RESTORE-01',
      'Restore Original Hero Section Content & Clean Up',
      restoreRes.status === 200 && restoreJson.success,
      `Status ${restoreRes.status}`,
      'Status 200'
    );
  } catch (err) {
    logTest('CMS-HERO-ERR', 'Hero CMS Verification Exception', false, err.message, 'Clean execution');
  }

  // ----------------------------------------------------
  // TEST 3: Section Visibility Toggling (Show / Hide)
  // ----------------------------------------------------
  try {
    // 3A: Toggle inquiry section visibility to false
    const hideRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'toggle_section_visibility',
        payload: {
          sectionKey: 'inquiry_cta',
          isActive: false,
        },
      }),
    });
    const hideJson = await hideRes.json();
    logTest(
      'CMS-VIS-01',
      'Toggle Section Visibility Off (Hide Inquiry CTA)',
      hideRes.status === 200 && hideJson.success,
      `Status ${hideRes.status}`,
      'Status 200'
    );

    // 3B: Verify section is absent from public HTML
    const hiddenHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const hiddenHomeHtml = await hiddenHomeRes.text();
    const inqSectionPresentWhenHidden = hiddenHomeHtml.includes('Connect with Rajvi Diamonds to explore our collection');
    logTest(
      'CMS-VIS-02',
      'Hidden Section Excluded From Public Homepage Response',
      !inqSectionPresentWhenHidden,
      inqSectionPresentWhenHidden ? 'Section still visible' : 'Section correctly omitted',
      'Section should NOT render when is_active = false'
    );

    // 3C: Toggle section visibility back to true
    const showRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'toggle_section_visibility',
        payload: {
          sectionKey: 'inquiry_cta',
          isActive: true,
        },
      }),
    });
    const showJson = await showRes.json();
    logTest(
      'CMS-VIS-03',
      'Toggle Section Visibility On (Restore Inquiry CTA)',
      showRes.status === 200 && showJson.success,
      `Status ${showRes.status}`,
      'Status 200'
    );

    // 3D: Verify section is back on public homepage
    const restoredHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const restoredHomeHtml = await restoredHomeRes.text();
    const inqSectionPresentWhenShown = restoredHomeHtml.includes('Connect with Rajvi Diamonds to explore our collection');
    logTest(
      'CMS-VIS-04',
      'Restored Section Reappears in Public Homepage Response',
      inqSectionPresentWhenShown,
      inqSectionPresentWhenShown ? 'Section successfully reappeared' : 'Section missing',
      'Section should render when is_active = true'
    );
  } catch (err) {
    logTest('CMS-VIS-ERR', 'Section Visibility Exception', false, err.message, 'Clean execution');
  }

  // ----------------------------------------------------
  // TEST 4: Navigation Item Management (CRUD)
  // ----------------------------------------------------
  try {
    const testNavId = 'nav-test-' + Date.now();
    // 4A: Create custom navigation link
    const createNavRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'save_navigation_item',
        payload: {
          id: testNavId,
          label: 'Test Bespoke Portal',
          url: '/bespoke-test',
          location: 'header',
          display_order: 99,
          is_active: true,
          is_external: false,
        },
      }),
    });
    const createNavJson = await createNavRes.json();
    logTest(
      'CMS-NAV-01',
      'Create Dynamic Header Navigation Link',
      createNavRes.status === 200 && createNavJson.success,
      `Status ${createNavRes.status}`,
      'Status 200'
    );

    // 4B: Verify link in public header
    const navHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const navHomeHtml = await navHomeRes.text();
    const navLinkPresent = navHomeHtml.includes('Test Bespoke Portal');
    logTest(
      'CMS-NAV-02',
      'Dynamic Header Link Renders in Public Header',
      navLinkPresent,
      navLinkPresent ? 'Rendered in Header' : 'Missing from Header',
      'Link must be in Header HTML'
    );

    // 4C: Delete test navigation link
    const deleteNavRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'delete_navigation_item',
        payload: {
          id: testNavId,
        },
      }),
    });
    const deleteNavJson = await deleteNavRes.json();
    logTest(
      'CMS-NAV-03',
      'Delete Dynamic Header Navigation Link',
      deleteNavRes.status === 200 && deleteNavJson.success,
      `Status ${deleteNavRes.status}`,
      'Status 200'
    );

    // 4D: Verify link removed from public header
    const cleanNavHomeRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const cleanNavHomeHtml = await cleanNavHomeRes.text();
    const navLinkGone = !cleanNavHomeHtml.includes('Test Bespoke Portal');
    logTest(
      'CMS-NAV-04',
      'Deleted Navigation Link Cleanly Removed From Public Header',
      navLinkGone,
      navLinkGone ? 'Cleanly removed' : 'Still present',
      'Link must be omitted'
    );
  } catch (err) {
    logTest('CMS-NAV-ERR', 'Navigation Management Exception', false, err.message, 'Clean execution');
  }

  // ----------------------------------------------------
  // TEST 5: Header Settings Management
  // ----------------------------------------------------
  try {
    const testCtaLabel = 'E2E Consult Request';

    // 5A: Update Header CTA Label
    const updHeaderRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_header_settings',
        payload: {
          header_cta_label: testCtaLabel,
          header_cta_url: '/contact',
          show_header_cta: true,
          show_whatsapp_button: true,
        },
      }),
    });
    const updHeaderJson = await updHeaderRes.json();
    logTest(
      'CMS-HDR-01',
      'Update Header Settings (Custom CTA Label)',
      updHeaderRes.status === 200 && updHeaderJson.success,
      `Status ${updHeaderRes.status}`,
      'Status 200'
    );

    // 5B: Verify CTA in Public Header
    const publicHdrRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const publicHdrHtml = await publicHdrRes.text();
    const headerCtaPresent = publicHdrHtml.includes(testCtaLabel);
    logTest(
      'CMS-HDR-02',
      'Updated Header CTA Label Renders on Public Site',
      headerCtaPresent,
      headerCtaPresent ? 'Rendered in Header' : 'Missing from Header',
      'Header CTA must update'
    );

    // 5C: Restore Default Header CTA
    const restoreHdrRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_header_settings',
        payload: {
          header_cta_label: 'Diamond Inquiry',
          header_cta_url: '/contact',
          show_header_cta: true,
          show_whatsapp_button: true,
        },
      }),
    });
    logTest(
      'CMS-HDR-03',
      'Restore Default Header CTA Label',
      restoreHdrRes.status === 200,
      `Status ${restoreHdrRes.status}`,
      'Status 200'
    );
  } catch (err) {
    logTest('CMS-HDR-ERR', 'Header Settings Exception', false, err.message, 'Clean execution');
  }

  // ----------------------------------------------------
  // TEST 6: Footer Settings Management
  // ----------------------------------------------------
  try {
    const testDisclaimer = 'E2E Verified B2B Trade Disclaimer 2026.';

    // 6A: Update Footer Disclaimer
    const updFooterRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_footer_settings',
        payload: {
          disclaimer: testDisclaimer,
          copyright_notice: '© 2026 Rajvi Diamonds. All rights reserved.',
          trust_badge_text: 'Surat Diamond Bourse Member',
        },
      }),
    });
    logTest(
      'CMS-FTR-01',
      'Update Footer Settings (Custom Disclaimer Text)',
      updFooterRes.status === 200,
      `Status ${updFooterRes.status}`,
      'Status 200'
    );

    // 6B: Verify in Public Footer
    const publicFtrRes = await fetch(`${TARGET_URL}/`, { cache: 'no-store' });
    const publicFtrHtml = await publicFtrRes.text();
    const footerDisclaimerPresent = publicFtrHtml.includes(testDisclaimer);
    logTest(
      'CMS-FTR-02',
      'Updated Footer Disclaimer Renders on Public Site',
      footerDisclaimerPresent,
      footerDisclaimerPresent ? 'Rendered in Footer' : 'Missing from Footer',
      'Footer disclaimer must render'
    );

    // 6C: Restore Default Footer
    const restoreFtrRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_footer_settings',
        payload: {
          disclaimer:
            'All diamond specifications, weights, and grades subject to final confirmation. Wholesale B2B supply and bespoke parcel cuts.',
          copyright_notice: '© 2026 Rajvi Diamonds. All rights reserved.',
          trust_badge_text: 'Surat Diamond Bourse Member',
        },
      }),
    });
    logTest(
      'CMS-FTR-03',
      'Restore Default Footer Settings',
      restoreFtrRes.status === 200,
      `Status ${restoreFtrRes.status}`,
      'Status 200'
    );
  } catch (err) {
    logTest('CMS-FTR-ERR', 'Footer Settings Exception', false, err.message, 'Clean execution');
  }

  // ----------------------------------------------------
  // TEST 7: Page CMS Content (About Us / Contact Us)
  // ----------------------------------------------------
  try {
    const testAboutHeadline = 'E2E Surat Master Atelier Legacy';

    // 7A: Update About Page CMS Content
    const updAboutRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_page_cms',
        payload: {
          page: 'about',
          content: {
            hero_title: testAboutHeadline,
            hero_subtitle: 'Artisanal cutting in Gujarat diamond district',
            story_heading: 'Generational diamond expertise producing custom cuts.',
          },
        },
      }),
    });
    logTest(
      'CMS-PG-01',
      'Update About Page CMS Dynamic Content',
      updAboutRes.status === 200,
      `Status ${updAboutRes.status}`,
      'Status 200'
    );

    // 7B: Verify on Public /about Page
    const publicAboutRes = await fetch(`${TARGET_URL}/about`, { cache: 'no-store' });
    const publicAboutHtml = await publicAboutRes.text();
    const aboutTitlePresent = publicAboutHtml.includes(testAboutHeadline);
    logTest(
      'CMS-PG-02',
      'Updated Page CMS Content Renders on Public /about Page',
      aboutTitlePresent,
      aboutTitlePresent ? 'Rendered on /about' : 'Missing from /about',
      'Page title must render dynamically'
    );

    // 7C: Restore Default About Content
    const restoreAboutRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_page_cms',
        payload: {
          page: 'about',
          content: {
            hero_title: 'Our Heritage & Artistry',
            hero_subtitle: 'Surat Diamond Cutting Excellence',
            story_heading: 'The Rajvi Legacy & Vision',
          },
        },
      }),
    });
    logTest(
      'CMS-PG-03',
      'Restore Default About Page CMS Content',
      restoreAboutRes.status === 200,
      `Status ${restoreAboutRes.status}`,
      'Status 200'
    );
  } catch (err) {
    logTest('CMS-PG-ERR', 'Page CMS Exception', false, err.message, 'Clean execution');
  }

  // ----------------------------------------------------
  // TEST 8: SEO Settings Management
  // ----------------------------------------------------
  try {
    const testSeoTitle = 'E2E Bespoke Diamond Inquiry | Rajvi Diamonds';

    // 8A: Update Contact Page SEO Meta
    const updSeoRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_seo_settings',
        payload: {
          page_seo: {
            '/contact': {
              title: testSeoTitle,
              description: 'Connect directly with master diamond cutters in Surat.',
            },
          },
        },
      }),
    });
    logTest(
      'CMS-SEO-01',
      'Update /contact SEO Settings via Admin CMS API',
      updSeoRes.status === 200,
      `Status ${updSeoRes.status}`,
      'Status 200'
    );

    // 8B: Verify in Public /contact HTML
    const publicContactRes = await fetch(`${TARGET_URL}/contact`, { cache: 'no-store' });
    const publicContactHtml = await publicContactRes.text();
    const seoTitlePresent = publicContactHtml.includes(testSeoTitle);
    logTest(
      'CMS-SEO-02',
      'Dynamic SEO Meta Title Renders in Public /contact <head>',
      seoTitlePresent,
      seoTitlePresent ? 'Rendered in HTML' : 'Missing from HTML',
      'Custom meta title must render'
    );

    // 8C: Restore Default SEO
    const restoreSeoRes = await fetch(`${TARGET_URL}/api/admin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        action: 'update_seo_settings',
        payload: {
          page_seo: {
            '/contact': {
              title: 'Contact Rajvi Diamonds | Trade & Direct Inquiries',
              description:
                'Contact Rajvi Diamonds for fancy cut diamond wholesale orders, bespoke jewellery manufacturing parcels, and calibrated diamond availability.',
            },
          },
        },
      }),
    });
    logTest(
      'CMS-SEO-03',
      'Restore Default /contact SEO Settings',
      restoreSeoRes.status === 200,
      `Status ${restoreSeoRes.status}`,
      'Status 200'
    );
  } catch (err) {
    logTest('CMS-SEO-ERR', 'SEO Settings Exception', false, err.message, 'Clean execution');
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log('AUDIT SUMMARY REPORT');
  console.log('====================================================');
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`Total Tests: ${results.length}`);
  console.log(`Passed:      ${passed}`);
  console.log(`Failed:      ${failed}`);
  console.log(`Pass Rate:   ${((passed / results.length) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter((r) => !r.pass).forEach((r) => console.log(` - ${r.id}: ${r.name} (${r.actual})`));
    process.exit(1);
  } else {
    console.log('\nALL CMS E2E QA TESTS PASSED! System is fully operational and verified.');
    process.exit(0);
  }
}

runCMSAudit().catch((err) => {
  console.error('Fatal QA error:', err);
  process.exit(1);
});
