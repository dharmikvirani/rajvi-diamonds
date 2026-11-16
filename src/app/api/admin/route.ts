import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import {
  saveDiamond,
  deleteDiamond,
  saveCategory,
  deleteCategory,
  saveDiamondSize,
  deleteDiamondSize,
  updateInquiryStatus,
  updateSiteSettings,
} from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      // 1. Diamonds
      case 'save_diamond': {
        const saved = await saveDiamond(payload);
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_diamond': {
        await deleteDiamond(payload.id);
        return NextResponse.json({ success: true, id: payload.id });
      }

      // 2. Categories
      case 'save_category': {
        const saved = await saveCategory(payload);
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_category': {
        await deleteCategory(payload.id);
        return NextResponse.json({ success: true, id: payload.id });
      }

      // 3. Sizes
      case 'save_size': {
        const saved = await saveDiamondSize(payload.diamondId, payload.sizeData);
        return NextResponse.json({ success: true, data: saved });
      }

      case 'delete_size': {
        await deleteDiamondSize(payload.diamondId, payload.sizeId);
        return NextResponse.json({ success: true });
      }

      // 4. Inquiries
      case 'update_inquiry': {
        const saved = await updateInquiryStatus(payload.id, payload.status, payload.internalNotes);
        return NextResponse.json({ success: true, data: saved });
      }

      // 5. Site Settings
      case 'update_settings': {
        const saved = await updateSiteSettings(payload);
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
