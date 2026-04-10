import { FaArrowRight } from "react-icons/fa6";
import { Button } from "./Button";
import canReadyComp from '../../assets/animations/canReadyComp.mp4';

export const Modal = ({ onConfirm }) => {
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onConfirm}
        >
            <div
                className="bg-white border p-4 mx-6 flex flex-col max-w-sm w-full h-[70vh] max-h-140 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl text-center text-dark-blue w-full absolute top-10 left-1/2 -translate-x-1/2">
                    Din burk är färdig!
                </h3>

                <div className="w-full flex-1 flex items-center justify-center">
                    <video 
                        src={canReadyComp} 
                        alt="Din färdiga burk"
                        className="max-h-full max-w-full object-contain"
                        autoPlay
                        muted
                    />
                </div>
                
                <Button 
                    text="Till min öl"
                    type="button"
                    onClick={onConfirm}
                    showIcon={true}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-[70vw]"
                />
            </div>
        </div>
    );
};