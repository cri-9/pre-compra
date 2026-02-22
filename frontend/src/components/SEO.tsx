import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string;
}

const SEO = ({ 
  title = "Visual-Mecánica Servicio Inspección Automotriz en Temuco",
  description = "Inspección automotriz pre-compra en Temuco, Región de la Araucanía. Agenda tu revisión técnica, diagnóstico y otros servicios para autos usados. Servicio profesional y confiable.",
  canonical = "https://visualmecanica.cl/",
  ogImage = "https://visualmecanica.cl/favicon-512x512.png",
  keywords = "inspección automotriz, pre compra, Temuco, Región de la Araucanía, revisión técnica, autos usados, mecánica, diagnóstico, servicio automotriz"
}: SEOProps) => {
  return (
    <Helmet>
      {/* Título y descripción */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* URL Canónica - IMPORTANTE para evitar contenido duplicado */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph para redes sociales */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
