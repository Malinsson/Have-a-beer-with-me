import { FaArrowRight } from "react-icons/fa6";
import { Button } from "./Button";
import image from '../../assets/images/beer.png';

export const Modal = ({ onConfirm }) => {
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onConfirm}
        >
            <div
                className="bg-white border p-4 py-20 mx-6 flex flex-col items-center gap-4 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl text-center text-dark-blue">
                    Din burk är färdig!
                </h3>

                <div className="w-40 h-40">
                    <img src={image} alt="bomarke logo" />
                </div>
                
                <Button 
                    text="Till min öl"
                    type="button"
                    onClick={onConfirm}
                    showIcon={true}
                />
            </div>
        </div>
    );
};