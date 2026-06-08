import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { track } from "@vercel/analytics";

interface VolumeSliderProps {
  initialVolume: number;
  isVideoMuted: boolean;
  setIsVideoMuted: (muted: boolean) => void;
  onVolumeChangeCommit: (volume: number) => void;
  ytPlayerRef: React.MutableRefObject<unknown>;
}

export function VolumeSlider({
  initialVolume,
  isVideoMuted,
  setIsVideoMuted,
  onVolumeChangeCommit,
  ytPlayerRef,
}: VolumeSliderProps) {
  // localVolume is only used while the user is actively dragging.
  // When idle, we render initialVolume (parent-owned state) directly to avoid sync issues.
  const [localVolume, setLocalVolume] = useState<number>(initialVolume);
  const localVolumeRef = useRef<number>(initialVolume);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const displayVolume = isDragging ? localVolume : initialVolume;

  const applyVolumeToPlayer = (newVolume: number) => {
    const player = ytPlayerRef.current as Record<string, (...args: unknown[]) => void>;
    if (player && player.setVolume) {
      try {
        player.setVolume(newVolume * 100);
        if (newVolume === 0) {
          player.mute();
        } else {
          player.unMute();
        }
      } catch {
        // YT player may not be ready yet
      }
    }
  };

  const getVolumeFromEvent = (
    e:
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent<HTMLDivElement>
      | MouseEvent
      | TouchEvent
  ): number | null => {
    if (!volumeBarRef.current) return null;
    const rect = volumeBarRef.current.getBoundingClientRect();
    let clientY: number;
    if ("touches" in e && e.touches.length > 0) {
      clientY = e.touches[0].clientY;
    } else if ("clientY" in e) {
      clientY = e.clientY;
    } else {
      return null;
    }
    const relativeY = clientY - rect.top;
    const percentage = 1 - relativeY / rect.height;
    return Math.max(0, Math.min(1, percentage));
  };

  const handleMove = (newVolume: number) => {
    setLocalVolume(newVolume);
    localVolumeRef.current = newVolume;
    applyVolumeToPlayer(newVolume);
    if (newVolume > 0 && isVideoMuted) {
      setIsVideoMuted(false);
    } else if (newVolume === 0 && !isVideoMuted) {
      setIsVideoMuted(true);
    }
  };

  const handleVolumeClick = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const newVolume = getVolumeFromEvent(e);
    if (newVolume === null) return;
    handleMove(newVolume);
    onVolumeChangeCommit(newVolume);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const v = getVolumeFromEvent(e);
      if (v !== null) handleMove(v);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const v = getVolumeFromEvent(e);
      if (v !== null) handleMove(v);
    };

    const handleEnd = () => {
      setIsDragging(false);
      onVolumeChangeCommit(localVolumeRef.current);
      track("change_volume", { volume_level: localVolumeRef.current });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
    // handleMove captures isVideoMuted/setIsVideoMuted from closure — listing the
    // dependencies would cause the effect to re-register on every mute toggle while
    // dragging. Safe to omit here since isDragging gates the entire effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, onVolumeChangeCommit]);

  return (
    <div className="flex flex-col items-center justify-between py-2 px-2 border border-[#2a1316]/50 bg-black/60 rounded gap-3 w-10 shrink-0">
      {/* Mute/Unmute Toggle */}
      <button
        onClick={() => {
          const nextMute = !isVideoMuted;
          setIsVideoMuted(nextMute);
          track("click_video_mute_toggle", { muted: nextMute });
        }}
        className="bg-black/90 hover:bg-theme-accent text-white border border-[#3e1d21] p-1.5 rounded-full transition-all duration-300 active:scale-95 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent"
        aria-label={isVideoMuted ? "Unmute" : "Mute"}
      >
        {isVideoMuted ? (
          <VolumeX size={12} className="text-theme-accent" />
        ) : (
          <Volume2 size={12} />
        )}
      </button>

      {/* Vertical Volume Slider */}
      <div
        ref={volumeBarRef}
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(displayVolume * 100)}
        tabIndex={0}
        onClick={handleVolumeClick}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleVolumeClick(e);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleVolumeClick(e);
        }}
        onKeyDown={(e) => {
          const step = 0.05; // 5%
          if (e.key === "ArrowUp" || e.key === "ArrowRight") {
            e.preventDefault();
            const newVolume = Math.min(1, displayVolume + step);
            handleMove(newVolume);
            onVolumeChangeCommit(newVolume);
          } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
            e.preventDefault();
            const newVolume = Math.max(0, displayVolume - step);
            handleMove(newVolume);
            onVolumeChangeCommit(newVolume);
          }
        }}
        className="flex-1 w-full flex items-center justify-center cursor-pointer relative py-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-accent focus-visible:rounded"
      >
        {/* Track Background */}
        <div className="w-1 h-full bg-[#1a0e10] rounded-full relative flex flex-col justify-end">
          {/* Active Fill Track */}
          <div
            className="w-full bg-theme-accent rounded-full relative"
            style={{ height: `${displayVolume * 100}%` }}
          >
            {/* Glow Handle/Thumb */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-theme-accent border border-white/20 rounded-full shadow-[0_0_8px_var(--theme-color)] hover:scale-125 transition-transform duration-100" />
          </div>
        </div>
      </div>

      {/* Volume Label */}
      <span className="text-[7px] text-zinc-500 font-mono text-center shrink-0">
        {Math.round(displayVolume * 100)}%
      </span>
    </div>
  );
}
