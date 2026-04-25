# ArcPay 🌌

ArcPay is an autonomous, AI-driven expense management platform running securely on the Arc Testnet. By combining Circle's Developer-Controlled Wallets with the OpenRouter AI ecosystem, ArcPay interprets natural-language spending rules to dynamically approve, reject, or batch-process nano-payments.

## 🚀 Core Features

- **Autonomous Agent Rules**: Set natural language constraints (e.g., "Daily cap of $50," "Auto-approve coffee") and let the AI securely evaluate requests before initiating transactions.
- **High-Throughput Batch Processing**: ArcPay incorporates x402 batching principles to dispatch multiple nano-payments simultaneously. Our batch processor easily handles 60 concurrent transactions, proving the system's viability for high-frequency micro-settlements (like payroll, API access fees, or continuous subscriptions).
- **Cost-Efficiency**: On legacy networks, gas fees render micro-transactions impossible. By leveraging Arc and Circle's x402 nanopayment infrastructure, ArcPay achieves sub-cent transaction costs (`<$0.005` per tx), enabling true micro-economies.
- **Strict On-Chain Enforcement**: Zero mock data. Every approved transaction initiates a real cryptographic transfer of USDC on the Arc Testnet. The application interfaces directly with the blockchain to ensure verifiable transparency and strict balance compliance.

## 📉 Economic Proof & Margin Explanation

This project is explicitly designed to prove the viability of AI-driven micro-transactions:

- **Real Per-Action Pricing (≤ $0.01)**: The ArcPay agent operates on the Arc Testnet where transaction gas costs are consistently sub-cent (`<$0.005`).
- **Transaction Frequency Data (50+ On-Chain Txs)**: Using the "Process Batch Transactions" button on the dashboard, the application immediately executes 60 parallel, fully-signed on-chain transfers.
- **Why this fails with traditional gas costs**: The ArcPay model (autonomous AI micro-payments of $0.10 - $3.00) would completely fail on traditional networks like Ethereum mainnet. If an AI agent attempts to pay $0.50 for a weather data API call, but the traditional gas fee is $2.00, the economic margin is severely negative (`-400%`). The transaction costs vastly outweigh the value of the action. By leveraging Arc, the transaction cost becomes negligible, preserving a highly profitable margin for machine-to-machine (M2M) operations.

## 💡 Real-World Use Cases

ArcPay's architecture solves several critical inefficiencies in modern finance:
1. **Corporate Expense Automation**: Companies can deploy ArcPay to employees. The AI agent evaluates corporate policy in real-time, eliminating manual expense reports and settling approved purchases instantly.
2. **Machine-to-Machine (M2M) Micro-Economies**: AI agents or IoT devices can negotiate and pay for resources (e.g., weather data, API calls, compute cycles) autonomously, with ArcPay acting as the strict financial governor.
3. **Streaming Payments & Payroll**: High-throughput processing makes it feasible to stream payments globally by the minute or second.

## ⚙️ Setup & Deployment

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   # Circle API (Arc Testnet)
   PRIVATE_KEY="your_wallet_private_key_here"

   # OpenRouter AI
   OPENROUTER_API_KEY="your_openrouter_api_key_here"
   ```

3. **Fund Your Wallet (Arc Testnet)**
   - Go to the [Circle Faucet](https://faucet.circle.com)
   - Select **Arc Testnet** and **USDC**
   - Enter your wallet address to receive testnet funds.

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Deploy to Vercel**
   - Push to GitHub.
   - Import project in Vercel.
   - Add the environment variables in Vercel Settings.
   - Deploy!
