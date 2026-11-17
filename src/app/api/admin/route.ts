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
  updateSiteSettings,
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

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Admin API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
