// components/QRScanner.jsx
import { useState } from "react";
import { HiOutlineCamera } from "react-icons/hi2";
import { CameraView } from "./CameraView.jsx";
import { Button } from "./Button.jsx";

export const QRScanner = ({ onScan, text = "Scanna QR", variant = "primary" }) => {
    const [cameraOpen, setCameraOpen] = useState(false);

    const handleScan = (data) => {
        onScan?.(data);
        setCameraOpen(false);
    };

    return (
    <>
        <Button
            text={text}
            icon={HiOutlineCamera}
            iconSize="text-xl"
            variant={variant}
            onClick={() => setCameraOpen(true)}
      />

        {cameraOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <button
                onClick={() => setCameraOpen(false)}
                className="text-white text-xl p-4 self-end"
            >
                Stäng kamera
            </button>
            <CameraView onScan={handleScan} />
        </div>
        )}
    </>
    );
};