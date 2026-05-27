import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiter — max 5 attempts per IP per minute
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many payment attempts. Please wait a minute and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecret) {
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured on server.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      payment_method_id,
      amount,          // in cents, e.g. 5999 for $59.99
      currency = 'cad',
      customer_name,
      customer_email,
      order_number,
      description,
      billing_details,
    } = await req.json();

    if (!payment_method_id || !amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: payment_method_id, amount.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create + confirm a PaymentIntent in one call
    const params = new URLSearchParams({
      amount: String(amount),
      currency,
      payment_method: payment_method_id,
      confirm: 'true',
      // Return a client_secret so the frontend can handle 3DS if needed
      'automatic_payment_methods[enabled]': 'true',
      'automatic_payment_methods[allow_redirects]': 'never',
      description: description || `Order ${order_number}`,
      'metadata[order_number]': order_number || '',
      'metadata[customer_name]': customer_name || '',
      'metadata[customer_email]': customer_email || '',
    });
    // Note: billing_details are already attached to the PaymentMethod when created
    // on the frontend via createPaymentMethod(). Do NOT use payment_method_data here
    // as that would try to create a new PM inline and requires payment_method_data[type].

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const intent = await stripeRes.json();

    // Stripe error (card declined, etc.)
    if (intent.error) {
      return new Response(
        JSON.stringify({ error: intent.error.message || 'Card was declined.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3D Secure required — send client_secret back so frontend can handle it
    if (intent.status === 'requires_action') {
      return new Response(
        JSON.stringify({
          requires_action: true,
          payment_intent_client_secret: intent.client_secret,
          payment_intent_id: intent.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Payment succeeded
    if (intent.status === 'succeeded') {
      return new Response(
        JSON.stringify({
          success: true,
          payment_intent_id: intent.id,
          amount: intent.amount,
          currency: intent.currency,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Unexpected status
    return new Response(
      JSON.stringify({ error: `Unexpected payment status: ${intent.status}` }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
