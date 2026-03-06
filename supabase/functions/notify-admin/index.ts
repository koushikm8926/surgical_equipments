import { serve } from 'https://deno.land/std/http/server.ts';

// We'll use a simple fetch to Resend API to avoid complex dependency management in a single file for now,
// or use the 'npm:resend' if the environment supports it well.
// Supabase Edge Functions support npm modules.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'admin@surgicalstore.com';

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { quoteData } = await req.json();

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Quotes <quotes@surgicalstore.com>',
        to: [ADMIN_EMAIL],
        subject: `New Quote Request: ${quoteData.productName}`,
        html: `
          <h1>New Quote Request Received</h1>
          <p><strong>Product:</strong> ${quoteData.productName}</p>
          <p><strong>Quantity:</strong> ${quoteData.quantity}</p>
          <hr />
          <h3>Contact Details</h3>
          <p><strong>Name:</strong> ${quoteData.name}</p>
          <p><strong>Email:</strong> ${quoteData.email}</p>
          <p><strong>Phone:</strong> ${quoteData.phone || 'N/A'}</p>
          <p><strong>Institution:</strong> ${quoteData.institution || 'N/A'}</p>
          <p><strong>Notes:</strong> ${quoteData.notes || 'No additional notes'}</p>
        `,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
