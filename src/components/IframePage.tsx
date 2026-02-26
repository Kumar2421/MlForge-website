import { useEffect, useRef, useState } from 'react';
import './IframePage.css';

interface IframePageProps {
    src: string;
    title: string;
}

export default function IframePage({ src, title }: Readonly<IframePageProps>) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [loading, setLoading] = useState(true);
    const [iframeHeight, setIframeHeight] = useState<number | null>(null);
    const observerRef = useRef<MutationObserver | null>(null);
    const resizeHandlerRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        setLoading(true);
        setIframeHeight(null);

        return () => {
            observerRef.current?.disconnect();
            observerRef.current = null;
            if (resizeHandlerRef.current) {
                window.removeEventListener('resize', resizeHandlerRef.current);
                resizeHandlerRef.current = null;
            }
        };
    }, [src]);

    const handleLoad = () => {
        setLoading(false);
        // Inject CSS to suppress inner nav (optional cosmetic fix)
        try {
            const doc = iframeRef.current?.contentDocument;
            if (doc) {
                const style = doc.createElement('style');
                style.textContent = 'nav:first-of-type, nav[class*="sticky"], footer { display: none !important; } body { padding-top: 0 !important; }';
                doc.head.appendChild(style);

                const updateHeight = () => {
                    try {
                        const h = Math.max(
                            doc.documentElement?.scrollHeight || 0,
                            doc.body?.scrollHeight || 0,
                        );
                        if (h > 0) setIframeHeight(h);
                    } catch {
                        // ignore
                    }
                };

                updateHeight();

                observerRef.current?.disconnect();
                observerRef.current = new MutationObserver(() => updateHeight());
                observerRef.current.observe(doc.documentElement, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true,
                });

                if (resizeHandlerRef.current) {
                    window.removeEventListener('resize', resizeHandlerRef.current);
                }
                resizeHandlerRef.current = updateHeight;
                window.addEventListener('resize', updateHeight);
                window.setTimeout(updateHeight, 0);
                window.setTimeout(updateHeight, 250);
            }
        } catch {
            // cross-origin guard – safe to ignore
        }
    };

    return (
        <div className="iframe-wrapper">
            {loading && (
                <div className="iframe-loader">
                    <div className="iframe-spinner" />
                    <span>Loading {title}…</span>
                </div>
            )}
            <iframe
                ref={iframeRef}
                src={src}
                title={title}
                className="iframe-full"
                onLoad={handleLoad}
                scrolling="no"
                style={iframeHeight ? { height: `${iframeHeight}px` } : undefined}
            />
        </div>
    );
}
