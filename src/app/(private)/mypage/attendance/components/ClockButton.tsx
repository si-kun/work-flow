import { Button } from "@/components/ui/button";
import React from "react";

interface ClockButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  disabled: boolean;
  buttonText: string;
}

const buttonColor = (buttonText: string) => {
  switch (buttonText) {
    case "出勤":
      return "bg-green-400 hover:bg-green-300";
    case "夜勤":
      return "bg-purple-400 hover:bg-purple-300";
    case "休憩開始":
      return "bg-orange-400 hover:bg-orange-300";
    case "退勤":
      return "bg-red-400 hover:bg-red-300";
  }
};

export const CLOCK_BUTTON_TEXT = ["出勤", "夜勤", "休憩開始", "退勤"] as const;

const ClockButton = ({ onClick, disabled, buttonText }: ClockButtonProps) => {
  return (
    <Button
      variant={"outline"}
      className={`w-[70px] h-[70px] rounded-full ${buttonColor(buttonText)}`}
      onClick={onClick}
      disabled={disabled}
    >
      {buttonText}
    </Button>
  );
};

export default ClockButton;
