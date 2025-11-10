import React from "react";
import { Spinner } from "../ui/spinner";

const Loading = () => {
  return (
    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="w-8 h-8" />
        <p className="text-sm text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
};

export default Loading;
