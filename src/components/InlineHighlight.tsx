import React, { useEffect, useId, useRef, useState } from 'react';
import { ExternalLink, Film, Play, VideoOff, X } from 'lucide-react';
import { getHighlightEmbedUrl, getHighlightSourceUrl, getHighlightVideo } from '../data/highlight-videos';

interface InlineHighlightProps {
  momentId: string;
  momentTitle: string;
  fallbackUrl: string;
}

export const InlineHighlight: React.FC<InlineHighlightProps> = ({ momentId, momentTitle, fallbackUrl }) => {
  const video = getHighlightVideo(momentId);
  const [loadedVideoId, setLoadedVideoId] = useState<string | null>(null);
  const [failedVideoId, setFailedVideoId] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const loadButtonRef = useRef<HTMLButtonElement>(null);
  const sourceLinkRef = useRef<HTMLAnchorElement>(null);
  const hasInteractedRef = useRef(false);
  const headingId = useId();
  const noteId = useId();
  const isLoaded = Boolean(video && loadedVideoId === video.videoId);
  const hasFailed = Boolean(video && failedVideoId === video.videoId);
  const sourceUrl = video ? getHighlightSourceUrl(video.videoId) : fallbackUrl;

  useEffect(() => {
    if (!hasInteractedRef.current) return;
    // Loading/removing an iframe replaces the active control. Keep keyboard
    // users in the dialog, without moving focus on the initial modal open.
    const target = isLoaded ? iframeRef.current : hasFailed ? sourceLinkRef.current : loadButtonRef.current;
    target?.focus({ preventScroll: true });
  }, [isLoaded, hasFailed]);

  return (
    <section aria-labelledby={headingId} className="bg-slate-950 text-white border-b border-sky-200">
      <div className="px-6 sm:px-8 pt-5 pb-4">
        <div className="flex items-center justify-between gap-3">
          <h4 id={headingId} className="text-xs font-mono uppercase tracking-wider text-sky-200 flex items-center gap-2">
            <Film className="w-4 h-4 shrink-0" aria-hidden="true" />
            {video ? `${video.format} · ${video.publisher}` : 'Video archive'}
          </h4>
          {isLoaded && (
            <button
              type="button"
              onClick={() => setLoadedVideoId(null)}
              className="shrink-0 rounded-md px-2 py-2 text-xs text-slate-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" /> Close player
            </button>
          )}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-200">{video ? video.context : 'An inline clip from a verified publisher is not available for this moment yet. You can explore the archive search instead.'}</p>
      </div>

      {video && !hasFailed && (isLoaded ? (
        <div className="aspect-video w-full bg-black">
          <iframe
            ref={iframeRef}
            key={video.videoId}
            src={getHighlightEmbedUrl(video.videoId)}
            title={`${video.title} — ${video.publisher}`}
            aria-describedby={noteId}
            className="h-full w-full border-0"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => {
              setFailedVideoId(video.videoId);
              setLoadedVideoId(null);
            }}
          />
        </div>
      ) : (
        <div className="px-6 sm:px-8 pb-5">
          <button
            ref={loadButtonRef}
            type="button"
            onClick={() => {
              hasInteractedRef.current = true;
              setLoadedVideoId(video.videoId);
            }}
            aria-label={`Load inline video for ${momentTitle}`}
            aria-describedby={noteId}
            className="w-full min-h-24 py-6 px-4 rounded-xl border border-sky-300/30 bg-sky-100/10 hover:bg-sky-100/20 text-sky-50 flex items-center justify-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <Play className="w-6 h-6 fill-current" aria-hidden="true" />
            <span className="font-semibold text-sm">Load video here</span>
          </button>
        </div>
      ))}

      {hasFailed && (
        <p className="mx-6 sm:mx-8 mb-4 rounded-lg border border-sky-200/20 bg-slate-800 p-4 text-sm text-slate-200 flex items-start gap-2" role="status">
          <VideoOff className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          The video player could not load. Use the source link below to watch with the publisher.
        </p>
      )}

      <div className="px-6 sm:px-8 pb-5 space-y-3">
        {video && (
          <p id={noteId} className="text-[11px] text-slate-300 leading-relaxed">
            {isLoaded
              ? 'Press play in the player to begin. Playback may be unavailable in some regions or restricted by the publisher; the source link remains available below.'
              : 'YouTube is contacted only when you load the player. Playback does not start automatically. Regional and publisher restrictions may apply.'}
          </p>
        )}
        <a
          ref={sourceLinkRef}
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded text-xs font-semibold text-sky-200 underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          {video ? 'Watch at the original source' : 'Search video archive'}
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
};
