import { FaArrowRight } from "react-icons/fa6";

interface ModalProps {
    onConfirm: () => void;
}

export const Modal: React.FC<ModalProps> = ({ onConfirm }) => {
    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onConfirm}
        >
            <div
                className="bg-white rounded-2xl p-4 py-20 mx-6 flex flex-col items-center gap-4 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <img src="./src/assets/images/logo/bomarke.png" alt="" />
                <h3 className="text-2xl text-center">
                    Din öl är färdig! <br /> Börja Mingla
                </h3>
                
                <button
                    type="button"
                    onClick={onConfirm}
                    className="bg-dark-blue rounded-full p-4 flex items-center gap-2 text-white uppercase text-sm"
                >
                    Till min öl
                    <FaArrowRight className="text-white" />
                </button>
            </div>
        </div>
    );
};