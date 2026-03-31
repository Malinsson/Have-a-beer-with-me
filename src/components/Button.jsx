import { FaArrowRight } from "react-icons/fa";

export const Button = ({ text, onClick, variant = "primary" }) => {
  const styles = {
    primary: "bg-dark-blue text-white",
    outlined: "border border-black text-black",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles[variant]} px-7 py-2 flex items-center gap-2 uppercase`}
    >
      {text}
      <FaArrowRight />
    </button>
  );
};