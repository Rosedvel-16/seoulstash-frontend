// Este es nuestro "mini-CMS" de contenido estático
// Usamos HTML simple (p, h2, ul, li) que será estilizado
// por StaticPageLayout.module.css

interface PageContent {
  title: string;
  html: string;
}

export const staticContent: Record<string, PageContent> = {
  // --- Atención al Cliente ---
  contacto: {
    title: 'Contacto',
    html: `
      <h2>¿Necesitas Ayuda?</h2>
      <p>Estamos aquí para ti. La forma más rápida de contactarnos es por correo electrónico.</p>
      <p><strong>Email de Soporte:</strong> <a href="mailto:soporte@seoulstash.com">soporte@seoulstash.com</a></p>
      <p>Nuestro equipo de soporte al cliente (todos fans de K-Pop) responde dentro de 24 horas hábiles.</p>
      
      <h3>Horarios de Atención</h3>
      <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
    `
  },
  envios: {
    title: 'Envíos y Entregas',
    html: `
      <h2>Política de Envíos</h2>
      <p>¡Queremos que recibas tus productos lo antes posible!</p>
      <ul>
        <li><strong>Envío Estándar (5-7 días hábiles):</strong> $5.99</li>
        <li><strong>Envío Rápido (2-3 días hábiles):</strong> $12.99</li>
        <li><strong>¡Envío Gratis!</strong> En todos los pedidos superiores a $50.</li>
      </ul>
      <p>Todos los pedidos se procesan dentro de 1-2 días hábiles. Recibirás un correo de confirmación con tu número de rastreo tan pronto como tu pedido sea enviado.</p>
    `
  },
  devoluciones: {
    title: 'Devoluciones',
    html: `
      <h2>Política de Devoluciones</h2>
      <p>¿No estás 100% satisfecho? No hay problema. Aceptamos devoluciones dentro de los 30 días posteriores a la entrega.</p>
      <h3>Condiciones:</h3>
      <ul>
        <li>Los productos de K-Beauty deben estar sellados y sin usar.</li>
        <li>Los álbumes de K-Pop deben estar en su empaque original.</li>
        <li>Los productos de Snacks no son elegibles para devolución por razones de seguridad alimentaria.</li>
      </ul>
      <p>Para iniciar una devolución, por favor contacta a nuestro equipo de soporte con tu número de pedido.</p>
    `
  },
  faq: {
    title: 'Preguntas Frecuentes',
    html: `
      <h2>Preguntas Frecuentes (FAQ)</h2>
      
      <h3>¿Son auténticos sus productos?</h3>
      <p>¡Absolutamente! Nuestra Garantía de Autenticidad es nuestra mayor prioridad. Trabajamos directamente con marcas oficiales y distribuidores autorizados en Corea del Sur para asegurar que cada producto sea 100% auténtico.</p>
      
      <h3>¿Cuándo recibiré mi pedido?</h3>
      <p>Los pedidos con envío estándar suelen tardar entre 5 y 7 días hábiles. Recibirás un correo de rastreo tan pronto como se envíe.</p>
      
      <h3>¿Qué hago si mi producto de K-Beauty llega dañado?</h3>
      <p>¡Oh no! Por favor, toma una foto del daño y envíala a <a href="mailto:soporte@seoulstash.com">soporte@seoulstash.com</a> junto con tu número de pedido. Te enviaremos un reemplazo o un reembolso inmediatamente.</p>
    `
  },
  rastrear: {
    title: 'Rastrear Pedido',
    html: `
      <h2>Rastrear tu Pedido</h2>
      <p>Una vez que tu pedido ha sido enviado, recibirás un correo electrónico de confirmación que incluye un enlace y un número de rastreo.</p>
      <p>Por favor, espera hasta 24 horas para que el número de rastreo se active en el sistema del transportista.</p>
      <p>Si no has recibido tu correo de envío después de 3 días hábiles, por favor <a href="/page/contacto">contáctanos</a>.</p>
    `
  },
  garantia: {
    title: 'Garantía de Autenticidad',
    html: `
      <h2>100% Auténtico. Garantizado.</h2>
      <p>En SeoulStash, entendemos la importancia de la autenticidad, especialmente en el mundo del K-Pop y K-Beauty. El fraude y las falsificaciones son un problema real, y hemos construido nuestro negocio para combatirlo.</p>
      <h3>Nuestro Compromiso:</h3>
      <ul>
        <li><strong>Fuentes Verificadas:</strong> Solo compramos directamente de las marcas oficiales y distribuidores autorizados en Corea.</li>
        <li><strong>Control de Calidad:</strong> Nuestro equipo inspecciona el empaque, los sellos y las etiquetas de holograma (especialmente en álbumes de K-Pop) para asegurar que cumplen con los estándares oficiales.</li>
        <li><strong>Garantía de Devolución:</strong> Si alguna vez tienes dudas sobre la autenticidad de un producto, contáctanos. Lo investigaremos y te ofreceremos un reembolso completo si se comprueba que hay un problema.</li>
      </ul>
    `
  },

  // --- Empresa ---
  'sobre-nosotros': {
    title: 'Sobre Nosotros',
    html: `
      <h2>Nuestra Historia</h2>
      <p>SeoulStash nació de una simple idea: hacer que la cultura coreana sea accesible para todos, en todas partes. Fundado en 2024 por un grupo de fans (como tú), estábamos cansados de los altos costos de envío, los largos tiempos de espera y el miedo a comprar productos falsificados.</p>
      <p>Decidimos crear un *hub* centralizado, un "stash" (escondite secreto) de los mejores tesoros de Seúl, todo en un solo lugar. Desde el *holy grail* del K-Beauty hasta ese álbum de edición limitada, nuestra misión es traer la auténtica experiencia coreana directo a tu puerta, con garantía de autenticidad y un servicio al cliente que entiende tu pasión.</p>
    `
  },
  blog: {
    title: 'Blog',
    html: `
      <h2>El Blog de SeoulStash</h2>
      <p>¡Aún estamos escribiendo nuestras primeras entradas! Vuelve pronto para encontrar:</p>
      <ul>
        <li>Guías de 10 pasos de Skincare Coreano.</li>
        <li>Análisis de los nuevos lanzamientos de K-Pop.</li>
        <li>Recetas usando nuestros Snacks favoritos.</li>
        <li>¡Y mucho más!</li>
      </ul>
    `
  },
  carreras: {
    title: 'Carreras',
    html: `
      <h2>Trabaja con Nosotros</h2>
      <p>¡Actualmente no tenemos posiciones abiertas, pero siempre estamos buscando personas apasionadas por la cultura coreana!</p>
      <p>Si crees que encajarías bien en nuestro equipo, envía tu currículum y una carta de presentación (¡dinos cuál es tu grupo de K-Pop favorito!) a <a href="mailto:carreras@seoulstash.com">carreras@seoulstash.com</a>.</p>
    `
  },
  afiliados: {
    title: 'Programa de Afiliados',
    html: `
      <h2>¡Gana con tu Pasión!</h2>
      <p>¿Eres un creador de contenido, un blogger o un influencer en el espacio de K-Pop o K-Beauty? ¡Nos encantaría asociarnos contigo!</p>
      <p>Nuestro programa de afiliados ofrece comisiones competitivas, productos gratuitos y acceso exclusivo a nuevos lanzamientos. <a href="/page/contacto">Contáctanos</a> con el asunto "Programa de Afiliados" para saber más.</p>
    `
  },
  terminos: {
    title: 'Términos y Condiciones',
    html: `
      <h2>Términos y Condiciones</h2>
      <p>Bienvenido a SeoulStash. Al acceder a nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones...</p>
      <p>(Aquí iría un texto legal largo y aburrido sobre el uso del sitio, las cuentas de usuario, la propiedad intelectual y las limitaciones de responsabilidad. Este es un texto de relleno).</p>
    `
  },
  privacidad: {
    title: 'Política de Privacidad',
    html: `
      <h2>Política de Privacidad</h2>
      <p>Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tu información personal...</p>
      <p>(Aquí iría un texto legal sobre cómo se manejan los datos del usuario, las cookies, y el cumplimiento de las leyes de protección de datos. Este es un texto de relleno).</p>
    `
  }
};
