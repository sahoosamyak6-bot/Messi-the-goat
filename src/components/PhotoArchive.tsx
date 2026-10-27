import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, Expand, ImageOff, X } from 'lucide-react';
import { archivePhotos } from '../data/archive-photos';
import { photoSrcSet } from '../data/photo-assets';
import { useFavourites } from '../utils/useFavourites';
import { FavouriteButton, FavouriteFilter } from './FavouriteControls';
const photoIds = archivePhotos.map(item => item.id);

/** The photographic archive is separate from the contextual iconic-moment cards. */
export function PhotoArchive() {
  const favourites = useFavourites('messi-favourite-photos-v1', photoIds);
  const [onlySaved, setOnlySaved] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const archiveRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const captionId = useId();
  const isOpen = selectedIndex !== null;
  const selected = selectedIndex === null ? null : archivePhotos[selectedIndex];

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const priority = document.body.style.getPropertyPriority('overflow');
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      document.body.style.setProperty('overflow', previousOverflow, priority);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      else archiveRef.current?.querySelector<HTMLButtonElement>('.favourite-filter button[aria-pressed="true"]')?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const changePhoto = (direction: number) => setSelectedIndex(previous =>
    previous === null ? null : (previous + direction + archivePhotos.length) % archivePhotos.length);

  const handleDialogKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      changePhoto(event.key === 'ArrowLeft' ? -1 : 1);
    }
    if (event.key !== 'Tab') return;
    const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'))
      .filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0);
    const first = elements[0];
    const last = elements.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const failImage = (src: string) => setFailedImages(previous => new Set(previous).add(src));

  return (
    <div ref={archiveRef} className="mb-14" aria-labelledby={headingId}>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6 border-l-4 border-[#a50044] pl-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-[#154284] mb-2">The photographic archive</p>
          <h3 id={headingId} className="text-2xl sm:text-3xl font-bold text-slate-950">A career in pictures</h3>
          <p className="mt-2 text-sm text-slate-600">Real photographs, individually credited. Open any picture to see the full frame.</p>
        </div>
        <span className="text-xs font-mono text-sky-800 rounded-full bg-sky-50 border border-sky-100 px-3 py-2">{archivePhotos.length} archive photographs</span>
      </div>
      <FavouriteFilter label="photos" onlySaved={onlySaved} onChange={setOnlySaved} count={favourites.saved.length} unavailable={favourites.unavailable} />
      {onlySaved && favourites.saved.length === 0 && <p className="favourite-empty" role="status">No saved photographs yet. Choose All photos, then use Save favourite on a photograph.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {archivePhotos.map((item, index) => !onlySaved || favourites.saved.includes(item.id) ? (
          <figure key={item.id} className="min-w-0 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <button type="button" aria-label={`Enlarge photograph: ${item.caption}`} onClick={() => setSelectedIndex(index)}
              className="group relative block w-full aspect-[4/3] overflow-hidden bg-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sky-500">
              {failedImages.has(item.photo.src) ? (
                <span className="flex h-full flex-col items-center justify-center gap-2 px-4 text-sky-100"><ImageOff aria-hidden="true" /><span className="text-sm">Photograph unavailable</span></span>
              ) : (
                <img src={item.photo.src} srcSet={photoSrcSet(item.photo)}
                  sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc((100vw - 68px) / 2), (max-width: 1280px) calc((100vw - 104px) / 3), 390px"
                  width={item.photo.width} height={item.photo.height} alt={item.photo.alt}
                  style={{ objectPosition: item.photo.objectPosition }} loading="lazy" decoding="async"
                  onError={() => failImage(item.photo.src)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
              )}
              <span className="absolute top-3 left-3 rounded-md bg-slate-950/80 px-2.5 py-1.5 text-xs font-mono text-white">{item.year} · {item.team}</span>
              <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#154284] shadow-sm"><Expand size={15} aria-hidden="true" /> Full photo</span>
            </button>
            <figcaption className="p-4">
              <p className="font-semibold text-sm leading-relaxed text-slate-900">{item.caption}</p>
              <FavouriteButton saved={favourites.saved.includes(item.id)} onClick={() => { favourites.toggle(item.id); if (onlySaved) requestAnimationFrame(() => archiveRef.current?.querySelector<HTMLButtonElement>('.favourite-filter button[aria-pressed="true"]')?.focus({ preventScroll: true })); }} label={`photograph: ${item.caption}`} />
              <p className="mt-2 text-xs leading-relaxed text-slate-600">Photo: {item.photo.credit}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#154284]">
                <a href={item.photo.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">Original source<span className="sr-only"> (opens in a new tab)</span></a>
                {' · '}<a href={item.photo.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{item.photo.license}<span className="sr-only"> (opens in a new tab)</span></a>
              </p>
            </figcaption>
          </figure>
        ) : null)}
      </div>

      {selected && (
        <dialog ref={dialogRef} aria-label="Archive photograph viewer" aria-describedby={captionId} tabIndex={-1}
          onKeyDown={handleDialogKey} onCancel={event => { event.preventDefault(); setSelectedIndex(null); }}
          onClick={event => { if (event.target === event.currentTarget) setSelectedIndex(null); }}
          className="fixed inset-0 m-auto w-[calc(100%_-_24px)] max-w-5xl max-h-[94dvh] overflow-y-auto rounded-2xl border border-sky-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/85">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white/95 px-4 py-3 border-b border-sky-100">
            <p className="text-xs font-mono text-[#154284]" role="status">Photo {(selectedIndex ?? 0) + 1} of {archivePhotos.length} · {selected.year} · {selected.team}</p>
            <button ref={closeRef} type="button" onClick={() => setSelectedIndex(null)} aria-label="Close photograph viewer" className="shrink-0 rounded-full p-3 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"><X size={20} aria-hidden="true" /></button>
          </div>
          <figure>
            <div className="flex min-h-48 items-center justify-center bg-slate-950">
              {failedImages.has(selected.photo.src) ? (
                <p className="p-8 text-center text-sky-100">Photograph unavailable. The caption, credit and original source are below.</p>
              ) : (
                <img key={selected.photo.src} src={selected.photo.src} srcSet={photoSrcSet(selected.photo)} sizes="(max-width: 1048px) calc(100vw - 24px), 1024px"
                  width={selected.photo.width} height={selected.photo.height} alt={selected.photo.alt} decoding="async"
                  onError={() => failImage(selected.photo.src)} className="w-full h-auto max-h-[62dvh] object-contain" />
              )}
            </div>
            <figcaption className="p-4 sm:p-6">
              <p id={captionId} className="font-semibold leading-relaxed">{selected.caption}</p>
              <FavouriteButton saved={favourites.saved.includes(selected.id)} onClick={() => favourites.toggle(selected.id)} label={`photograph: ${selected.caption}`} />
              <p className="mt-2 text-sm text-slate-600">Photo: {selected.photo.credit}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{selected.photo.modifications}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[#154284]"><a href={selected.photo.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">Original source<span className="sr-only"> (opens in a new tab)</span></a>{' · '}<a href={selected.photo.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">{selected.photo.license}<span className="sr-only"> (opens in a new tab)</span></a></p>
                <div className="flex gap-2">
                  <button type="button" aria-label="Previous photograph" onClick={() => changePhoto(-1)} className="rounded-lg border border-sky-200 p-3 text-[#154284] hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"><ArrowLeft size={20} aria-hidden="true" /></button>
                  <button type="button" aria-label="Next photograph" onClick={() => changePhoto(1)} className="rounded-lg border border-sky-200 p-3 text-[#154284] hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"><ArrowRight size={20} aria-hidden="true" /></button>
                </div>
              </div>
            </figcaption>
          </figure>
        </dialog>
      )}
    </div>
  );
}
