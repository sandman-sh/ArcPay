import { NextResponse } from 'next/server';
import { getWalletBalance } from '@/lib/circle';

export async function GET() {
  try {
    const { address, balance } = await getWalletBalance();
    return NextResponse.json({ success: true, address, balance });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
