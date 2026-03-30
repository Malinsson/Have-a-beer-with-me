import { FaArrowRight } from "react-icons/fa";

export const Button = ({ text, onClick, variant = "primary", type = "button", disabled = false }) => {
  const styles = {
    primary: "bg-dark-blue text-white",
    outlined: "border border-black text-black",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles[variant]} rounded-full p-4 flex items-center gap-2 uppercase disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {text}
      <FaArrowRight />
    </button>
  );
};