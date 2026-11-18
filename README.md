# Rajvi Diamonds – Premium Fancy Diamond Showcase

A production-ready digital showcase and trade catalogue platform for **Rajvi Diamonds**, dedicated to exquisite fancy cut diamond geometries, artisanal lapidary specifications, high-resolution diamond photography, and direct trade communications.

> **Important Note:** This is a luxury brand showcase and trade discovery platform, **NOT** an e-commerce purchasing site. It strictly excludes shopping carts, checkouts, public pricing, payment gateways, or customer retail accounts. All interactions are routed to WhatsApp or formal trade inquiry forms.

---

## 1. Brand & Design System

- **Brand Name:** Rajvi Diamonds
- **Brand Logo:** Original authentic logo provided by project owner preserved at `public/rajvi-diamonds-logo.png`.
- **Theme Concept:** Mixed-theme luxury editorial
  - **Homepage:** Deep dark luxury theme (`#171614` background with champagne gold `#C6A46A` typography and accents).
  - **Diamond Catalogue (`/collections`):** Pristine white and off-white (`#F8F7F4`) background with clean light grey surfaces, minimal borders, and editorial product cards.
  - **Diamond Detail (`/collections/[slug]`):** Clean light luxury theme with high-resolution gallery, interactive millimeter size selector, and full specifications table.
  - **About Page (`/about`):** Balanced contrast of deep charcoal and editorial white sections.
  - **Contact Page (`/contact`):** Off-white background with gold accents and direct WhatsApp highlight card.
  - **Footer:** Deep black (`#11100E`) with champagne gold typography and business contact metadata.

---

## 2. Technology Stack

- **Framework:** Next.js 14 (App Router, Server Components & Actions)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS with custom luxury tokens (`rajvi-black`, `rajvi-gold`, `rajvi-goldLight`, etc.)
- **Icons:** Lucide React
- **Animations:** Subtle CSS transitions and Framer Motion primitives
- **Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication:** Supabase Auth for administrators
- **Image Management:** Cloudinary CDN integration with automatic image optimizations
- **Deployment:** Vercel ready

---

## 3. Project Folder Structure

```
rajvi-diamonds/
├── public/
│   ├── rajvi-diamonds-logo.png    # Authentic original logo
│   └── images/                     # Diamond cut photography assets
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with fonts & metadata
│   │   ├── page.tsx                # Homepage (Hero, Featured, Story, Categories)
│   │   ├── globals.css             # Tailwind & luxury gradient CSS
│   │   ├── not-found.tsx           # Luxury 404 page
│   │   ├── sitemap.ts              # Dynamic XML sitemap
│   │   ├── robots.ts               # robots.txt generator
│   │   ├── collections/
│   │   │   ├── page.tsx            # Diamond Catalogue with search/filters
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Dynamic SEO diamond cut detail page
│   │   ├── about/
│   │   │   └── page.tsx            # About Us page
│   │   ├── contact/
│   │   │   └── page.tsx            # Contact Us page
│   │   ├── privacy/
│   │   │   └── page.tsx            # Privacy Policy
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Protected admin layout
│   │   │   ├── page.tsx            # Dashboard overview with KPI stats
│   │   │   ├── login/page.tsx      # Admin login portal
│   │   │   ├── diamonds/           # Diamond CRUD (list, new, edit)
│   │   │   ├── categories/         # Category CRUD
│   │   │   ├── sizes/              # Millimeter size management
│   │   │   ├── inquiries/          # Inquiry management & internal notes
│   │   │   └── settings/           # Business contact & copy settings
│   │   └── api/
│   │       ├── inquiries/route.ts  # Rate-limited inquiry submission
│   │       ├── admin/route.ts      # Authorized admin mutations
│   │       ├── admin/auth/route.ts # Admin session management
│   │       └── upload/route.ts     # Image upload / Cloudinary handler
│   ├── components/
│   │   ├── public/
│   │   │   ├── Header.tsx          # Sticky responsive navigation with logo
│   │   │   ├── Footer.tsx          # Luxury footer with branding & links
│   │   │   ├── HeroSection.tsx     # Cinematic hero section
│   │   │   ├── FeaturedCuts.tsx    # Featured diamond cut showcase
│   │   │   ├── BrandStory.tsx      # Brand storytelling
│   │   │   ├── WhyChooseUs.tsx     # Quality pillars
│   │   │   ├── ExploreCategories.tsx # Category families
│   │   │   ├── InquiryCTA.tsx      # Direct CTA banner
│   │   │   ├── DiamondCard.tsx     # Reusable product card (light/dark)
│   │   │   ├── DiamondFilterBar.tsx # Search, filter, and sort bar
│   │   │   ├── CollectionsView.tsx # Interactive catalogue container
│   │   │   ├── DiamondGallery.tsx  # Zoom & thumbnail gallery
│   │   │   ├── DiamondSizeSelector.tsx # Calibrated size selection
│   │   │   ├── DiamondSpecsTable.tsx   # Lapidary specifications table
│   │   │   ├── ContactForm.tsx     # Validated inquiry form with honeypot
│   │   │   └── WhatsAppButton.tsx  # Dynamic WhatsApp prefilled button
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx    # Responsive admin navigation
│   │   │   ├── AdminHeader.tsx     # Admin header with status
│   │   │   ├── StatsCard.tsx       # KPI card component
│   │   │   ├── ConfirmationModal.tsx # Destructive action dialog
│   │   │   └── DiamondEditorForm.tsx # Full diamond cut editor
│   └── lib/
│       ├── types.ts                # TypeScript data interfaces
│       ├── supabase.ts             # Supabase client initialization
│       ├── db.ts                   # Resilient database operations
│       ├── seedData.ts             # Initial cuts (Rose Octagone, Tulip)
│       ├── cloudinary.ts           # Cloudinary image transformation helper
│       ├── validations.ts          # Server & client validation schemas
│       ├── auth.ts                 # Admin session handling
│       └── utils.ts                # WhatsApp URL generator & formatters
├── supabase/
│   ├── migrations/
│   │   └── 20240101000000_init_rajvi_diamonds.sql # Complete PostgreSQL schema
│   └── seed.sql                    # Initial seed data script
├── .env.example                    # Environment variable template
├── .env.local                      # Local development configuration
├── tailwind.config.ts              # Tailwind design tokens
├── tsconfig.json                   # TypeScript configuration
├── next.config.mjs                 # Next.js configuration
└── package.json                    # Dependencies & scripts
```

