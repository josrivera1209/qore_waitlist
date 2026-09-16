export async function onRequestPost(context) {
  try {
    const request = context.request;
    const { email } = await request.json();

    // 1. Validamos que venga un correo válido
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Correo inválido' }), { status: 400 });
    }

    // 2. Traemos las 3 variables de entorno desde Cloudflare
    const SUPABASE_URL = context.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = context.env.SUPABASE_ANON_KEY;
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    
    // 3. GUARDAR EN SUPABASE
    const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal' // Para que la respuesta sea rápida y ligera
      },
      body: JSON.stringify({ email })
    });

    // Si Supabase falla (por ejemplo, el usuario ya se había registrado antes)
    if (!supabaseResponse.ok) {
      return new Response(JSON.stringify({ error: 'Este correo ya está registrado o hubo un error.' }), { status: 400 });
    }

    // 4. MANDARTE EL AVISO POR RESEND
    const MI_CORREO = 'qoreoficial19@gmail.com'; 

    // Lo metemos en un try/catch interno. Así, si Resend bloquea el correo por spam, 
    // al usuario igual le sale la pantalla de éxito porque ya se guardó en tu base de datos.
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Waitlist Qore <onboarding@resend.dev>',
            to: [MI_CORREO], 
            subject: '🚀 ¡Nuevo cliente en la Waitlist de Qore!',
            html: `
              <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
                <h2 style="color: #111;">¡Tienes un nuevo prospecto! 🎉</h2>
                <p style="color: #555; font-size: 16px;">Alguien acaba de registrarse en la lista de espera de Qore desde tu sitio web.</p>
                
                <div style="background-color: #fff; padding: 20px; border-left: 4px solid #000; margin: 20px 0; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                  <p style="margin: 0; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Correo del interesado:</p>
                  <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #007bff;">${email}</p>
                </div>
                
                <p style="color: #888; font-size: 13px;">Este contacto ya se guardó de forma segura en tu base de datos de Supabase.</p>
              </div>
            `
          })
        });
      } catch (resendError) {
        // Ignoramos el error de Resend en el backend para no asustar al usuario
        console.error('Error enviando el aviso por correo, pero guardado en DB.');
      }
    }

    // 5. Todo salió bien, devolvemos success para activar tu animación de éxito
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
}