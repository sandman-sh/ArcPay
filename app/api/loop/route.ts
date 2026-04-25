import { NextResponse } from 'next/server';
import { sendNanoPayment } from '@/lib/circle';

export async function POST() {
  const txs: any[] = [];
  try {
    // 60-tx batch processing
    // Fire in batches of 10 to ensure reliable RPC throughput
    for (let batch = 0; batch < 6; batch++) {
      const batchPromises = [];
      for (let i = 0; i < 10; i++) {
        const txIndex = batch * 10 + i;
        batchPromises.push(
          sendNanoPayment(
            0.001,
            "0x000000000000000000000000000000000000dEaD",
            `ArcPay Nano Tx #${txIndex}`
          )
        );
      }

      const results = await Promise.allSettled(batchPromises);

      for (let i = 0; i < results.length; i++) {
        const txIndex = batch * 10 + i;
        const result = results[i];
        if (result.status === "fulfilled") {
          txs.push({
            id: `batch-${txIndex}-${Date.now()}`,
            hash: result.value.txHash,
            amount: 0.001,
            merchant: `Nano Tx #${txIndex}`,
            time: new Date().toISOString(),
            url: result.value.explorerUrl,
          });
        }
      }
    }

    return NextResponse.json({ success: true, txs });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, txs },
      { status: 500 }
    );
  }
}
