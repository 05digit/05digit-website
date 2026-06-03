import React, { useState, useEffect, useRef } from "react";
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
  ytPlayerRef
}: VolumeSliderProps) {
  const [localVolume, setLocalVolume] = useState<number>(initialVolume);
  const localVolumeRef = useRef<number>(initialVolume);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  // Sync with parent when not dragging (e.g. if unmuted by clicking play in parent)
  // Disable next line rule about using refs during render since initial sync is a special case
  // eslint-disable-next-line react-hooks/refs
  if (!isDragging && initialVolume !== localVolumeRef.current) {
    setLocalVolume(initialVolume);
    // eslint-disable-next-line react-hooks/refs
    localVolumeRef.current = initialVolume;
  }

  const applyVolumeToPlayer = (newVolume: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const player = ytPlayerRef.current as any;
    if (player && player.setVolume) {
      try {
        player.setVolume(newVolume * 100);
        if (newVolume === 0) {
          player.mute();
        } else {
          player.unMute();
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {}
    }
  };

  const handleMove = (clientY: number) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const percentage = 1 - (relativeY / rect.height);
    const newVolume = Math.max(0, Math.min(1, percentage));

    setLocalVolume(newVolume);
    applyVolumeToPlayer(newVolume);

    if (newVolume > 0 && isVideoMuted) {
      setIsVideoMuted(false);
    } else if (newVolume === 0 && !isVideoMuted) {
      setIsVideoMuted(true);
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    handleMove(clientY);

    // Calculate new volume to commit immediately on click
    const rect = volumeBarRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const percentage = 1 - (relativeY / rect.height);
    const newVolume = Math.max(0, Math.min(1, percentage));
    onVolumeChangeCommit(newVolume);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMoveEffect = (clientY: number) => {
      if (!volumeBarRef.current) return;
      const rect = volumeBarRef.current.getBoundingClientRect();
      const relativeY = clientY - rect.top;
      const percentage = 1 - (relativeY / rect.height);
      const newVolume = Math.max(0, Math.min(1, percentage));

      setLocalVolume(newVolume);
      localVolumeRef.current = newVolume;
      applyVolumeToPlayer(newVolume);

      if (newVolume > 0 && isVideoMuted) {
        setIsVideoMuted(false);
      } else if (newVolume === 0 && !isVideoMuted) {
        setIsVideoMuted(true);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMoveEffect(e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMoveEffect(e.touches[0].clientY);
      }
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, onVolumeChangeCommit, isVideoMuted, setIsVideoMuted]);

  return (
    <div className="flex flex-col items-center justify-between py-2 px-2 border border-[#2a1316]/50 bg-black/60 rounded gap-3 w-10 shrink-0">
      {/* Mute/Unmute Toggle */}
      <button
        onClick={() => {
          const nextMute = !isVideoMuted;
          setIsVideoMuted(nextMute);
          track("click_video_mute_toggle", { muted: nextMute });
        }}
        className="bg-black/90 hover:bg-[#ff003c] text-white border border-[#3e1d21] p-1.5 rounded-full transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
        aria-label="Mute Toggle"
      >
        {isVideoMuted ? <VolumeX size={12} className="text-[#ff003c]" /> : <Volume2 size={12} />}
      </button>

      {/* Vertical Volume Slider (Custom drag handler) */}
      <div
        ref={volumeBarRef}
        onClick={handleVolumeClick}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleVolumeClick(e);
        }}
        onTouchStart={(e) => {
          setIsDragging(true);
          handleVolumeClick(e);
        }}
        className="flex-1 w-full flex items-center justify-center cursor-pointer relative py-2 select-none"
      >
        {/* Track Background */}
        <div className="w-1 h-full bg-[#1a0e10] rounded-full relative flex flex-col justify-end">
          {/* Active Fill Track */}
          <div
            className="w-full bg-[#ff003c] rounded-full relative"
            style={{ height: `${localVolume * 100}%` }}
          >
            {/* Glow Handle/Thumb */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#ff003c] border border-white/20 rounded-full shadow-[0_0_8px_#ff003c] hover:scale-125 transition-transform duration-100" />
          </div>
        </div>
      </div>

      {/* Volume Label */}
      <span className="text-[7px] text-zinc-500 font-mono text-center shrink-0">
        {Math.round(localVolume * 100)}%
      </span>
    </div>
  );
}
