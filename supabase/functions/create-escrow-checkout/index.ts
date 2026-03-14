import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors })

  const keyId = Deno.env.get("RAZORPAY_KEY_ID")
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET")

  if (!keyId || !keySecret) {
    return new Response(
      JSON.stringify({ error: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set" }),
      { headers: { ...cors, "Content-Type": "application/json" }, status: 500 }
    )
  }

  try {
    const { amountPaise, projectId, milestoneId } = await req.json()
    const amount = Number(amountPaise)
    if (!amount || amount < 100) {
      return new Response(
        JSON.stringify({ error: "amountPaise must be at least 100 (₹1)" }),
        { headers: { ...cors, "Content-Type": "application/json" }, status: 400 }
      )
    }

    const receipt = `escrow_${projectId}_${milestoneId}`.slice(0, 40)
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(keyId + ":" + keySecret),
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency: "INR",
        receipt,
        notes: { projectId, milestoneId },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return new Response(
        JSON.stringify({ error: err || "Razorpay order failed" }),
        { headers: { ...cors, "Content-Type": "application/json" }, status: 400 }
      )
    }

    const order = await res.json()
    return new Response(
      JSON.stringify({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency || "INR",
        keyId,
      }),
      { headers: { ...cors, "Content-Type": "application/json" }, status: 200 }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { headers: { ...cors, "Content-Type": "application/json" }, status: 400 }
    )
  }
})
