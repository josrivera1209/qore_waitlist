export async function onRequestPost(context) {
  try {
    const request = context.request;
    const { email } = await request.json();

    // Validamos de nuevo por seguridad en el backend
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Correo inválido' }), { status: 400 });
    }

    // Obtenemos la llave secreta que guardaremos en Cloudflare
    const RESEND_API_KEY = context.env.RESEND_API_KEY;

    // Llamada a la API de Resend para enviar el correo automático
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Qore <onboarding@resend.dev>', // Cambiarás esto cuando verifiques tu dominio en Resend
        to: [email],
        subject: '¡Estás en la lista de espera de Qore!',
        html: `
          <div style="font-family: sans-serif; background-color: #050505; color: #ededed; padding: 40px; border-radius: 10px;">
            <h2 style="color: #ffffff; font-weight: 500;">¡Te has registrado con éxito! 🎉</h2>
            <p style="color: #888888; line-height: 1.5;">Gracias por unirte a la waitlist de Qore. Eres de los primeros en dar el paso hacia un sistema inteligente de reseñas y analíticas.</p>
            <p style="color: #888888; line-height: 1.5;">Te avisaremos en cuanto el sistema esté completamente operativo para darte acceso con tu beneficio de fundador.</p>
            <p style="color: #555555; font-size: 12px; margin-top: 30px;">qore_oficial</p>
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