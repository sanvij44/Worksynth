# Escrow Payment Gateway – Razorpay (Free Setup, Easy Steps)

## 1. Project analysis

Your WorkSynth app already has:

- **Employer dashboard** → Escrow tab (mock: “Total held”, “Released this month”, transactions).
- **Freelancer dashboard** → “In escrow” and per-project escrow amounts (mock).
- **Project detail** → Milestones with amounts; “Approve Milestone” and “Payments” (mock).
- **Data** → `src/data/projects.js` and `src/data/index.js` hold mock escrow/earnings.

So: **UI and flow are there; no real money moves yet.** Adding a gateway means: (1) employer funds a milestone, (2) you hold the money, (3) you release to freelancer on approval.

---

## 2. Why Razorpay (free to start)

- **Cost:** No monthly fee. You pay only when money moves (Razorpay’s fee per successful payment).
- **India-first:** Amounts in **INR** (₹). Amount is sent in **paise** (1 ₹ = 100 paise).
- **Fits your stack:** Works with React + Supabase. You keep the **Key Secret** on the server (Edge Function); only **Key ID** is used on the frontend.
- **Escrow-style flow:** Create an order → employer pays via Razorpay Checkout → funds hit your Razorpay account → when employer approves, you can transfer/payout to freelancer (Razorpay Route / Payouts) or mark as “released” and handle payouts later.

---

## 3. Easy steps to add escrow with Razorpay

### Step 1: Create a Razorpay account (free)

1. Go to [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup).
2. Complete signup and verify your account (email, phone, business details as required).
3. In **Dashboard → Settings → API Keys** (or **Developers → API Keys**):
   - Generate **Test** keys (for development).
   - Copy **Key ID** (e.g. `rzp_test_xxxxx`) → for the frontend.
   - Copy **Key Secret** → only for the server (Edge Function); never put in frontend or `.env` that is exposed.

### Step 2: Add keys to your project

In the **worksynth** folder (where `package.json` is), create or edit `.env`:

```env
# Razorpay (escrow) – Key ID is safe on frontend
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

For the **Supabase Edge Function** (Step 4), set these secrets in Supabase (Dashboard → Project → **Settings → Edge Functions → Secrets**, or via CLI):

- **`RAZORPAY_KEY_ID`** = your Razorpay Key ID (e.g. `rzp_test_xxxxx`)
- **`RAZORPAY_KEY_SECRET`** = your Razorpay Key Secret

### Step 3: No extra npm package

Razorpay Checkout is loaded via a script tag (`https://checkout.razorpay.com/v1/checkout.js`). The project’s `src/lib/escrow.js` loads it when needed. No `npm install` required.

### Step 4: Backend – Supabase Edge Function (create Razorpay order)

The Edge Function creates a **Razorpay Order** (amount in **paise**, currency **INR**). The frontend then opens Razorpay Checkout with the returned `order_id`.

1. Install Supabase CLI (if you haven’t):  
   [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)

2. In the **worksynth** folder, link your project and set the secret:

   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase secrets set RAZORPAY_KEY_ID=rzp_test_xxxxx
   npx supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret_here
   ```

3. The function lives at:  
   `supabase/functions/create-escrow-checkout/index.ts`  
   It already contains the Razorpay version: it creates an order and returns `orderId`, `amount`, `currency`, and `keyId`.

4. Deploy the function:

   ```bash
   npx supabase functions deploy create-escrow-checkout
   ```

Your frontend calls this via `supabase.functions.invoke('create-escrow-checkout', { body: { amountPaise, projectId, milestoneId } })`. The Edge Function uses `RAZORPAY_KEY_SECRET`; the frontend uses `VITE_RAZORPAY_KEY_ID` only to open checkout (or you can pass `keyId` from the function response).

### Step 5: Wire “Fund escrow” in the app

- On **Project detail**, the **“Fund with Razorpay”** button is already wired.
- It calls `createEscrowCheckout({ amountPaise, projectId, milestoneId })` from `src/lib/escrow.js`.
- The helper:
  1. Calls your Edge Function to create a Razorpay order.
  2. Loads Razorpay’s script and opens Checkout with the returned `order_id`.
- On success, the `handler` in the frontend runs; you can redirect to a success URL or update UI. Optionally store the payment in Supabase (e.g. `escrow_holds` with `razorpay_order_id`, `razorpay_payment_id`) for “Funded” / “Released” state.

### Step 6: (Later) Release to freelancer

- **Option A – Simple:** When employer clicks “Approve Milestone”, only update your DB (e.g. status = released). You can later add Razorpay Route / Payouts so freelancers get real payouts.
- **Option B – Full:** Use [Razorpay Route](https://razorpay.com/docs/route/) or [Payouts](https://razorpay.com/docs/payouts/) to send money to freelancer bank/UPI when you release.

---

## 4. Summary checklist

| Step | Action |
|------|--------|
| 1 | Create Razorpay account, get **Key ID** and **Key Secret** (Test mode first). |
| 2 | Add `VITE_RAZORPAY_KEY_ID` to `.env`; add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to Supabase Edge Function secrets. |
| 3 | No extra npm package; Razorpay script is loaded from their CDN in `escrow.js`. |
| 4 | Deploy Edge Function: `npx supabase functions deploy create-escrow-checkout`. |
| 5 | Use “Fund with Razorpay” on Project detail; amounts are in **INR paise** (e.g. ₹640 = 64000 paise). |
| 6 | On success, update UI/DB; later add Route/Payouts for real payouts to freelancers. |

---

## 5. Amounts: INR and paise

- Razorpay uses **INR** (Indian Rupees) and **paise** (1 ₹ = 100 paise).
- In your mock data, amounts are often in dollars (e.g. `640`). For Razorpay you can:
  - Treat numbers as **INR** and send `amount * 100` as paise (e.g. ₹640 → `64000` paise), or
  - Convert from USD to INR using an exchange rate and then multiply by 100 for paise.
- The Edge Function expects **`amountPaise`** in the request body.

---

## 6. Optional: Store escrow state in Supabase

Create a table so you know what’s funded and what’s released:

```sql
create table if not exists escrow_holds (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  milestone_id text not null,
  amount_paise int not null,
  status text not null default 'funded',  -- 'funded' | 'released'
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz default now()
);
```

After successful payment in the frontend `handler`, call a Supabase Edge Function or use Supabase client (with RLS) to insert a row. When employer approves, update `status` to `released`.

---

You now have a clear path to add a **free** (no monthly fee) escrow-style payment gateway using **Razorpay** and Supabase in a few focused steps.
