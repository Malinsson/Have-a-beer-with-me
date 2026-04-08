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
  className = ""
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
      className={`${styles[variant]} ${className} w-full py-2 flex items-center justify-center gap-2 text-base uppercase transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {text}
      {showIcon && <Icon className={iconSize} />}
    </button>
  );
};