---

## 4. Database Schema (Supabase PostgreSQL)

The database schema is completely defined in `supabase/migrations/20240101000000_init_rajvi_diamonds.sql`.

### Tables:
1. `admin_users`: Stores authorized administrator accounts linked to `auth.users`.
2. `categories`: Cut families (`geometric-fancy-cuts`, `botanical-organic-cuts`, `antique-heritage-cuts`).
3. `diamonds`: Core cut records with JSONB `specifications`, SEO fields, shape, and active flags.
4. `diamond_images`: Multiple photography angles, primary flag, and Cloudinary public IDs.
5. `diamond_sizes`: Calibrated millimeter sizes (e.g. 4.0 mm, 4.5 mm, 5.0 mm, 5.5 mm, 6.0 mm).
6. `inquiries`: Client inquiry submissions with status workflow (`New`, `Contacted`, `In Progress`, `Resolved`, `Archived`) and **private internal notes**.
7. `site_settings`: Editable key-value store for WhatsApp number, brand text, address, and hero copy.

### Initial Seed Data:
- **Rose Octagone:** Initial sizes: `4 mm`, `4.5 mm`, `5 mm`, `5.5 mm`, `6 mm`.
- **Tulip:** Organic petal silhouette without assumed sizes (ready for admin configuration).
- **Hexagon Step Cut:** Concentric architectural step cut.

---

## 5. Required Environment Variables

Create `.env.local` in the project root:

```env
# Supabase Configuration (from Supabase Dashboard -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cloudinary Image Management (from Cloudinary Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Public Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Standalone Admin Access Secret Key (configure in your private .env.local)
ADMIN_SECRET_KEY=your-secure-admin-passkey-min-16-characters
```

---

## 6. Local Development Setup

