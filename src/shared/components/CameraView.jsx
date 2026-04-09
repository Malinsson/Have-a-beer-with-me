import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import jsQR from 'jsqr';

export const CameraView = ({ onScan }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);
    
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    
    // Försök att starta kameran när komponenten mountas
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' }, 
                    audio: false  
                });

                streamRef.current = stream;

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
                        setScannedData(code.data);
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
    //     return () => {
    //         if (videoRef.current?.srcObject) {
    //             videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    //         }
    //     };
    // }, []);
            return () => {
                // 1. Stop the animation loop
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }

                // 2. Stop all camera tracks using the streamRef
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => {
                        track.stop();
                        console.log("Stopped track:", track.kind); // Debug log
                    });
                    streamRef.current = null;
                }
            };
        }, []);

    // if (error) return <p>Kamera ej tillgänglig: {error}</p>

    return (
        <div style={{ background: "#111" }} className="relative w-full h-dvh flex flex-col overflow-hidden">
            
            {/* Top label */}
            <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
                <span className="text-white/70 text-xs tracking-widest uppercase">Skanna QR-kod</span>
            </div>
    
            {/* Video feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            />
    
            {/* Dark overlay top + bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 z-10 pointer-events-none" />
    
            {/* QR corner frame */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="relative w-56 h-56">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br" />
                </div>
            </div>
    
            {/* Hint text */}
            <div className="absolute bottom-32 left-0 right-0 z-20 flex justify-center pointer-events-none">
                <span className="text-white/50 text-xs">Rikta kameran mot en QR-kod</span>
            </div>
    
            {/* Bottom shutter bar */}
            <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center items-center gap-10">
                <div className="w-11 h-11 rounded-full border-2 border-white/40 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-white bg-white/15 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-2 border-white/50" />
                </div>
                <div className="w-11 h-11 rounded-full border-2 border-white/40 flex items-center justify-center">
                    <span className="text-white/60 text-xs font-medium">1x</span>
                </div>
            </div>

            {/* Success Popup */}
            {scannedData && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-xs flex flex-col items-center gap-4 shadow-2xl">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="w-6 h-6 border-2 border-green-500 rounded-sm border-t-4" /> {/* Simple QR icon */}
                        </div>
                        
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-gray-900">Länk hittad!</h3>
                            <p className="text-sm text-gray-500 break-all mt-1">{scannedData}</p>
                        </div>

                        <button
                            onClick={() => {
                                if (scannedData.startsWith('http')) {
                                    window.location.href = scannedData; // External link
                                } else {
                                    navigate(scannedData); // Internal app path
                                }
                            }}
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold active:scale-95 transition-transform"
                        >
                            Öppna länk
                        </button>

                        <button 
                            onClick={() => {
                                setScannedData(null); // Clear state
                                // Note: You'll need to re-trigger the scanLoop here if you want to scan again
                                window.location.reload(); // Quickest way to reset the camera & loop
                            }}
                            className="text-sm text-gray-400 font-medium"
                        >
                            Avbryt
                        </button>
                    </div>
                </div>
            )}
    
            {/* Error */}
            {error && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80">
                    <p className="text-white text-sm">Kamera ej tillgänglig: {error}</p>
                </div>
            )}
    
            {/* Hidden canvas for QR scanning */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}