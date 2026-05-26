const fs = require('fs');
let c = fs.readFileSync('src/pages/TransactionalPages.jsx', 'utf8');

// Replace createPaymentMethod variable names
c = c.replace(
  'const result = await stripeRef.current.createPaymentMethod(',
  'const { error: pmError, paymentMethod } = await stripeRef.current.createPaymentMethod('
);

// Replace the broken save line with the full edge function call
c = c.replace(
  `if (result.error) { setStripeErr(result.error.message); setPlacing(false); return; }
          await saveOrder(no, result.paymentMethod.id);`,
  `if (pmError) { setStripeErr(pmError.message); setPlacing(false); return; }
          const amountInCents = Math.round(total * 100);
          const itemsStr = cart.map(i => i.qty + 'x ' + i.name).join(', ');
          const edgeUrl = cfg.supaUrl() + '/functions/v1/process-stripe-payment';
          let chargeData = {};
          try {
            const res = await fetch(edgeUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'apikey': cfg.supaKey(), 'Authorization': 'Bearer ' + cfg.supaKey() },
              body: JSON.stringify({ payment_method_id: paymentMethod.id, amount: amountInCents, currency: 'cad', customer_name: (form.fn + ' ' + form.ln).trim(), customer_email: form.email, order_number: no, description: 'Nexa Customs ' + no }),
            });
            chargeData = await res.json();
          } catch (fetchErr) { showToast('Payment server error — please call us at (437) 997-9921'); setPlacing(false); return; }
          if (chargeData.requires_action && chargeData.payment_intent_client_secret) {
            const { error: actionErr } = await stripeRef.current.handleNextAction({ clientSecret: chargeData.payment_intent_client_secret });
            if (actionErr) { setStripeErr(actionErr.message || '3D Secure failed.'); setPlacing(false); return; }
          }
          if (chargeData.error) { setStripeErr(chargeData.error); setPlacing(false); return; }
          await saveOrder(no, chargeData.payment_intent_id || paymentMethod.id);`
);

fs.writeFileSync('src/pages/TransactionalPages.jsx', c);
console.log('Done. Edge function present:', c.includes('process-stripe-payment'));
