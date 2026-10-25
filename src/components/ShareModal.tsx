import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Twitter,
  MessageCircle,
  Send,
  Mail,
  Sparkles,
  Link2,
  CheckCheck,
  Globe,
} from 'lucide-react';
import {
  getSectionShareMetadata,
  getAllShareableSections,
  buildSectionDirectUrl,
  generateSocialPostSnippet,
  generateSocialIntentUrls,
  copyTextToClipboard,
  SectionShareMetadata,
} from '../utils/share-helper';
import { soundFx } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSectionId: string;
  onNavigateToSection?: (sectionId: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  currentSectionId,
  onNavigateToSection,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(currentSectionId || 'hero');
  const [snippetStyle, setSnippetStyle] = useState<'detailed' | 'compact' | 'quote'>('detailed');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'link-copied' | 'snippet-copied'>('idle');
  const [hasNativeShare, setHasNativeShare] = useState<boolean>(false);

  // Sync with currentSectionId when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedSectionId(currentSectionId || 'hero');
      setCopyStatus('idle');
    }
  }, [isOpen, currentSectionId]);

  // Check Web Share API capability
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.share) {
      setHasNativeShare(true);
    }
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sections = getAllShareableSections();
  const currentMeta: SectionShareMetadata = getSectionShareMetadata(selectedSectionId);
  const directUrl = buildSectionDirectUrl(selectedSectionId);
  const postSnippet = generateSocialPostSnippet({
    sectionId: selectedSectionId,
    style: snippetStyle,
  });
  const intentUrls = generateSocialIntentUrls({
    sectionId: selectedSectionId,
    style: snippetStyle,
  });

  const handleCopyLink = async () => {
    soundFx.playCelebrationChime();
    await copyTextToClipboard(directUrl);
    setCopyStatus('link-copied');
    setTimeout(() => setCopyStatus('idle'), 3500);
  };

  const handleCopySnippet = async () => {
    soundFx.playCelebrationChime();
    await copyTextToClipboard(postSnippet);
    setCopyStatus('snippet-copied');
    setTimeout(() => setCopyStatus('idle'), 3500);
  };

  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        soundFx.playClickTone();
        await navigator.share({
          title: currentMeta.previewTitle,
          text: currentMeta.description,
          url: directUrl,
        });
      } catch {
        // User cancelled or share dismissed
      }
    }
  };

  const handleSectionChange = (sectionId: string) => {
    soundFx.playClickTone();
    setSelectedSectionId(sectionId);
    setCopyStatus('idle');
  };

  const handleNavigateAndClose = (sectionId: string) => {
    if (onNavigateToSection) {
      onNavigateToSection(sectionId);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Click Outside Backdrop */}
      <div
        className="fixed inset-0 cursor-default"
        onClick={() => {
          soundFx.playClickTone();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#0a0f1d] border border-amber-500/30 rounded-2xl shadow-2xl shadow-amber-500/10 flex flex-col z-10 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-[#0d1426]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md">
              <Share2 className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-base sm:text-lg font-bold font-serif-prestige text-white tracking-wide">
                Share Archive Section
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Generate preview titles, social post snippets, and direct section deep-links
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClickTone();
              onClose();
            }}
            aria-label="Close share dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Picker Chips */}
        <div className="px-5 pt-3 pb-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
              Select Chronicle Section
            </span>
            <span className="text-[11px] font-mono text-amber-400/90">
              Active: {currentMeta.sectionLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {sections.map((section) => {
              const isSelected = section.sectionId === selectedSectionId;
              return (
                <button
                  key={section.sectionId}
                  type="button"
                  onClick={() => handleSectionChange(section.sectionId)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {section.sectionLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rich Preview Card */}
        <div className="px-5 py-2">
          <div className="rounded-xl border border-slate-700/80 bg-gradient-to-b from-[#0e172c] to-[#090d18] p-3.5 sm:p-4 shadow-lg relative overflow-hidden group">
            {/* Ambient decorative aura */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-sky-400/90 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>The Lionel Messi Chronicle</span>
                <span className="text-slate-600">·</span>
                <span className="text-amber-300 font-semibold">{currentMeta.badge}</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-400 border border-slate-700/60 font-mono">
                #{selectedSectionId}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold font-serif-prestige text-white leading-snug tracking-tight mb-1.5">
              {currentMeta.previewTitle}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-light mb-2.5">
              {currentMeta.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/70">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-medium">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {currentMeta.highlightStat}
              </span>

              <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-400">
                {currentMeta.hashtags.map((tag) => (
                  <span key={tag} className="text-sky-300/80">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copy Direct Deep-Link Section */}
        <div className="px-5 py-2">
          <label className="block text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider mb-1">
            Direct Section URL
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-200 overflow-hidden">
              <Link2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate select-all">{directUrl}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                copyStatus === 'link-copied'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              }`}
            >
              {copyStatus === 'link-copied' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Media Post Snippet Section */}
        <div className="px-5 py-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
              Social Media Post Snippet
            </label>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setSnippetStyle('detailed')}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                  snippetStyle === 'detailed'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Detailed
              </button>
              <button
                type="button"
                onClick={() => setSnippetStyle('compact')}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                  snippetStyle === 'compact'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Compact
              </button>
              <button
                type="button"
                onClick={() => setSnippetStyle('quote')}
                className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                  snippetStyle === 'quote'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Quote
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              rows={2}
              value={postSnippet}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-200 leading-relaxed resize-none focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              onClick={handleCopySnippet}
              className={`absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                copyStatus === 'snippet-copied'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30'
              }`}
            >
              {copyStatus === 'snippet-copied' ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Snippet Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1-Click Social Broadcast Actions */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-[#080d1a] mt-1">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
            Quick Broadcast Intents
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Twitter / X */}
            <a
              href={intentUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClickTone()}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white transition-all text-xs font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Twitter className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Post to X</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* WhatsApp */}
            <a
              href={intentUrls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClickTone()}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white transition-all text-xs font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* Telegram */}
            <a
              href={intentUrls.telegram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFx.playClickTone()}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white transition-all text-xs font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Send className="w-3.5 h-3.5 text-sky-300 group-hover:scale-110 transition-transform" />
              <span>Telegram</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* Email */}
            <a
              href={intentUrls.email}
              onClick={() => soundFx.playClickTone()}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white transition-all text-xs font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Email</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          {/* Native System Share Sheet (if supported) */}
          {hasNativeShare && (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 hover:text-amber-200 text-xs font-semibold tracking-wide transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share via Device System Sheet...</span>
              </button>
            </div>
          )}

          {/* Jump to section directly */}
          {onNavigateToSection && selectedSectionId !== currentSectionId && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
              <span>Looking at another section?</span>
              <button
                type="button"
                onClick={() => handleNavigateAndClose(selectedSectionId)}
                className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
              >
                Jump to &quot;{currentMeta.sectionLabel}&quot;
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
