import React from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
  children: React.ReactNode;
  color?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  onClick,
  children,
  color = "bg-pink-500",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${color} text-white font-semibold py-2 px-4 rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400`}
    >
      {children}
    </button>
  );
};

export default Button;