1. **Navigate to the project directory:**
   ```bash
   cd /Users/surksha/.gemini/antigravity/scratch/rajvi-diamonds
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Test:**
   ```bash
   npm run build
   npm run start
   ```

---

## 7. Admin Portal & Architecture

The administrative dashboard is located at `/admin` (protected by middleware and server session validation).

### Key Modules & Capabilities:
- **Dashboard Overview (`/admin`):**
  - Real-time KPI statistics queried directly from Supabase (Active Cuts, Featured Cuts, Cut Categories, Total Inquiries, Pending Inquiries).
  - Quick action shortcuts and recent activity feed.
- **Diamond Inventory Management (`/admin/diamonds`):**
  - Full CRUD operations: create, edit, activate/deactivate, and delete diamond cuts.
  - Multi-image batch upload with direct server-side signed Cloudinary upload handling.
  - Interactive gallery management: set primary cover image, remove images, and reorder photos via "Move Left" / "Move Right" controls.
  - Multi-color grades selection (D, E, F, G, H, Fancy Intense Yellow, etc.).
  - Multi-clarity grades selection (FL, IF, VVS1, VVS2, VS1, VS2, SI1).
  - Millimeter size mapping and custom lapidary specifications stored in PostgreSQL JSONB.
  - Automatic cache invalidation (`revalidatePath`) ensuring instant updates on the live public catalogue.
- **Category Management (`/admin/categories`):**
  - Full category CRUD for diamond cut families.
  - Direct Cloudinary image upload for category cover banners with live preview.
- **Calibrated Sizes & Dimensions (`/admin/sizes`):**
  - Manage millimeter dimensions (e.g. 4.0 mm, 4.5 mm, 5.0 mm) and carat weight brackets.
  - Safe deletion dialogs preventing accidental record loss.
- **Trade Inquiries & CRM (`/admin/inquiries`):**
  - Full customer trade inquiries list with filtering by status.
  - Detailed modal view displaying customer contact info, inquiry type, requested diamond cut, selected millimeter size, color, clarity, and initial message.
  - Direct 1-click WhatsApp messaging pre-populated with customer and diamond details.
  - CSV export functionality (`Export to CSV`) for sales pipeline management and spreadsheets.
  - Internal private notes persistence for admin follow-ups.
  - Spam and test inquiry deletion capability.
- **Site Settings (`/admin/settings`):**
  - Live configuration of business contact info, physical atelier address in Surat, official WhatsApp number, and hero banner copy.
- **Website CMS Management (`/admin/website/*`):**
  - **Homepage Sections (`/admin/website/homepage`):** Complete visual CMS for homepage sections (Hero, Featured Cuts, Why Choose Us, Craftsmanship, Brand Story, Inquiry CTA). Supports reordering via move up/down, active visibility toggling, safe Draft saving without affecting live visitors, live Draft Preview (`?preview=true`), and instant 1-click publishing.
  - **Navigation Management (`/admin/website/navigation`):** Manage header logo with preview and dimension validation, configure header CTA button visibility/label/destination, WhatsApp header toggle, and full CRUD + reordering for header and footer navigation links.
  - **Footer Settings (`/admin/website/footer`):** Dynamic control of footer logo, atelier description, trust badge ("Surat Diamond Bourse Member"), legal trade disclaimers, copyright notice, and social media links.
  - **Brand Media Gallery (`/admin/website/gallery`):** Upload diamond macro photography to Cloudinary directly from the CMS, edit captions and SEO alt tags, reorder visuals, toggle active status, and safely delete with CDN purge.
  - **Inner Pages CMS (`/admin/website/pages`):** Manage editorial copy, headlines, subtitles, and story paragraphs for `/about`, `/contact`, and `/privacy` without code deployments.
  - **SEO & Social Metadata (`/admin/website/seo`):** Global meta tags, OpenGraph sharing images, and per-page SEO overrides for `/`, `/about`, `/collections`, `/contact`, and `/privacy`.

---

## 8. Inquiry Status Lifecycle & Database Mapping

To balance luxury B2B jewelry CRM terminology with existing database constraints, the application implements transparent bi-directional mapping:

| UI / Admin CRM Display | Supabase Database Value (`inquiries.status`) | Meaning |
| :--- | :--- | :--- |
| **New** | `'New'` | Fresh customer inquiry awaiting initial response. |
| **Contacted** | `'Contacted'` | Sales team has reached out to the client via WhatsApp/Email. |
| **In Progress** | `'In Progress'` | Price quotations, parcel availability, or custom cutting is being discussed. |
| **Converted** | `'Resolved'` | Deal successfully closed or client quotation confirmed. Satisfies Supabase DB constraint `CHECK (status IN ('New', 'Contacted', 'In Progress', 'Resolved', 'Archived'))`. |
| **Closed** | `'Archived'` | Inquiry completed, declined, or archived for bookkeeping. |

All database queries, mutations, and CSV exports automatically handle this mapping in `src/lib/db.ts` without breaking database integrity.

---

## 9. Security & Cloud Integrations

- **Dual Authentication:**
  - Supabase Auth: Authenticate using Supabase users linked to `admin_users`.
  - Passkey Fallback: Authenticate using administrator email and `ADMIN_SECRET_KEY` via HMAC-SHA256 signed session cookies.
- **Rate Limiting:**
  - `/api/admin/auth`: Enforces brute-force defense (max 10 login attempts per minute per IP).
  - `/api/inquiries`: Public honeypot field protection + IP rate limiting (max 5 submissions per minute).
- **Cloudinary Signed Asset Management:**
  - All image uploads to Cloudinary are signed server-side using SHA-1 timestamps in `/api/upload`.
  - Cloudinary API Secret is strictly kept on the server and is never exposed to client-side bundles.
  - When replacing diamond or category images, old assets are cleaned up safely from Cloudinary only *after* the new database record is successfully committed.

---

## 10. Automated End-to-End QA Test Suite

The repository includes a comprehensive, automated end-to-end QA audit script covering all 24 critical production assertions.

### Running the Test Suite:

```bash
# 1. Run the Core Product, Cloudinary & CRM QA Suite
node scripts/e2e_qa_audit.mjs

# 2. Run the Dynamic CMS & Draft Isolation QA Suite (27/27 Assertions)
node scripts/e2e_cms_qa.mjs

# Or run against a specific custom target URL
TARGET_URL=https://rajvi-diamonds.vercel.app node scripts/e2e_cms_qa.mjs
```

### Test Coverage (24/24 Assertions):
1. **Admin Authentication Flow:** Bad credential rejection, Master Passkey HMAC login, session issuance, and logout clearing.
2. **Access Control & Route Protection:** Unauthorized `/admin` redirection, unauthorized `/api/admin` rejection, unauthorized `/api/upload` rejection, and authenticated dashboard access.
3. **Cloudinary Asset Uploads:** Single image upload, secondary gallery view upload, and Cloudinary CDN reachability (HTTP 200).
4. **Diamond Product CRUD:** Diamond creation (`save_diamond`), Supabase persistence verification, public website live rendering, gallery reordering, and automated teardown cleanup.
5. **Category Management:** Category creation with cover image upload, and deletion cleanup.
6. **Inquiry Lifecycle & Storage:** Customer submission, Supabase storage, status update to `Converted` (mapped to `Resolved`), and deletion.
7. **Dashboard KPIs:** Real-time Supabase count verification.
8. **Client Security Scan:** Verifies no secrets (`ADMIN_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`) are leaked in client JavaScript bundles.
9. **Public Image Audit:** Confirms zero broken images on all public catalog routes.
10. **Inquiry CSV Export & Action Integrity:** Verifies CSV export format and required CRM action handlers.

---

## 11. Deployment to Vercel

1. **Push the repository to GitHub:**
   ```bash
   git add .
   git commit -m "feat: complete production Rajvi Diamonds platform"
   git push origin main
   ```
2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your repository.
   - Add all environment variables listed in `.env.example`.
   - Deploy.
3. **Connecting a Custom Domain:**
   - In Vercel Project Settings -> Domains, enter `rajvidiamonds.com`.
   - Add the recommended DNS `A` and `CNAME` records in your domain registrar (GoDaddy, Namecheap, Cloudflare).
   - Set `NEXT_PUBLIC_SITE_URL=https://rajvidiamonds.com` in your Vercel Environment Variables.

---

## 12. Checklist of Owner-Provided Assets & Credentials

To switch from the local fallback store to your live production cloud services:

1. **Live Supabase Project:**
   - Provide `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
   - Execute `supabase/migrations/20240101000000_init_rajvi_diamonds.sql` and `supabase/seed.sql` in the Supabase SQL editor.
2. **Cloudinary Account:**
   - Provide `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
3. **Official Business Phone & WhatsApp:**
   - Configure the live WhatsApp business number with international country code in `/admin/settings` (e.g. `+91 98...`).
4. **Official High-Resolution Photography:**
   - Upload workshop photography for Tulip cut sizes, packaging, and atelier craftsmanship via `/admin/diamonds`.
