import { NextResponse } from 'next/server';
import { sendNanoPayment } from '@/lib/circle';

export async function POST(req: Request) {
  try {
    const { amount, recipient, reason } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const tx = await sendNanoPayment(
      amount,
      recipient || '0x000000000000000000000000000000000000dEaD',
      reason || 'ArcPay payment'
    );

    return NextResponse.json({ success: true, tx });
  } catch (err: any) {
    console.error('[ArcPay Pay API Error]:', err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
