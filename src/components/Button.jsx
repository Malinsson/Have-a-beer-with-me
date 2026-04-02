import { MdOutlineArrowOutward } from "react-icons/md";

export const Button = ({ 
  text, 
  onClick, 
  variant = "primary", 
  type = "button", 
  disabled = false,
  icon: Icon = MdOutlineArrowOutward,
  showIcon = true,
  iconSize = "text-base",
  className = "" // Added this prop
}) => {

  const styles = {
    primary: "bg-dark-blue text-white",
    outlined: "border border-black text-black",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles[variant]} py-2 w-full flex items-center gap-2 text-base uppercase disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {text}
      {showIcon && <Icon className={iconSize} />}
    </button>
  );
};