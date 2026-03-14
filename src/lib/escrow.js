import { supabase } from './supabase'

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

/**
 * Creates a Razorpay order and opens Razorpay Checkout for funding a milestone (escrow).
 * Requires Supabase Edge Function "create-escrow-checkout" to be deployed with
 * RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET set.
 *
 * @param {Object} opts
 * @param {number} opts.amountPaise - Amount in paise (e.g. 64000 for ₹640). 1 INR = 100 paise.
 * @param {string} opts.projectId - Project id
 * @param {string} opts.milestoneId - Milestone id (e.g. 'm1')
 * @param {string} [opts.keyId] - Razorpay Key ID (optional; falls back to VITE_RAZORPAY_KEY_ID from env)
 * @returns {Promise<{ paymentId: string, orderId: string }|null>} Payment details on success, or null on error/cancel
 */
export async function createEscrowCheckout({
  amountPaise,
  projectId,
  milestoneId,
  keyId: keyIdOpt,
}) {
  try {
    const { data, error } = await supabase.functions.invoke('create-escrow-checkout', {
      body: {
        amountPaise: Math.round(amountPaise),
        projectId,
        milestoneId,
      },
    })
    if (error || !data?.orderId) return null

    const { orderId, amount, currency, keyId: serverKeyId } = data
    const keyId = keyIdOpt || serverKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID
    if (!keyId) return null

    await loadRazorpayScript()

    return new Promise((resolve) => {
      const options = {
        key: keyId,
        amount: amount,
        currency: currency || 'INR',
        order_id: orderId,
        name: 'WorkSynth',
        description: `Escrow: Project ${projectId} – Milestone ${milestoneId}`,
        handler: (response) => {
          resolve({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          })
        },
        modal: {
          ondismiss: () => resolve(null),
        },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    })
  } catch (_) {
    return null
  }
}
