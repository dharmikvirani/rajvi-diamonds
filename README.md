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

## 7. Admin Portal Access

- **Admin Login Route:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Authentication Methods:**
  - **Supabase Auth:** Authenticate using an email/password configured in Supabase Auth and registered in `admin_users`.
  - **Passkey Fallback:** Authenticate using the administrator email and the private `ADMIN_SECRET_KEY` defined in `.env.local`.

### Setting up Supabase Auth Admin:
1. In your Supabase Dashboard, go to **Authentication -> Users** and click **Add User**.
2. Create an admin user with your chosen email and password.
3. In the SQL Editor, link that user into the `admin_users` table:
   ```sql
   INSERT INTO admin_users (auth_user_id, full_name, role, is_active)
   VALUES ('<supabase-auth-user-uuid>', 'Rajvi Administrator', 'admin', true);
   ```
4. You can now log into `/admin/login` using your Supabase credentials!

---

## 8. Deployment to Vercel

1. **Push the repository to GitHub / GitLab:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete production Rajvi Diamonds platform"
   git remote add origin <your-repo-url>
   git push -u origin main
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

## 9. Checklist of Owner-Provided Assets & Credentials

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
