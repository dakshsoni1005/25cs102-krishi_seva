import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center select-none bg-white/60 backdrop-blur-xs rounded-3xl border border-slate-200/80 max-w-lg mx-auto shadow-xs">
      <Loader2 className="w-10 h-10 text-emerald-800 animate-spin mb-4" />
      <h3 className="text-base font-extrabold text-slate-800 m-0">
        Executing Smart Krishi Decision Engine...
      </h3>
      <p className="text-xs text-slate-500 font-semibold mt-1">
        Evaluating soil profiles, Open-Meteo weather telemetry, and AI models
      </p>
    </div>
  );
};

export default Loading;
