export async function onRequestPost(context) {
  try {
    const request = context.request;
    const { email } = await request.json();

    // Validamos que venga un correo
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Correo inválido' }), { status: 400 });
    }

    // Obtenemos tu llave de Resend
    const RESEND_API_KEY = context.env.RESEND_API_KEY;
    
    // AQUÍ ESTÁ LA MAGIA: Configuramos tu correo como el receptor
    const MI_CORREO = 'qoreoficial19@gmail.com'; 

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Waitlist Qore <onboarding@resend.dev>', // Usamos el bot autorizado de Resend
        to: [MI_CORREO], // El correo de aviso te llegará a ti
        subject: '🚀 ¡Nuevo cliente en la Waitlist de Qore!',
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <h2 style="color: #111;">¡Tienes un nuevo prospecto! 🎉</h2>
            <p style="color: #555; font-size: 16px;">Alguien acaba de registrarse en la lista de espera de Qore desde tu sitio web.</p>
            
            <div style="background-color: #fff; padding: 20px; border-left: 4px solid #000; margin: 20px 0; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
              <p style="margin: 0; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Correo del interesado:</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #007bff;">${email}</p>
            </div>
            
            <p style="color: #888; font-size: 13px;">Guarda este correo para contactarlo cuando lances el sistema y darle su precio de fundador.</p>
          </div>
        `
      })
    });

    if (resendResponse.ok) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      const errorData = await resendResponse.json();
      return new Response(JSON.stringify({ error: errorData }), { status: 400 });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), { status: 500 });
  }
}