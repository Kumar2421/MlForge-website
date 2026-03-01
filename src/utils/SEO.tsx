import { Helmet } from "react-helmet";

type Props = {
    title: string;
    description?: string;
    canonicalUrl?: string;
};

export const SEO = ({ title, description, canonicalUrl }: Props) => (
    <Helmet>
        <title>{title} | ML Forge</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
        <meta httpEquiv="Content-Security-Policy"
            content="default-src 'self'; img-src data: https: *; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta name="referrer" content="no-referrer-when-downgrade" />
    </Helmet>
);
