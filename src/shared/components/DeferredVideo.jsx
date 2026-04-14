import { useEffect, useRef, useState } from "react";

export const DeferredVideo = ({
    src,
    className,
    rootMargin = "200px",
    autoPlay = false,
    loop = false,
    muted = false,
    playsInline = false,
    controls = false,
    poster,
}) => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [autoplayBlocked, setAutoplayBlocked] = useState(false);

    useEffect(() => {
        if (shouldLoad) return;

        // iOS Safari can occasionally miss observer callbacks in certain layouts.
        const fallbackTimer = window.setTimeout(() => {
            setShouldLoad(true);
        }, 1200);

        const target = containerRef.current;
        if (!target || typeof IntersectionObserver === "undefined") {
            setShouldLoad(true);
            window.clearTimeout(fallbackTimer);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry?.isIntersecting) return;
                setShouldLoad(true);
                window.clearTimeout(fallbackTimer);
                observer.disconnect();
            },
            { rootMargin }
        );

        observer.observe(target);

        return () => {
            window.clearTimeout(fallbackTimer);
            observer.disconnect();
        };
    }, [rootMargin, shouldLoad]);

    useEffect(() => {
        if (!shouldLoad || !autoPlay) return;

        const video = videoRef.current;
        if (!video) return;

        const tryPlay = async () => {
            try {
                await video.play();
            } catch {
                // Autoplay is often blocked on iOS (e.g. Low Power Mode); show controls as fallback.
                setAutoplayBlocked(true);
            }
        };

        tryPlay();
    }, [autoPlay, shouldLoad]);

    return (
        <div ref={containerRef} className="w-full">
            <video
                ref={videoRef}
                src={shouldLoad ? src : undefined}
                preload={shouldLoad ? "metadata" : "none"}
                autoPlay={shouldLoad && autoPlay}
                loop={loop}
                muted={muted || autoPlay}
                defaultMuted={muted || autoPlay}
                playsInline={playsInline}
                controls={controls || autoplayBlocked}
                poster={poster}
                className={className}
            />
        </div>
    );
};

export default DeferredVideo;