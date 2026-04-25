import { NextResponse } from 'next/server';
import { processExpenseChat } from '@/lib/openrouter';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, rules, dailySpent } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const decision = await processExpenseChat(
      message,
      rules || [],
      dailySpent || 0
    );

    return NextResponse.json({ decision });
  } catch (err: any) {
    console.error('[ArcPay Chat API Error]:', err.message);
    return NextResponse.json(
      {
        decision: {
          action: 'reject',
          amountInUSDC: 0,
          reason: 'Server error processing your request. Please try again.',
          needsApproval: false,
        },
      },
      { status: 200 } // Return 200 so the UI doesn't crash
    );
  }
}
