import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAdminSession } from '@/lib/auth';
import {
  saveDiamond,
  deleteDiamond,
  saveCategory,
  deleteCategory,
  saveDiamondSize,
  deleteDiamondSize,
  saveDiamondColor,
  deleteDiamondColor,
  saveDiamondClarity,
  deleteDiamondClarity,
  updateInquiryStatus,
  deleteInquiry,
  updateSiteSettings,
  saveCmsSectionDraft,
  publishCmsSection,
  reorderCmsSections,
  toggleCmsSectionVisibility,
  saveWebsiteNavigationItem,
  deleteWebsiteNavigationItem,
  reorderWebsiteNavigation,
  saveCmsGalleryItem,
  deleteCmsGalleryItem,
  reorderCmsGallery,
  updateHeaderSettings,
  updateFooterSettings,
  updatePageCms,
  updateSeoSettings,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const action = body.action;
    const payload = body.payload ?? body.data ?? body;

    switch (action) {
      // 1. Diamonds
      case 'save_diamond': {
        const saved = await saveDiamond(payload);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_diamond': {
        const targetId = typeof payload === 'string' ? payload : (payload?.id ?? body.id);
        await deleteDiamond(targetId);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, id: targetId });
      }

      // 2. Categories
      case 'save_category': {
        const saved = await saveCategory(payload);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_category': {
        await deleteCategory(payload.id);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, id: payload.id });
      }

      // 3. Sizes
      case 'save_size': {
        const saved = await saveDiamondSize(payload.diamondId, payload.sizeData);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_size': {
        await deleteDiamondSize(payload.diamondId, payload.sizeId);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true });
      }

      // 4. Inquiries
      case 'update_inquiry': {
        const saved = await updateInquiryStatus(payload.id, payload.status, payload.internalNotes);
        revalidatePath('/admin/inquiries', 'page');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_inquiry': {
        const targetId = typeof payload === 'string' ? payload : (payload?.id ?? body.id);
        await deleteInquiry(targetId);
        revalidatePath('/admin/inquiries', 'page');
        return NextResponse.json({ success: true, id: targetId });
      }

      // 5. Site Settings
      case 'update_settings': {
        const saved = await updateSiteSettings(payload);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      // 6. Diamond Colors
      case 'save_diamond_color': {
        const saved = await saveDiamondColor(payload);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_diamond_color': {
        await deleteDiamondColor(payload.id);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, id: payload.id });
      }

      // 7. Diamond Clarities
      case 'save_diamond_clarity': {
        const saved = await saveDiamondClarity(payload);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_diamond_clarity': {
        await deleteDiamondClarity(payload.id);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, id: payload.id });
      }

      // 8. CMS Homepage & Page Sections (Draft vs. Published)
      case 'save_section_draft': {
        const key = payload.sectionKey || payload.sectionId || payload.key || payload.id;
        const draftData = payload.draftData ?? payload.data ?? payload;
        const saved = await saveCmsSectionDraft(key, draftData);
        return NextResponse.json({ success: true, data: saved });
      }

      case 'publish_section': {
        const key = payload.sectionKey || payload.sectionId || payload.key || payload.id;
        if (payload.publishedData || payload.data) {
          await saveCmsSectionDraft(key, payload.publishedData || payload.data);
        }
        const saved = await publishCmsSection(key);
        revalidatePath('/', 'layout');
        revalidatePath('/about', 'page');
        revalidatePath('/contact', 'page');
        revalidatePath('/collections', 'page');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'reorder_sections': {
        const keys = payload.orderedKeys || payload.keys || payload;
        await reorderCmsSections(keys);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true });
      }

      case 'toggle_section_visibility': {
        const key = payload.sectionKey || payload.sectionId || payload.key || payload.id;
        const isActive = payload.isActive !== undefined ? payload.isActive : payload.is_active;
        await toggleCmsSectionVisibility(key, isActive);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true });
      }

      // 9. Website Navigation (Header & Footers)
      case 'save_navigation_item': {
        const saved = await saveWebsiteNavigationItem(payload);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_navigation_item': {
        await deleteWebsiteNavigationItem(payload.id);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, id: payload.id });
      }

      case 'reorder_navigation': {
        const ids = payload.orderedIds || payload.ids || payload;
        await reorderWebsiteNavigation(ids);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true });
      }

      // 10. Brand Media Gallery
      case 'save_gallery_item': {
        const saved = await saveCmsGalleryItem(payload);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_gallery_item': {
        await deleteCmsGalleryItem(payload.id);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, id: payload.id });
      }

      case 'reorder_gallery': {
        const ids = payload.orderedIds || payload.ids || payload;
        await reorderCmsGallery(ids);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true });
      }

      // 11. Header & Footer Settings
      case 'update_header_settings': {
        const normalized = {
          ...payload,
          cta_label: payload.cta_label || payload.header_cta_label,
          cta_href: payload.cta_href || payload.header_cta_url,
          show_cta: payload.show_cta ?? payload.show_header_cta,
          show_whatsapp: payload.show_whatsapp ?? payload.show_whatsapp_button,
        };
        const saved = await updateHeaderSettings(normalized);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      case 'update_footer_settings': {
        const normalized = {
          ...payload,
          copyright_text: payload.copyright_text || payload.copyright_notice,
          brand_description: payload.brand_description || payload.about_description,
        };
        const saved = await updateFooterSettings(normalized);
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      // 12. Inner Pages CMS Content (About, Contact, Privacy)
      case 'update_page_cms': {
        const page = payload.page || payload.pageKey || payload.page_key;
        const content = payload.content ?? payload.data ?? payload;
        const saved = await updatePageCms(page, content);
        revalidatePath(`/${page}`, 'page');
        revalidatePath('/', 'layout');
        return NextResponse.json({ success: true, data: saved });
      }

      // 13. SEO Metadata
      case 'update_seo_settings': {
        let seoPayload = { ...payload };
        if (payload.page_overrides && !payload.page_seo) {
          const mapped: Record<string, any> = {};
          for (const [route, item] of Object.entries(payload.page_overrides as Record<string, any>)) {
            mapped[route] = {
              title: item.title || item.meta_title,
              description: item.description || item.meta_description,
              keywords: item.keywords || item.meta_keywords,
              og_image: item.og_image,
            };
          }
          seoPayload.page_seo = mapped;
        }
        const saved = await updateSeoSettings(seoPayload);
        revalidatePath('/', 'layout');
        revalidatePath('/about', 'page');
        revalidatePath('/contact', 'page');
        return NextResponse.json({ success: true, data: saved });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
