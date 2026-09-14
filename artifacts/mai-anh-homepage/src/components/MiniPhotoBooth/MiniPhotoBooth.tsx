import { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Sparkles, X, RotateCcw, Download, Check, AlertCircle, RefreshCw, Heart, Star } from 'lucide-react';
import './MiniPhotoBooth.css';

export interface MiniPhotoBoothBannerProps {
  onOpen: () => void;
}

export interface MiniPhotoBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamClose?: () => void;
}

export interface PlacedSticker {
  id: string;
  emoji: string;
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  size: number;     // preview font size in px
  rotation: number; // degrees
}

// Retro Frame Palettes
export interface FrameOption {
  id: string;
  name: string;
  bg: string;
  border: string;
  text: string;
  accent: string;
}

const FRAME_OPTIONS: FrameOption[] = [
  { id: 'sakura', name: 'Sakura Pink', bg: '#ffe4ec', border: '#ef4e77', text: '#572b4d', accent: '#ff9dbb' },
  { id: 'cyworld', name: 'Cyworld Lilac', bg: '#ede0fb', border: '#7c49a4', text: '#401752', accent: '#bfa0ed' },
  { id: 'sky', name: 'Sky Pastel', bg: '#daf5fc', border: '#2ca4c7', text: '#194959', accent: '#8ee0f5' },
  { id: 'butter', name: 'Retro Butter', bg: '#fff5b8', border: '#cca014', text: '#572b4d', accent: '#ffe46b' },
  { id: 'cream', name: 'Paper White', bg: '#fffcf5', border: '#572b4d', text: '#572b4d', accent: '#f7d3dd' },
  { id: 'midnight', name: 'Night Plum', bg: '#2b1626', border: '#ff8fb2', text: '#ffffff', accent: '#572b4d' },
];

const STICKER_OPTIONS = [
  '🎀', '♡', '☆', '🦋', '🌸', '✨', '💿', '🪩', '✦', '🍒', '💌', '🧸',
  '🍓', '🍭', '👑', '🫧', '💖', '🐾', '🕊️', '🍰', '🕶️', '💄'
];

