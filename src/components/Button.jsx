import { MdOutlineArrowOutward } from "react-icons/md";

export const Button = ({ 
  text, 
  onClick, 
  variant = "primary", 
  type = "button", 
  disabled = false,
  icon: Icon = MdOutlineArrowOutward, // defaults to arrow but can be overridden
  showIcon = true,           // set to false to hide the icon entirely
  iconSize = "text-base",
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