'use client';

import { Check } from 'lucide-react';

interface Props {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { label: 'Shipping', number: 1 },
  { label: 'Review', number: 2 },
  { label: 'Payment', number: 3 },
];

export function CheckoutProgress({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const done = currentStep > step.number;
        const active = currentStep === step.number;
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-primary text-white ring-4 ring-primary/20'
                      : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={`text-xs font-bold tracking-wider uppercase ${
                  active ? 'text-primary' : done ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 md:w-24 h-0.5 mb-5 mx-2 transition-colors ${
                  currentStep > step.number ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
