'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Calendar, UploadCloud, CheckCircle, FileText, Loader2, CalendarCheck } from 'lucide-react';
import { createReservation } from '@/app/[locale]/properties/actions';

function SubmitButton({ t_bookNow }: { t_bookNow: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-3 py-4 px-6 mt-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-lg font-bold rounded-xl shadow-lg shadow-emerald-200/50 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed group"
    >
      {pending ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Réservation en cours...</span>
        </>
      ) : (
        <>
          <CalendarCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span>{t_bookNow}</span>
        </>
      )}
    </button>
  );
}

export default function BookingForm({
  propertyId,
  today,
  t_selectDate,
  t_bookNow,
}: {
  propertyId: string;
  today: string;
  t_selectDate: string;
  t_bookNow: string;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <form action={createReservation.bind(null, propertyId)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2.5">
        <label htmlFor="date" className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-emerald-600" />
          {t_selectDate}
        </label>
        <div className="relative group">
          <input
            type="date"
            id="date"
            name="date"
            min={today}
            required
            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all duration-200 text-gray-800 font-semibold cursor-pointer group-hover:border-gray-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mt-2">
        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-emerald-600" />
          Pièce d'identité (PDF/Image) *
        </label>
        <div className="relative group">
          <input
            type="file"
            id="id_card"
            name="id_card"
            accept="image/*,.pdf"
            required
            onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className={`w-full px-4 py-7 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 transition-all duration-200 ${
            fileName ? 'border-emerald-500 bg-emerald-50 shadow-inner' : 'border-gray-300 bg-gray-50 group-hover:border-emerald-400 group-hover:bg-emerald-50/30'
          }`}>
            {fileName ? (
              <>
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-emerald-800 text-center px-4 truncate w-full">
                  {fileName}
                </span>
                <span className="text-xs text-emerald-600/80 font-medium">Cliquez ou glissez pour modifier</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-105 transition-transform duration-200">
                  <UploadCloud className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-gray-700 block">Uploader le scan</span>
                  <span className="text-xs text-gray-500 font-medium mt-1">Glissez ou cliquez ici</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <SubmitButton t_bookNow={t_bookNow} />
    </form>
  );
}
