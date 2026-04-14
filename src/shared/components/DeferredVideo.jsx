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
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        if (shouldLoad) return;

        const target = containerRef.current;
        if (!target || typeof IntersectionObserver === "undefined") {
            setShouldLoad(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (!entry?.isIntersecting) return;
                setShouldLoad(true);
                observer.disconnect();
            },
            { rootMargin }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [rootMargin, shouldLoad]);

    return (
        <div ref={containerRef} className="w-full">
            <video
                src={shouldLoad ? src : undefined}
                preload={shouldLoad ? "metadata" : "none"}
                autoPlay={shouldLoad && autoPlay}
                loop={loop}
                muted={muted}
                playsInline={playsInline}
                controls={controls}
                poster={poster}
                className={className}
            />
        </div>
    );
};

export default DeferredVideo;