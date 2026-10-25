import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Twitter, MessageCircle, Send, Mail, Link2, Globe } from 'lucide-react';
import {
  getSectionShareMetadata,
  getAllShareableSections,
  buildSectionDirectUrl,
  generateSocialPostSnippet,
  generateSocialIntentUrls,
  copyTextToClipboard,
} from '../utils/share-helper';
import { soundFx } from '../utils/audio';
import './share-modal.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSectionId: string;
  onNavigateToSection?: (sectionId: string) => void;
}

type SnippetStyle = 'detailed' | 'compact' | 'quote';
type CopyTarget = 'link' | 'snippet';
type ShareStatus = { message: string; copied?: CopyTarget; failed?: boolean };
const sections = getAllShareableSections();
const snippetStyles: SnippetStyle[] = ['detailed', 'compact', 'quote'];

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, currentSectionId, onNavigateToSection }) => {
  const [selectedSectionId, setSelectedSectionId] = useState(() => getSectionShareMetadata(currentSectionId).sectionId);
  const [snippetStyle, setSnippetStyle] = useState<SnippetStyle>('detailed');
  const [status, setStatus] = useState<ShareStatus>({ message: '' });
  const [busy, setBusy] = useState<CopyTarget | 'share' | null>(null);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const operationRef = useRef<AbortController | null>(null);
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreFocusRef = useRef(true);
  const id = useId();

  const cancelPending = useCallback(() => {
    operationRef.current?.abort();
    operationRef.current = null;
    if (statusTimerRef.current !== null) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = null;
  }, []);

  const resetFeedback = useCallback(() => {
    cancelPending();
    setBusy(null);
    setStatus({ message: '' });
  }, [cancelPending]);

  useEffect(() => {
    setHasNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  // Reset synchronously on an externally changed section, before a late copy result can announce old content.
  useLayoutEffect(() => {
    resetFeedback();
    if (isOpen) setSelectedSectionId(getSectionShareMetadata(currentSectionId).sectionId);
  }, [isOpen, currentSectionId, resetFeedback]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousOverflowPriority = document.body.style.getPropertyPriority('overflow');
    restoreFocusRef.current = true;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      cancelPending();
      dialog.close();
      document.body.style.setProperty('overflow', previousOverflow, previousOverflowPriority);
      if (restoreFocusRef.current && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen, cancelPending]);

  const close = () => {
    cancelPending();
    dialogRef.current?.close();
    onClose();
  };

  const containKeyboardFocus = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0);
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

  if (!isOpen) return null;
  const currentMeta = getSectionShareMetadata(selectedSectionId);
  const directUrl = buildSectionDirectUrl(currentMeta.sectionId);
  const postSnippet = generateSocialPostSnippet({ sectionId: currentMeta.sectionId, style: snippetStyle });
  const intentUrls = generateSocialIntentUrls({ sectionId: currentMeta.sectionId, style: snippetStyle });

  const handleCopy = async (target: CopyTarget) => {
    if (busy || !dialogRef.current?.open) return;
    cancelPending();
    const operation = new AbortController();
    operationRef.current = operation;
    setBusy(target);
    setStatus({ message: '' });
    const copied = await copyTextToClipboard(target === 'link' ? directUrl : postSnippet, {
      signal: operation.signal,
      container: dialogRef.current,
    });
    if (operation.signal.aborted || operationRef.current !== operation) return;
    setBusy(null);
    if (!copied) {
      setStatus({ message: `Could not copy the ${target === 'link' ? 'link' : 'snippet'}. Select the text and copy it manually.`, failed: true });
      return;
    }
    soundFx.playCelebrationChime();
    setStatus({ message: `${target === 'link' ? 'Section link' : 'Post snippet'} copied.`, copied: target });
    statusTimerRef.current = setTimeout(() => {
      if (!operation.signal.aborted && operationRef.current === operation) setStatus({ message: '' });
      statusTimerRef.current = null;
    }, 3500);
  };

  const handleNativeShare = async () => {
    if (busy || !dialogRef.current?.open || typeof navigator.share !== 'function') return;
    cancelPending();
    const operation = new AbortController();
    operationRef.current = operation;
    setBusy('share');
    setStatus({ message: '' });
    try {
      await navigator.share({ title: currentMeta.previewTitle, text: currentMeta.description, url: directUrl });
    } catch (error) {
      if (!operation.signal.aborted && operationRef.current === operation && !(error instanceof DOMException && error.name === 'AbortError')) {
        setStatus({ message: 'Device sharing is unavailable. You can copy the section link instead.', failed: true });
      }
      // A dismissed share sheet must not trigger an unexpected clipboard write.
    } finally {
      if (!operation.signal.aborted && operationRef.current === operation) setBusy(null);
    }
  };

  const intentLinks = [
    { label: 'Post to X', href: intentUrls.twitter, Icon: Twitter },
    { label: 'WhatsApp', href: intentUrls.whatsapp, Icon: MessageCircle },
    { label: 'Telegram', href: intentUrls.telegram, Icon: Send },
    { label: 'Email', href: intentUrls.email, Icon: Mail },
  ];

  return (
    <dialog
      ref={dialogRef}
      tabIndex={-1}
      aria-modal="true"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      className="share-dialog"
      onKeyDown={containKeyboardFocus}
      onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="share-card">
        <header className="share-header">
          <span className="share-header-icon"><Share2 size={20} aria-hidden="true" /></span>
          <div>
            <p className="share-eyebrow">Pass the story on</p>
            <h2 id={`${id}-title`}>Share the archive.</h2>
            <p id={`${id}-description`} className="share-intro">Choose a section, copy its link, or prepare a post.</p>
          </div>
          <button ref={closeButtonRef} type="button" onClick={close} aria-label="Close share dialog" className="share-close">
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="share-content">
          <fieldset className="share-picker">
            <legend className="share-label">Choose a section</legend>
            <div className="share-chips">
              {sections.map(section => (
                <button
                  key={section.sectionId}
                  type="button"
                  aria-pressed={section.sectionId === currentMeta.sectionId}
                  onClick={() => { resetFeedback(); setSelectedSectionId(section.sectionId); }}
                >
                  {section.sectionLabel}
                </button>
              ))}
            </div>
          </fieldset>

          <section className="share-preview" aria-label="Section preview">
            <p className="share-preview-badge"><Globe size={13} aria-hidden="true" /> {currentMeta.badge}</p>
            <h3>{currentMeta.previewTitle}</h3>
            <p>{currentMeta.description}</p>
            <p className="share-highlight">{currentMeta.highlightStat}</p>
            <p className="share-tags">{currentMeta.hashtags.map(tag => <span key={tag}>#{tag}</span>)}</p>
          </section>

          <div>
            <label htmlFor={`${id}-url`} className="share-label">Direct section link</label>
            <div className="share-link-row">
              <div className="share-link-input"><Link2 size={16} aria-hidden="true" /><input id={`${id}-url`} readOnly value={directUrl} onFocus={event => event.currentTarget.select()} /></div>
              <button type="button" className="share-button share-primary" disabled={busy !== null} onClick={() => void handleCopy('link')}>
                {status.copied === 'link' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {busy === 'link' ? 'Copying…' : status.copied === 'link' ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>

          <div>
            <div className="share-snippet-heading">
              <label htmlFor={`${id}-snippet`} className="share-label">Post snippet</label>
              <div className="share-styles" role="group" aria-label="Post snippet style">
                {snippetStyles.map(style => <button key={style} type="button" aria-pressed={snippetStyle === style} onClick={() => { resetFeedback(); setSnippetStyle(style); }}>{style}</button>)}
              </div>
            </div>
            <textarea id={`${id}-snippet`} readOnly rows={5} value={postSnippet} className="share-snippet" />
            <div className="share-snippet-actions">
              <p>Preview text is a suggested post, not a live social preview.</p>
              <button type="button" className="share-button share-secondary" disabled={busy !== null} onClick={() => void handleCopy('snippet')}>
                {status.copied === 'snippet' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                {busy === 'snippet' ? 'Copying…' : status.copied === 'snippet' ? 'Copied!' : 'Copy snippet'}
              </button>
            </div>
          </div>

          <p role="status" aria-live="polite" aria-atomic="true" className={`share-status${status.failed ? ' is-error' : ''}`}>{status.message}</p>
        </div>

        <footer className="share-footer">
          <p className="share-label">Open a share composer</p>
          <p className="share-footer-note">These open another app or website. Nothing is posted automatically.</p>
          <div className="share-intents">
            {intentLinks.map(({ label, href, Icon }) => (
              <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel="noopener noreferrer">
                <Icon size={15} aria-hidden="true" /><span>{label}</span><ExternalLink size={12} aria-hidden="true" />
                {label !== 'Email' && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            ))}
          </div>
          {hasNativeShare && <button type="button" className="share-button share-device" disabled={busy !== null} onClick={() => void handleNativeShare()}><Share2 size={16} aria-hidden="true" />{busy === 'share' ? 'Sharing…' : 'More sharing options'}</button>}
          {onNavigateToSection && currentMeta.sectionId !== currentSectionId && (
            <button type="button" className="share-jump" onClick={() => {
              // Close the native modal before navigation so its automatic focus restoration cannot steal the destination focus.
              restoreFocusRef.current = false;
              close();
              onNavigateToSection(currentMeta.sectionId);
            }}>Explore {currentMeta.sectionLabel}<ExternalLink size={13} aria-hidden="true" /></button>
          )}
        </footer>
      </div>
    </dialog>
  );
};