// ==========================================
// 1. SPECIAL FEATURE BANNER (Physical Cyworld machine banner)
// ==========================================
export function MiniPhotoBoothBanner({ onOpen }: MiniPhotoBoothBannerProps) {
  return (
    <div
      className="booth-banner group relative p-4 sm:p-5 rounded-none cursor-pointer my-2"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label="Enter Cyworld Mini Photo Booth"
      data-testid="banner-photo-booth"
    >
      {/* Top micro badges */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="sticker pink !py-0.5 !px-2 !text-[9px] !shadow-[2px_2px_0_#572b4d]">
            SPECIAL ATTRACTION
          </span>
          <span className="micro font-bold text-[#d94170] flex items-center gap-1">
            <Sparkles size={12} className="inline animate-spin text-[#ef4e77]" style={{ animationDuration: '4s' }} />
            3-SHOT STRIP
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#70445b] bg-[#ffffffaa] px-2 py-0.5 border border-[#572b4d]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#38b000] animate-pulse" />
          BOOTH OPEN
        </div>
      </div>

      {/* Main banner body */}
      <div className="relative z-10 grid gap-4 items-center md:grid-cols-[140px_1fr_auto]">
        {/* Retro Camera Graphic illustration */}
        <div className="flex justify-center md:justify-start">
          <div className="relative w-28 h-24 sm:w-32 sm:h-28 bg-[#ffc3d4] border-3 border-[#572b4d] shadow-[4px_4px_0_#572b4d] flex flex-col justify-between p-2 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-200">
            {/* Camera top dials */}
            <div className="flex justify-between items-center -mt-4 px-2">
              <div className="w-5 h-2 bg-[#ffea65] border-2 border-[#572b4d] rounded-t-sm" />
              <div className="w-7 h-2.5 bg-[#a8edfb] border-2 border-[#572b4d] rounded-t-sm" />
            </div>

            {/* Flash bulb & viewfinder */}
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#e63946] animate-ping" />
                <span className="font-mono text-[8px] font-bold text-[#572b4d]">REC</span>
              </div>
              <div className="w-6 h-4 bg-[#2b1828] border border-[#572b4d] rounded-xs flex items-center justify-center">
                <div className="w-4 h-2 bg-[#79daf2] rounded-xs opacity-75" />
              </div>
            </div>

            {/* Camera lens */}
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#572b4d] p-1 flex items-center justify-center shadow-inner relative overflow-hidden">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#3a1d34] via-[#5c3154] to-[#7f4a75] flex items-center justify-center relative">
                <div className="w-6 h-6 rounded-full bg-[#1b0d18] border-2 border-[#79daf2]/60 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#79daf2] opacity-80" />
                </div>
                {/* Lens glare */}
                <div className="absolute inset-0 camera-lens-glare rounded-full pointer-events-none opacity-60" />
              </div>
            </div>

            {/* Bottom film badge */}
            <div className="flex justify-between items-center text-[7px] font-mono text-[#572b4d] px-1 font-bold">
              <span>CY-2007</span>
              <span className="text-[#ef4e77]">♡ MINI</span>
            </div>
          </div>
        </div>

        {/* Banner Copy */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#ef4e77] tracking-wider mb-1">
            <span>♡</span>
            <span>CYWORLD PHOTO BOOTH</span>
            <span>♡</span>
          </div>
          <h3 className="font-mono text-xl sm:text-2xl font-black text-[#572b4d] tracking-tight leading-tight">
            MAKE A MEMORY HERE!
          </h3>
          <p className="font-mono text-xs sm:text-sm text-[#70445b] mt-1">
            TAKE YOUR OWN 3-SHOT PHOTO STRIP WITH CUTE STICKERS &amp; FRAMES
          </p>
          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-1.5 font-mono text-[10px] text-[#572b4d]">
            <span className="bg-[#ffea65] px-2 py-0.5 border border-[#572b4d] font-bold">SNAP SNAP!</span>
            <span className="bg-[#a8edfb] px-2 py-0.5 border border-[#572b4d]">CHEESE ♡</span>
            <span className="bg-[#b9f269] px-2 py-0.5 border border-[#572b4d]">INSTANT DOWNLOAD</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center md:justify-end">
          <button
            type="button"
            className="glossy-button inline-flex items-center gap-2 text-xs sm:text-sm !py-3 !px-5 group-hover:scale-105 transition-transform"
            data-testid="button-enter-photo-booth"
          >
            <Camera size={16} className="inline" />
            <span>ENTER PHOTO BOOTH →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. RETRO PHOTO BOOTH MODAL
// ==========================================
export function MiniPhotoBoothModal({ isOpen, onClose, onStreamClose }: MiniPhotoBoothModalProps) {
  // Steps: 'idle' (ready to start), 'countdown' (taking 3 photos), 'decorate' (review & customize)
  const [step, setStep] = useState<'idle' | 'countdown' | 'decorate'>('idle');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Photos
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0); // 0, 1, 2
  const [countdownNum, setCountdownNum] = useState<number | string>(3);
  const [showFlash, setShowFlash] = useState(false);

  // Customization
  const [selectedFrame, setSelectedFrame] = useState<FrameOption>(FRAME_OPTIONS[0]);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([
    { id: 'st-1', emoji: '🎀', xPercent: 82, yPercent: 8, size: 28, rotation: 12 },
    { id: 'st-2', emoji: '✦', xPercent: 14, yPercent: 44, size: 24, rotation: -10 },
    { id: 'st-3', emoji: '♡', xPercent: 84, yPercent: 86, size: 28, rotation: 8 },
  ]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [activeStamp, setActiveStamp] = useState<string>('🎀');
  const [draggingStickerId, setDraggingStickerId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    onStreamClose?.();
  }, [onStreamClose]);

  // Start camera helper
  const startCamera = useCallback(async () => {
    setCameraError(null);
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Your browser does not support webcam access. You can use Virtual Poses below ♡');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {
          // handle autoplay block
        });
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access is needed to take your photo ♡');
      setIsCameraActive(false);
    }
  }, [stopCamera]);

  // Lifecycle: open & close cleanup
  useEffect(() => {
    if (isOpen) {
      setStep('idle');
      setCapturedPhotos([]);
      setCurrentShotIndex(0);
      setCameraError(null);
      void startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopCamera();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, stopCamera]);

  // Capture a single frame from video or fallback canvas
  const captureFrame = useCallback((): string => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    if (video && video.readyState >= 2) {
      // Mirror horizontally to match the selfie preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      const vWidth = video.videoWidth || 600;
      const vHeight = video.videoHeight || 600;
      const minDim = Math.min(vWidth, vHeight);
      const sx = (vWidth - minDim) / 2;
      const sy = (vHeight - minDim) / 2;

      ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, canvas.width, canvas.height);
    } else {
      // Stylized virtual pose fallback
      ctx.fillStyle = '#ffcedb';
      ctx.fillRect(0, 0, 600, 600);
      ctx.fillStyle = '#572b4d';
      ctx.font = 'bold 36px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('♡ CYWORLD POSE ♡', 300, 260);
      ctx.font = '24px monospace';
      ctx.fillText('VIRTUAL CAMERA SNAP', 300, 310);
      ctx.font = '60px monospace';
      ctx.fillText('📸 ✨', 300, 390);
    }

    return canvas.toDataURL('image/jpeg', 0.92);
  }, []);

  // Trigger flash effect
  const triggerFlash = useCallback(() => {
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 350);
  }, []);

  // 3-Shot Countdown Flow
  const startPhotoSequence = useCallback(() => {
    setCapturedPhotos([]);
    setCurrentShotIndex(0);
    setStep('countdown');

    const photos: string[] = [];

    const runCountdownForShot = (shotNum: number) => {
      setCurrentShotIndex(shotNum);
      let count = 3;
      setCountdownNum(count);

      const countInterval = window.setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdownNum(count);
        } else if (count === 0) {
          setCountdownNum('📸');
        } else {
          window.clearInterval(countInterval);
          // Snap photo!
          triggerFlash();
          const photoData = captureFrame();
          photos.push(photoData);
          setCapturedPhotos([...photos]);

          if (shotNum < 2) {
            // Next shot after 1.4s breather
            setCountdownNum('♡ CHEESE! ♡');
            timerRef.current = window.setTimeout(() => {
              runCountdownForShot(shotNum + 1);
            }, 1400);
          } else {
            // All 3 shots finished! Stop camera and go to decorate
            setCountdownNum('COMPLETE!');
            timerRef.current = window.setTimeout(() => {
              stopCamera();
              setStep('decorate');
            }, 1000);
          }
        }
      }, 950);
    };

    runCountdownForShot(0);
  }, [captureFrame, stopCamera, triggerFlash]);

  // Fallback demo photos generator
  const useSamplePhotos = useCallback(() => {
    const samples: string[] = [];
    const colors = ['#ffc3d4', '#a8edfb', '#ffea65'];
    const emojis = ['✌️', '🫰', '✨'];

    colors.forEach((bg, i) => {
      const c = document.createElement('canvas');
      c.width = 600;
      c.height = 600;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 600, 600);
        // Retro grid lines
        ctx.strokeStyle = 'rgba(87, 43, 77, 0.15)';
        ctx.lineWidth = 4;
        for (let x = 0; x <= 600; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 600);
          ctx.stroke();
        }
        for (let y = 0; y <= 600; y += 50) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(600, y);
          ctx.stroke();
        }
        ctx.fillStyle = '#572b4d';
        ctx.font = '900 110px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emojis[i], 300, 260);

        ctx.font = 'bold 30px monospace';
        ctx.fillText(`MAI ANH'S HOMEPAGE`, 300, 390);
        ctx.font = '22px monospace';
        ctx.fillStyle = '#ef4e77';
        ctx.fillText(`POSE 0${i + 1} / 03 ♡`, 300, 435);
      }
      samples.push(c.toDataURL('image/jpeg', 0.92));
    });

    setCapturedPhotos(samples);
    stopCamera();
    setStep('decorate');
  }, [stopCamera]);

  // Retake sequence
  const handleRetakeAll = useCallback(() => {
    setCapturedPhotos([]);
    setStep('idle');
    void startCamera();
  }, [startCamera]);

  // Place active sticker at click location on the strip
  const handleStripClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If click originated from a sticker itself or mini bubble controls, ignore
    if ((e.target as HTMLElement).closest('.draggable-sticker') || (e.target as HTMLElement).closest('.sticker-mini-bubble')) {
      return;
    }
    if (!stripRef.current) return;
    const rect = stripRef.current.getBoundingClientRect();
    const xPercent = Math.max(6, Math.min(94, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(3, Math.min(97, ((e.clientY - rect.top) / rect.height) * 100));

    const newSticker: PlacedSticker = {
      id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      emoji: activeStamp,
      xPercent,
      yPercent,
      size: 28,
      rotation: Math.floor(Math.random() * 24) - 12,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const addStickerCenter = (emoji: string) => {
    setActiveStamp(emoji);
    const newSticker: PlacedSticker = {
      id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      emoji,
      xPercent: 50 + (Math.random() * 16 - 8),
      yPercent: 50 + (Math.random() * 20 - 10),
      size: 28,
      rotation: Math.floor(Math.random() * 20) - 10,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
  };

  const handleStickerPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    setSelectedStickerId(id);
    setDraggingStickerId(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleStickerPointerMove = (e: React.PointerEvent, id: string) => {
    if (draggingStickerId !== id || !stripRef.current) return;
    const rect = stripRef.current.getBoundingClientRect();
    const xPercent = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const yPercent = Math.max(2, Math.min(98, ((e.clientY - rect.top) / rect.height) * 100));

    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, xPercent, yPercent } : s))
    );
  };

  const handleStickerPointerUp = (e: React.PointerEvent, id: string) => {
    if (draggingStickerId === id) {
      setDraggingStickerId(null);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const rotateSelected = (deg = 15) => {
    if (!selectedStickerId) return;
    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === selectedStickerId ? { ...s, rotation: (s.rotation + deg) % 360 } : s))
    );
  };

  const resizeSelected = (delta: number) => {
    if (!selectedStickerId) return;
    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === selectedStickerId ? { ...s, size: Math.max(16, Math.min(54, s.size + delta)) } : s))
    );
  };

  const deleteSelected = () => {
    if (!selectedStickerId) return;
    setPlacedStickers((prev) => prev.filter((s) => s.id !== selectedStickerId));
    setSelectedStickerId(null);
  };

  const clearAllStickers = () => {
    setPlacedStickers([]);
    setSelectedStickerId(null);
  };

  const resetDefaultStickers = () => {
    setPlacedStickers([
      { id: 'st-1', emoji: '🎀', xPercent: 82, yPercent: 8, size: 28, rotation: 12 },
      { id: 'st-2', emoji: '✦', xPercent: 14, yPercent: 44, size: 24, rotation: -10 },
      { id: 'st-3', emoji: '♡', xPercent: 84, yPercent: 86, size: 28, rotation: 8 },
    ]);
    setSelectedStickerId(null);
  };

  // Compose high-resolution Photo Strip onto HTML Canvas and Download
  const downloadPhotoStrip = useCallback(async () => {
    if (capturedPhotos.length === 0) return;
    setIsDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 800;
      const height = 2100;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Frame Background
      ctx.fillStyle = selectedFrame.bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle Cyworld retro dot pattern on frame
      ctx.fillStyle = selectedFrame.accent + '55';
      for (let x = 15; x < width; x += 30) {
        for (let y = 15; y < height; y += 30) {
          ctx.beginPath();
          ctx.arc(x, y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Outer border
      ctx.strokeStyle = selectedFrame.border;
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, width - 14, height - 14);

      // Inner thin border
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      // 2. Header Area
      ctx.fillStyle = selectedFrame.text;
      ctx.textAlign = 'center';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('♡ CYWORLD PHOTO BOOTH ♡', width / 2, 85);

      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = selectedFrame.border;
      ctx.fillText('MAI ANH’S MINI HOMEPAGE · 3-SHOT MEMORY', width / 2, 120);

      // 3. Load & Draw the 3 Photos
      const photoWidth = 680;
      const photoHeight = 490;
      const photoX = (width - photoWidth) / 2;
      const startY = 160;
      const gap = 45;

      const loadedImages = await Promise.all(
        capturedPhotos.slice(0, 3).map(
          (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = src;
            })
        )
      );

      loadedImages.forEach((img, i) => {
        const y = startY + i * (photoHeight + gap);

        // Photo shadow
        ctx.fillStyle = selectedFrame.border;
        ctx.fillRect(photoX + 8, y + 8, photoWidth, photoHeight);

        // Photo border frame (white polaroid style)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(photoX, y, photoWidth, photoHeight);

        // Draw image inside with 10px inset
        const pad = 10;
        ctx.drawImage(img, photoX + pad, y + pad, photoWidth - pad * 2, photoHeight - pad * 2);

        // Border around photo
        ctx.strokeStyle = selectedFrame.border;
        ctx.lineWidth = 4;
        ctx.strokeRect(photoX, y, photoWidth, photoHeight);

        // Corner shot tag
        ctx.fillStyle = selectedFrame.border;
        ctx.fillRect(photoX + 16, y + 16, 80, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`SHOT 0${i + 1}`, photoX + 56, y + 31);
      });

      // 4. Footer Area
      const footerY = startY + 3 * photoHeight + 2 * gap + 50;

      // Decorative divider
      ctx.strokeStyle = selectedFrame.border;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(photoX, footerY);
      ctx.lineTo(photoX + photoWidth, footerY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Footer text & date
      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      ctx.fillStyle = selectedFrame.text;
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('♡ 2000s FOREVER LOVE ♡', width / 2, footerY + 50);

      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = selectedFrame.border;
      ctx.fillText(`DATE: ${dateStr} ${timeStr} · SEOUL / HANOI`, width / 2, footerY + 85);

      ctx.font = '15px monospace';
      ctx.fillStyle = selectedFrame.text;
      ctx.fillText('MAI ANH’S HOMEPAGE · MINI ROOM PHOTO STUDIO', width / 2, footerY + 115);

      // 5. Draw All User Placed Stickers exactly where user positioned them
      placedStickers.forEach((st) => {
        const cx = (st.xPercent / 100) * width;
        const cy = (st.yPercent / 100) * height;
        // Preview strip is ~260px wide, canvas is 800px wide (ratio 800 / 260)
        const canvasSize = Math.round((st.size / 260) * width);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((st.rotation * Math.PI) / 180);
        ctx.font = `${canvasSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.emoji, 0, 0);
        ctx.restore();
      });

      // 6. Trigger download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cyworld-photobooth.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to compose photo strip:', err);
      setIsDownloading(false);
    }
  }, [capturedPhotos, selectedFrame, placedStickers]);

  if (!isOpen) return null;

  return (
    <div
      className="booth-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          stopCamera();
          onClose();
        }
      }}
      data-testid="modal-photo-booth"
    >
      <div className="booth-modal-box">
        {/* Retro Window Header */}
        <div className="window-bar !bg-gradient-to-r !from-[#ef4e77] !via-[#b53db5] !to-[#4c84eb]">
          <span className="flex items-center gap-2 font-bold tracking-wider">
            <Camera size={14} className="inline text-[#ffea65]" />
            CYWORLD_PHOTO_BOOTH_v2.0.exe — 3-Shot Memory Strip
          </span>
          <span className="flex items-center gap-2">
            <span className="window-dots">
              <i />
              <i />
              <i />
            </span>
            <button
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="p-1 hover:bg-black/20 rounded-xs transition-colors"
              aria-label="Close photo booth"
              data-testid="button-close-booth"
            >
              <X size={15} />
            </button>
          </span>
        </div>

        {/* Shutter Flash Animation */}
        {showFlash && <div className="shutter-flash" />}

        {/* Modal Content */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1">
          {/* =========================================================
              VIEW 1: CAMERA LIVE FEED & COUNTDOWN
             ========================================================= */}
          {step === 'idle' || step === 'countdown' ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_260px] items-start">
              {/* Left Column: Camera Viewport */}
              <div className="space-y-3">
                <div className="relative aspect-square max-w-[480px] mx-auto w-full bg-[#1e1022] border-4 border-[#572b4d] shadow-[6px_6px_0_#572b4d] overflow-hidden flex items-center justify-center">
                  {/* Live Video */}
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className={`w-full h-full object-cover transform scale-x-[-1] ${
                      !isCameraActive ? 'hidden' : ''
                    }`}
                  />

                  {/* CRT scanlines effect */}
                  <div className="absolute inset-0 crt-scanlines" />

                  {/* Top viewfinder overlay */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono text-[#ffea65] bg-[#00000088] px-2 py-1 border border-[#572b4d]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef233c] animate-ping" />
                      <span className="font-bold">REC ● LIVE</span>
                    </div>
                    <span>{step === 'countdown' ? `PHOTO 0${currentShotIndex + 1} / 03` : 'READY 0/3'}</span>
                  </div>

                  {/* Center Countdown Badge */}
                  {step === 'countdown' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 z-30">
                      <div className="countdown-pulse border-4 border-[#572b4d] bg-[#ffea65] text-[#572b4d] px-6 py-4 shadow-[6px_6px_0_#ef4e77] text-center font-mono">
                        <div className="text-4xl sm:text-6xl font-black">{countdownNum}</div>
                        <div className="micro mt-1 font-bold">
                          {typeof countdownNum === 'number' ? `STRIKE POSE #${currentShotIndex + 1} ♡` : 'SNAP!'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Camera Error / Permission Denied State */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-[#fff5f8] p-6 flex flex-col items-center justify-center text-center z-20">
                      <AlertCircle size={44} className="text-[#ef4e77] mb-2" />
                      <h4 className="font-mono font-bold text-lg text-[#572b4d]">CAMERA PERMISSION</h4>
                      <p className="font-mono text-xs text-[#70445b] mt-2 max-w-xs">{cameraError}</p>
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => void startCamera()}
                          className="glossy-button !py-2 !px-4 text-xs inline-flex items-center gap-1"
                        >
                          <RefreshCw size={13} /> TRY AGAIN
                        </button>
                        <button
                          type="button"
                          onClick={useSamplePhotos}
                          className="nav-chip !bg-[#b9f269] text-xs font-bold"
                          data-testid="button-use-sample-poses"
                        >
                          USE VIRTUAL POSES ♡
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Camera loading state */}
                  {!cameraError && !isCameraActive && (
                    <div className="text-center font-mono text-[#a8edfb] text-xs space-y-2">
                      <Camera size={36} className="mx-auto animate-bounce text-[#ffea65]" />
                      <p>STARTING RETRO CAMERA...</p>
                      <p className="text-[10px] text-[#ffc3d4]">PLEASE ALLOW CAMERA ACCESS IN YOUR BROWSER ♡</p>
                    </div>
                  )}
                </div>

                {/* Micro privacy note */}
                <p className="text-center font-mono text-[9px] text-[#70445b]">
                  🔒 <span className="font-bold">100% Client-Side</span> — Your photos stay in your browser. Nothing is uploaded to any server.
                </p>
              </div>

              {/* Right Column: Controls & Information */}
              <div className="space-y-4">
                <div className="paper-card p-3">
                  <div className="micro text-[#d94170] font-bold mb-1">BOOTH INSTRUCTIONS</div>
                  <h4 className="font-mono font-black text-sm text-[#572b4d]">HOW IT WORKS:</h4>
                  <ol className="mt-2 space-y-1.5 font-mono text-[11px] text-[#70445b] list-decimal list-inside">
                    <li>Click <strong className="text-[#d94170]">START!</strong> below</li>
                    <li>3-second retro countdown</li>
                    <li>Smile for 3 poses in a row</li>
                    <li>Decorate your strip &amp; download</li>
                  </ol>
                </div>

                {/* Live sequence progress dots */}
                <div className="paper-card p-3">
                  <div className="micro text-[#572b4d] mb-2 font-bold">SHOT PROGRESS:</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`border-2 border-[#572b4d] aspect-square flex flex-col items-center justify-center p-1 text-center font-mono text-[10px] ${
                          capturedPhotos[i]
                            ? 'bg-[#b9f269] font-bold text-[#2d6a4f]'
                            : currentShotIndex === i && step === 'countdown'
                            ? 'bg-[#ffea65] animate-pulse font-bold text-[#572b4d]'
                            : 'bg-[#fff0d6] text-[#8a5570]'
                        }`}
                      >
                        {capturedPhotos[i] ? (
                          <>
                            <Check size={14} className="text-[#2d6a4f]" />
                            <span>SHOT {i + 1}</span>
                          </>
                        ) : (
                          <>
                            <span>0{i + 1}</span>
                            <span className="text-[8px]">{currentShotIndex === i ? 'LIVE' : 'WAIT'}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={step === 'countdown' || !isCameraActive}
                    onClick={startPhotoSequence}
                    className="glossy-button w-full !py-3.5 !text-sm text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="button-start-booth-sequence"
                  >
                    {step === 'countdown' ? '📸 SNAPPING PHOTOS...' : 'START 3-SHOT SEQUENCE 📸'}
                  </button>

                  <button
                    type="button"
                    onClick={useSamplePhotos}
                    className="w-full border-2 border-[#572b4d] bg-[#ffea65] hover:bg-[#a8edfb] transition-colors p-2 text-center font-mono text-xs font-bold text-[#572b4d] shadow-[2px_2px_0_#572b4d]"
                  >
                    TRY WITH VIRTUAL POSES ✨
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* =========================================================
              VIEW 2: DECORATE & DOWNLOAD PHOTO STRIP
             ========================================================= */}
          {step === 'decorate' ? (
            <div className="grid gap-6 md:grid-cols-[280px_1fr] items-start">
              {/* Left: Photo Strip Preview with Interactive Placed Stickers */}
              <div className="flex flex-col items-center">
                <div className="micro font-bold text-[#ef4e77] mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} /> INTERACTIVE PHOTO STRIP <Sparkles size={12} />
                </div>
                <div
                  ref={stripRef}
                  onClick={handleStripClick}
                  className="photo-strip-preview strip-interactive-canvas w-[240px] sm:w-[260px] p-3 border-4 border-[#572b4d] relative select-none cursor-crosshair shadow-[5px_5px_0_#572b4d]"
                  style={{ backgroundColor: selectedFrame.bg }}
                  title="Click anywhere to stamp sticker, or drag stickers to move them!"
                >
                  {/* Strip Header */}
                  <div className="text-center mb-2 pb-1.5 border-b border-dashed border-[#572b4d]/40 pointer-events-none">
                    <p className="font-mono text-[11px] font-black" style={{ color: selectedFrame.text }}>
                      ♡ CYWORLD BOOTH ♡
                    </p>
                    <p className="font-mono text-[8px] font-bold" style={{ color: selectedFrame.border }}>
                      MAI ANH’S MINI HOMEPAGE
                    </p>
                  </div>

                  {/* 3 Photos Stacked */}
                  <div className="space-y-2 pointer-events-none">
                    {capturedPhotos.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square border-2 border-[#572b4d] bg-white overflow-hidden shadow-[2px_2px_0_#572b4d]"
                      >
                        <img
                          src={src}
                          alt={`Captured shot ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Stamp corner indicator */}
                        <span
                          className="absolute top-1 left-1 text-[8px] font-mono px-1 font-bold text-white border border-[#572b4d]"
                          style={{ backgroundColor: selectedFrame.border }}
                        >
                          0{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Strip Footer */}
                  <div className="text-center mt-3 pt-2 border-t border-dashed border-[#572b4d]/40 pointer-events-none">
                    <p className="font-mono text-[10px] font-bold" style={{ color: selectedFrame.text }}>
                      ♡ 2000s LOVE ♡
                    </p>
                    <p className="font-mono text-[8px]" style={{ color: selectedFrame.border }}>
                      {new Date().toISOString().slice(0, 10).replace(/-/g, '.')}
                    </p>
                  </div>

                  {/* Draggable Placed Stickers Layer */}
                  {placedStickers.map((st) => {
                    const isSelected = selectedStickerId === st.id;
                    return (
                      <div
                        key={st.id}
                        className={`draggable-sticker ${isSelected ? 'is-selected' : ''}`}
                        style={{
                          left: `${st.xPercent}%`,
                          top: `${st.yPercent}%`,
                          fontSize: `${st.size}px`,
                          transform: `translate(-50%, -50%) rotate(${st.rotation}deg)`,
                        }}
                        onPointerDown={(e) => handleStickerPointerDown(e, st.id)}
                        onPointerMove={(e) => handleStickerPointerMove(e, st.id)}
                        onPointerUp={(e) => handleStickerPointerUp(e, st.id)}
                        title="Drag freely to move, or tap to rotate/resize!"
                      >
                        <span className="select-none">{st.emoji}</span>

                        {isSelected && (
                          <div
                            className="sticker-mini-bubble"
                            onClick={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => rotateSelected(20)}
                              title="Rotate sticker"
                            >
                              ⟳
                            </button>
                            <button
                              type="button"
                              onClick={() => resizeSelected(4)}
                              title="Enlarge sticker"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => resizeSelected(-4)}
                              title="Shrink sticker"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={deleteSelected}
                              title="Remove sticker"
                              className="!bg-[#ff837e]"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="font-mono text-[10px] text-[#70445b] mt-2 text-center max-w-[260px]">
                  💡 <strong>Tip:</strong> Tap on the strip to stamp, or drag stickers to any position!
                </p>
              </div>

              {/* Right: Decoration Controls & Download */}
              <div className="space-y-4">
                <div className="paper-card p-4">
                  <div className="micro text-[#d94170] font-bold">STEP 2 / 2: DECORATE & SAVE</div>
                  <h3 className="font-mono font-black text-base sm:text-lg text-[#572b4d] mt-1">
                    ♡ DECORATE YOUR PHOTO STRIP ♡
                  </h3>
                  <p className="font-mono text-xs text-[#70445b] mt-1">
                    Pick your retro frame color, choose your favorite stickers, and drag them anywhere on the strip!
                  </p>
                </div>

                {/* 1. Frame Selector */}
                <div className="paper-card p-4">
                  <div className="micro font-bold text-[#572b4d] mb-2.5">
                    1. CHOOSE FRAME COLOR: <span className="text-[#ef4e77]">{selectedFrame.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {FRAME_OPTIONS.map((frame) => (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => setSelectedFrame(frame)}
                        className={`frame-swatch rounded-sm flex items-center justify-center ${
                          selectedFrame.id === frame.id ? 'selected' : ''
                        }`}
                        style={{ backgroundColor: frame.bg }}
                        title={frame.name}
                        aria-label={`Select frame color ${frame.name}`}
                      >
                        {selectedFrame.id === frame.id && <Check size={14} className="text-[#572b4d]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Interactive Stickers Palette */}
                <div className="paper-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="micro font-bold text-[#572b4d]">2. PICK & PLACE STICKERS:</span>
                    <span className="font-mono text-[10px] text-[#70445b] font-bold">
                      {placedStickers.length} placed on strip
                    </span>
                  </div>

                  {/* Stamp Tool & Add Center */}
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-[#fff0d6] border border-[#572b4d]">
                    <span className="font-mono text-xs text-[#572b4d]">ACTIVE STAMP:</span>
                    <span className="text-xl border border-[#572b4d] bg-white px-2 py-0.5 shadow-[1px_1px_0_#572b4d]">
                      {activeStamp}
                    </span>
                    <button
                      type="button"
                      onClick={() => addStickerCenter(activeStamp)}
                      className="glossy-button !py-1 !px-2.5 !text-[11px] ml-auto"
                      data-testid="button-add-sticker-center"
                    >
                      + ADD TO STRIP
                    </button>
                  </div>

                  {/* Stickers Grid */}
                  <div className="flex flex-wrap gap-2">
                    {STICKER_OPTIONS.map((st) => {
                      const isActive = activeStamp === st;
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setActiveStamp(st);
                            addStickerCenter(st);
                          }}
                          className={`sticker-btn w-9 h-9 rounded-sm text-base flex items-center justify-center transition-transform hover:scale-110 ${
                            isActive ? 'selected ring-2 ring-[#ef4e77]' : ''
                          }`}
                          title={`Click to stamp ${st} on strip`}
                          aria-label={`Select sticker ${st}`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>

                  {/* Clear & Reset buttons */}
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={clearAllStickers}
                      className="text-[#70445b] hover:text-[#df3b70] underline cursor-pointer"
                    >
                      Clear all stickers
                    </button>
                    <button
                      type="button"
                      onClick={resetDefaultStickers}
                      className="text-[#572b4d] font-bold hover:underline cursor-pointer"
                    >
                      Reset default layout
                    </button>
                  </div>
                </div>

                {/* 3. Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={() => void downloadPhotoStrip()}
                    className="glossy-button w-full !py-3 !text-sm flex items-center justify-center gap-2"
                    data-testid="button-download-photo-strip"
                  >
                    <Download size={16} />
                    <span>{isDownloading ? 'GENERATING IMAGE...' : 'DOWNLOAD PHOTO STRIP (PNG)'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleRetakeAll}
                      className="border-2 border-[#572b4d] bg-[#ffea65] hover:bg-[#ffe338] transition-colors p-2.5 text-center font-mono text-xs font-bold text-[#572b4d] shadow-[3px_3px_0_#572b4d] flex items-center justify-center gap-1.5"
                      data-testid="button-retake-booth"
                    >
                      <RotateCcw size={13} /> RETAKE ALL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        stopCamera();
                        onClose();
                      }}
                      className="border-2 border-[#572b4d] bg-[#fff8e9] hover:bg-[#fff0d6] transition-colors p-2.5 text-center font-mono text-xs font-bold text-[#572b4d] shadow-[3px_3px_0_#572b4d]"
                    >
                      CLOSE BOOTH
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
