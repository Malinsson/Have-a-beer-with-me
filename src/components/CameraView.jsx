import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

export const CameraView = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [error, setError] = useState(null);
    
    // Försök att starta kameran när komponenten mountas
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' }, 
                    audio: false  
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        scanLoop();
                    };
                }

            } catch (err) {
                setError(err.message);
            }
        };

        const scanLoop = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || !canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            const trick = () => {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    // Match canvas size to video
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    // Draw current video frame onto canvas
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Extract pixel data for jsQR to analyze
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: 'dontInvert',
                    });
                    
                    if (code) {
                        onScan?.( code.data ); // Pass the scanned QR code data to the parent component
                        return; // Stop scanning after a successful read
                    }
                }
                animationRef.current = requestAnimationFrame(trick);
            };

            animationRef.current = requestAnimationFrame(trick);
        }

        startCamera();
        
        // Städa upp när komponenten unmountas
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (error) return <p>Kamera ej tillgänglig: {error}</p>

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto"
        />
    );
}