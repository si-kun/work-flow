import React from "react";

interface ErrorTextProps {
  text: string | undefined;
}

const ErrorText = ({ text }: ErrorTextProps) => {
  return <span className="text-red-600 text-xs font-semibold">{`※${text}`}</span>;
};

export default ErrorText;
