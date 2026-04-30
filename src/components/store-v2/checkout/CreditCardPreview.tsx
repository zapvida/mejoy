'use client';

interface CreditCardPreviewProps {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
}

function formatCardNumber(num: string): string {
  const digits = num.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g) ?? [];
  const filled = groups.join(' ');
  const pad = '•••• •••• •••• ••••';
  if (!filled) return pad;
  return (filled + ' ' + pad).slice(0, 19).trim();
}

export default function CreditCardPreview({
  holderName,
  number,
  expiryMonth,
  expiryYear,
}: CreditCardPreviewProps) {
  const displayNumber = number ? formatCardNumber(number) : '•••• •••• •••• ••••';
  const displayName = holderName.toUpperCase() || 'TITULAR DO CARTÃO';
  const displayExpiry =
    expiryMonth && expiryYear ? `${expiryMonth.padStart(2, '0')}/${expiryYear.slice(-2)}` : 'MM/AA';

  return (
    <div className="bg-slate-800 rounded-xl p-6 text-white aspect-[1.586/1] max-w-[320px] w-full shadow-xl">
      <div className="flex justify-between items-start">
        <div className="w-10 h-8 rounded bg-amber-400/90 flex items-center justify-center">
          <div className="w-6 h-4 rounded-sm border border-amber-600/50 bg-amber-200/30" />
        </div>
      </div>
      <div className="mt-6 font-mono text-lg tracking-widest">
        {displayNumber}
      </div>
      <div className="mt-4 flex justify-between items-end">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Titular</p>
          <p className="text-sm font-medium truncate max-w-[180px]">{displayName}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Validade</p>
          <p className="text-sm font-medium">{displayExpiry}</p>
        </div>
      </div>
    </div>
  );
}
