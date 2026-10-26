import { photoSrcSet } from '../data/photo-assets';
import React, { useEffect, useId, useRef, useState } from 'react';
import { IconicMoment } from '../data/messi-data';
import { getMomentPhoto } from '../data/moment-photos';
import { X, Calendar, MapPin, Quote, Activity, ImageOff } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { InlineHighlight } from './InlineHighlight';

interface MomentModalProps {
  moment: IconicMoment | null;
  onClose: () => void;
}

export const MomentModal: React.FC<MomentModalProps> = ({ moment, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

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
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
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
  const { photo, contextLabel } = getMomentPhoto(moment);

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none open:flex items-center justify-center p-4 sm:p-6 bg-transparent text-slate-900 overflow-y-auto backdrop:bg-slate-950/75 backdrop:backdrop-blur-md"
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
        className="relative bg-white border border-sky-200 rounded-xl max-w-2xl w-full max-h-[calc(100dvh_-_32px)] sm:max-h-[calc(100dvh_-_48px)] overflow-y-auto shadow-2xl text-left overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-sky-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex flex-wrap items-center gap-2 text-xs font-mono text-sky-700 uppercase tracking-wider">
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
            className="shrink-0 min-w-11 min-h-11 grid place-items-center p-2.5 text-slate-500 hover:text-sky-900 rounded-lg hover:bg-sky-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <InlineHighlight
          key={moment.id}
          momentId={moment.id}
          momentTitle={moment.title}
          fallbackUrl={moment.videoQueryUrl}
        />

        {/* Context image: never presented as a photograph of this specific event. */}
        <figure>
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
            {failedImageSrc === photo.src ? (
              <div className="h-full w-full flex flex-col items-center justify-center gap-3 px-6 text-center text-sky-100" role="img" aria-label={`Archive photograph unavailable. ${photo.alt}`}>
                <ImageOff className="w-8 h-8" aria-hidden="true" />
                <span className="text-sm">Archive photograph unavailable</span>
                <span className="text-xs text-slate-300">The moment’s story and video archive are still available.</span>
              </div>
            ) : (
              <img
                src={photo.src}
                        srcSet={photoSrcSet(photo)}
                        sizes="(max-width: 768px) calc(100vw - 32px), 736px"
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                style={{ objectPosition: photo.objectPosition }}
                onError={() => setFailedImageSrc(photo.src)}
                className="w-full h-full object-cover"
                decoding="async"
              />
            )}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap gap-2 items-center justify-between text-xs font-mono">
              <span className="bg-sky-100 text-slate-950 font-bold px-3 py-1.5 rounded-md shadow-sm">
                {moment.metrics.primary}
              </span>
              <span className="bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-md border border-white/20">
                {moment.metrics.secondary}
              </span>
            </div>
          </div>
          <figcaption className="px-6 sm:px-8 pt-4 text-[11px] text-slate-500 leading-relaxed">
            <p>{contextLabel}</p>
            <p className="mt-1">
              <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-sky-800">{photo.credit}</a>
              {' · '}
              <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-sky-800">{photo.license}</a>
              {' · Optimized; display cropped.'}
            </p>
          </figcaption>
        </figure>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mb-2">
              <span className="flex items-center gap-1 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                {moment.date}
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-sky-700" />
                {moment.venue}
              </span>
            </div>

            <h3 id={titleId} className="text-2xl sm:text-3xl font-extrabold font-serif-prestige text-slate-950 leading-tight">
              {moment.title}
            </h3>

            <p className="mt-1 text-sm text-sky-700 font-light italic">
              {moment.subtitle}
            </p>
          </div>

          {/* Full Narrative */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500">
              The Match Context
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {moment.description}
            </p>
          </div>

          {/* Tactical Analysis Box */}
          <div className="bg-sky-50 p-5 rounded-lg border border-sky-100 space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-sky-700 flex items-center gap-1.5 font-semibold">
              <Activity className="w-4 h-4" />
              Tactical & Technical Breakdown
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {moment.tacticalAnalysis}
            </p>
          </div>

          {/* Legendary Quote */}
          {moment.quote && (
            <div className="p-4 bg-sky-50 rounded-lg border-l-2 border-l-sky-500">
              <div className="flex gap-3">
                <Quote className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm italic text-slate-700 leading-relaxed">
                    &ldquo;{moment.quote.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs font-mono text-sky-700">
                    — {moment.quote.speaker}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-sky-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 bg-white hover:bg-sky-50 text-slate-600 text-xs font-semibold rounded border border-sky-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
