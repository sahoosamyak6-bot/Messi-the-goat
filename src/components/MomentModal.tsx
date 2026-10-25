import React, { useEffect, useId, useRef } from 'react';
import { IconicMoment } from '../data/messi-data';
import { X, Play, ExternalLink, Calendar, MapPin, Quote, Activity } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface MomentModalProps {
  moment: IconicMoment | null;
  onClose: () => void;
}

export const MomentModal: React.FC<MomentModalProps> = ({ moment, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!moment || !dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousOverflowPriority = document.body.style.getPropertyPriority('overflow');

    // A native modal makes the background inert for keyboard and assistive technology.
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      document.body.style.setProperty('overflow', previousOverflow, previousOverflowPriority);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [moment]);

  const containKeyboardFocus = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      event.preventDefault();
      event.currentTarget.focus();
    } else if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === event.currentTarget)) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!moment) return null;

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none open:flex items-center justify-center p-4 sm:p-6 bg-transparent text-slate-100 overflow-y-auto backdrop:bg-black/85 backdrop:backdrop-blur-md"
      onKeyDown={containKeyboardFocus}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="relative bg-[#0a0f19] border border-slate-700/80 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-left my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-10 bg-[#0a0f19]/95 backdrop-blur-sm border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <span>{moment.year}</span>
            <span className="text-slate-600">·</span>
            <span>{moment.competition}</span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => {
              soundFx.playClickTone();
              onClose();
            }}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
          <img
            src={moment.imageUrl}
            alt={moment.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f19] via-transparent to-transparent opacity-90" />

          {/* Quick Metrics Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs font-mono">
            <span className="bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded shadow-sm">
              {moment.metrics.primary}
            </span>
            <span className="bg-slate-900/80 backdrop-blur-sm text-slate-300 px-3 py-1 rounded border border-slate-700">
              {moment.metrics.secondary}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <span className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                {moment.date}
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {moment.venue}
              </span>
            </div>

            <h3 id={titleId} className="text-2xl sm:text-3xl font-extrabold font-serif-prestige text-white leading-tight">
              {moment.title}
            </h3>

            <p className="mt-1 text-sm text-sky-300 font-light italic">
              {moment.subtitle}
            </p>
          </div>

          {/* Full Narrative */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400">
              The Match Context
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {moment.description}
            </p>
          </div>

          {/* Tactical Analysis Box */}
          <div className="bg-slate-900/60 p-5 rounded-lg border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-semibold">
              <Activity className="w-4 h-4" />
              Tactical & Technical Breakdown
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {moment.tacticalAnalysis}
            </p>
          </div>

          {/* Legendary Quote */}
          {moment.quote && (
            <div className="p-4 bg-slate-950/60 rounded-lg border-l-2 border-l-amber-400">
              <div className="flex gap-3">
                <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm italic text-slate-200 leading-relaxed">
                    &ldquo;{moment.quote.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs font-mono text-amber-400">
                    — {moment.quote.speaker}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
            <a
              href={moment.videoQueryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Official Highlights</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
