import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// 1. Importa el layout que hicimos en el Paso 60
import StaticPageLayout from '../components/StaticPageLayout/StaticPageLayout'; 

// 2. Importa el "mini-CMS" que acabamos de crear
import { staticContent } from '../services/staticContent';

const GenericTextPage: React.FC = () => {
  // 3. Lee el "slug" de la URL (ej. "sobre-nosotros")
  const { slug } = useParams<{ slug: string }>();

  // 4. Si no hay slug, o no existe en nuestro "CMS", redirige a Home
  if (!slug || !staticContent[slug]) {
    return <Navigate to="/" replace />;
  }

  // 5. Obtiene el contenido específico para este slug
  const { title, html } = staticContent[slug];

  return (
    // 6. Renderiza el layout
    <StaticPageLayout title={title}>
      {/* 7. ¡IMPORTANTE! 
          Renderiza el texto HTML de forma segura.
          (Solo hacemos esto porque CONFIAMOS en nuestro propio
          archivo staticContent.ts y sabemos que no tiene scripts maliciosos)
      */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </StaticPageLayout>
  );
};

export default GenericTextPage;
