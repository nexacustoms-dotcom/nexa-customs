import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecret) {
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured on server.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      payment_method_id,
      amount,
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

    const params = new URLSearchParams({
      amount: String(amount),
      currency,
      payment_method: payment_method_id,
      confirm: 'true',
      'automatic_payment_methods[enabled]': 'true',
      'automatic_payment_methods[allow_redirects]': 'never',
      description: description || `Order ${order_number}`,
      'metadata[order_number]': order_number || '',
      'metadata[customer_name]': customer_name || '',
      'metadata[customer_email]': customer_email || '',
    });

    if (billing_details?.name) {
      params.set('payment_method_data[billing_details][name]', billing_details.name);
    }
    if (billing_details?.email) {
      params.set('payment_method_data[billing_details][email]', billing_details.email);
    }
    if (billing_details?.address?.line1) {
      params.set('payment_method_data[billing_details][address][line1]', billing_details.address.line1);
      params.set('payment_method_data[billing_details][address][city]', billing_details.address.city || '');
      params.set('payment_method_data[billing_details][address][state]', billing_details.address.state || '');
      params.set('payment_method_data[billing_details][address][postal_code]', billing_details.address.postal_code || '');
      params.set('payment_method_data[billing_details][address][country]', billing_details.address.country || 'CA');
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const intent = await stripeRes.json();

    if (intent.error) {
      return new Response(
        JSON.stringify({ error: intent.error.message || 'Card was declined.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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