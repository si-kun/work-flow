import { Button } from "@/components/ui/button";
import React from "react";

interface EditTimeCardButtonProps {
  variant: "secondary" | "outline";
  type: "submit" | "button";
  onClick?: () => void;
  buttonText: string;
}

const EditTimeCardButton = ({
  variant,
  type,
  onClick,
  buttonText,
}: EditTimeCardButtonProps) => {
  const buttonColor = (type: string) => {
    switch (type) {
      case "submit":
        return "bg-green-500 text-white hover:bg-green-600";
      case "button":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "";
    }
  };

  return (
    <Button variant={variant} type={type} className={buttonColor(type)} onClick={onClick}>
      {buttonText}
    </Button>
  );
};

export default EditTimeCardButton;
