"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Pause, SkipForward, SkipBack, Disc, Headphones, Radio, Volume2, VolumeX } from "lucide-react";
import { track } from "@vercel/analytics";

// --- Types ---
interface Track {
  id: string;
  title: string;
  feature?: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId: string;
  videoBadge: string;
}

const TRACKS: Track[] = [
  {
    id: "primityva",
    title: "Primityva",
    album: "Primityva (2026)",
    coverUrl: "/songs/primityva cover v2 jpeg.jpg",
    audioUrl: "/songs/primityva v2.wav",
    duration: "2:50",
    spotifyUrl: "https://open.spotify.com/track/0nfluE2XHeBqu0bX7AcrUh?si=30f34425ced64c95",
    appleMusicUrl: "https://music.apple.com/lt/album/primityva/6769248612?i=6769248795",
    youtubeUrl: "https://www.youtube.com/watch?v=nNoiPOPh9j8",
    youtubeVideoId: "nNoiPOPh9j8",
    videoBadge: "Official Visualizer"
  },
  {
    id: "nebeskambink",
    title: "Nebeskambink",
    feature: "feat. Obsalon",
    album: "Nebeskambink (2025)",
    coverUrl: "/songs/nebeskambink cover.jpg",
    audioUrl: "/songs/nebeskambink final .wav",
    duration: "2:40",
    spotifyUrl: "https://open.spotify.com/track/2ljYOhOpy6TTgy2UFxZKRN?si=3bf9a6c9cca84fbf",
    appleMusicUrl: "https://music.apple.com/us/album/nebeskambink/1810770309?i=1810770311",
    youtubeUrl: "https://www.youtube.com/watch?v=aX0aSpsqEy8",
    youtubeVideoId: "aX0aSpsqEy8",
    videoBadge: "Official Music Video"
  },
  {
    id: "apakau",
    title: "apakau",
    feature: "feat. Atikin",
    album: "apakau x perfect (2024)",
    coverUrl: "/songs/apakau (feat Atikin) x perfect.jpg",
    audioUrl: "/songs/apakau feat atikin.wav",
    duration: "2:15",
    spotifyUrl: "https://open.spotify.com/track/1wlbcOYoSttIjHBcZr7NUB?si=15692867df4a4cc3",
    appleMusicUrl: "https://music.apple.com/us/album/apakau/1804514772?i=1804514773",
    youtubeUrl: "https://www.youtube.com/watch?v=FRqvZ1aif4c",
    youtubeVideoId: "FRqvZ1aif4c",
    videoBadge: "Official Visualizer"
  },
  {
    id: "perfect",
    title: "perfect",
    album: "perfect v4 (2024)",
    coverUrl: "/songs/apakau (feat Atikin) x perfect.jpg",
    audioUrl: "/songs/perfect v4_Master.wav",
    duration: "3:05",
    spotifyUrl: "https://open.spotify.com/track/5P1zA17VR4tA3i98aOuBRK?si=dab4151a0b794fd9",
    appleMusicUrl: "https://music.apple.com/us/album/perfect/1804514772?i=1804514778",
    youtubeUrl: "https://www.youtube.com/watch?v=fAP2UOOGTn4",
    youtubeVideoId: "fAP2UOOGTn4",
    videoBadge: "Official Visualizer"
  },
  {
    id: "dejavu",
    title: "deja vu",
    album: "22:22 (2023)",
    coverUrl: "/songs/deja vu.jpg",
    audioUrl: "/songs/deja vu.wav",
    duration: "2:09",
    spotifyUrl: "https://open.spotify.com/track/6RMZ738QXWNQ2Jh4QjFk2h?si=c39efe8e9c5443e9",
    appleMusicUrl: "https://music.apple.com/lt/album/deja-vu/1804513622?i=1804513630",
    youtubeUrl: "https://www.youtube.com/watch?v=TPwBpsgxirc",
    youtubeVideoId: "TPwBpsgxirc",
    videoBadge: "Official Music Video"
  }
];

const PLATFORMS = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/33z8eBD0nviVNHjKoe6kZZ?si=KBRyTTXrQoSX06e2hIlyxw",
    badge: "103_listeners/mo",
    color: "hover:bg-[#1db954]/10 hover:border-[#1db954] hover:text-[#1db954]",
    accent: "#1db954"
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com/us/artist/digit/1524901037",
    badge: "official_artist",
    color: "hover:bg-[#fc3c44]/10 hover:border-[#fc3c44] hover:text-[#fc3c44]",
    accent: "#fc3c44"
  },
  {
    name: "YouTube Channel",
    url: "https://www.youtube.com/@05digit",
    badge: "music_videos",
    color: "hover:bg-[#ff0000]/10 hover:border-[#ff0000] hover:text-[#ff0000]",
    accent: "#ff0000"
  },
  {
    name: "YouTube Music",
    url: "https://music.youtube.com/@05digit",
    badge: "albums_singles",
    color: "hover:bg-[#ff003c]/10 hover:border-[#ff003c] hover:text-[#ff003c]",
    accent: "#ff003c"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/05digit/",
    badge: "@05digit",
    color: "hover:bg-[#e1306c]/10 hover:border-[#e1306c] hover:text-[#e1306c]",
    accent: "#e1306c"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@05digit",
    badge: "@05digit",
    color: "hover:bg-[#00f2fe]/10 hover:border-[#00f2fe] hover:text-[#00f2fe]",
    accent: "#00f2fe"
  }
];

interface VideoClip {
  id: string;
  title: string;
  feature?: string;
  badge: string;
}

const VIDEO_CLIPS: VideoClip[] = [
  {
    id: "F4NdmdLr7_w",
    title: "Digit",
    badge: "Official Artist Trailer"
  },
  {
    id: "nNoiPOPh9j8",
    title: "Primityva",
    badge: "Official Visualizer"
  },
  {
    id: "aX0aSpsqEy8",
    title: "Nebeskambink",
    feature: "feat. Obsalon",
    badge: "Official Music Video"
  },
  {
    id: "FRqvZ1aif4c",
    title: "apakau",
    feature: "feat. Atikin",
    badge: "Official Visualizer"
  },
  {
    id: "fAP2UOOGTn4",
    title: "perfect",
    badge: "Official Visualizer"
  },
  {
    id: "TPwBpsgxirc",
    title: "deja vu",
    badge: "Official Music Video"
  }
];

export default function Home() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [isTrailerActive, setIsTrailerActive] = useState<boolean>(false);
  const [visualizerMode, setVisualizerMode] = useState<"bars" | "wave">("bars");
  const [volume, setVolume] = useState<number>(0.8);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const ytPlayerRef = useRef<any>(null);

  const isPlayingRef = useRef<boolean>(false);
  const visualizerModeRef = useRef<"bars" | "wave">("bars");
  const volumeRef = useRef<number>(0.8);
  const currentTrackIndexRef = useRef<number>(0);

  // Sync refs with React state to prevent stale closure bugs in visualizer / player events
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    visualizerModeRef.current = visualizerMode;
  }, [visualizerMode]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  // Session duration tracking / milestones
  useEffect(() => {
    const startTime = Date.now();
    const milestones = [15, 30, 60, 120, 300, 600, 1200, 1800];
    const timers: NodeJS.Timeout[] = [];

    milestones.forEach((seconds) => {
      const t = setTimeout(() => {
        track("session_duration_milestone", {
          duration_seconds: seconds,
          duration_formatted: seconds >= 60 ? `${seconds / 60}m` : `${seconds}s`
        });
      }, seconds * 1000);
      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
      const totalElapsedSeconds = Math.round((Date.now() - startTime) / 1000);
      if (totalElapsedSeconds > 2) {
        track("session_end", { total_seconds: totalElapsedSeconds });
      }
    };
  }, []);

  const activeTrack = TRACKS[currentTrackIndex];

  // Helper to skip track automatically on end
  const autoSkipNext = () => {
    const nextIndex = (currentTrackIndexRef.current + 1) % TRACKS.length;
    selectTrack(nextIndex);
  };

  // Initialize YouTube API Player
  const initYoutubePlayer = () => {
    const container = document.getElementById("yt-player");
    if (!container || ytPlayerRef.current) return;

    ytPlayerRef.current = new (window as any).YT.Player("yt-player", {
      videoId: isTrailerActive ? "F4NdmdLr7_w" : TRACKS[currentTrackIndex].youtubeVideoId,
      playerVars: {
        autoplay: 0,
        controls: 1, // Native YouTube player controls visible
        rel: 0,
        modestbranding: 1,
        mute: isVideoMuted ? 1 : 0,
      },
      events: {
        onReady: (event: any) => {
          event.target.setVolume(volumeRef.current * 100);
        },
        onStateChange: (event: any) => {
          const playerState = event.data;
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
          if (playerState === 1) {
            setIsPlaying(true);
          } else if (playerState === 2 || playerState === 0) {
            setIsPlaying(false);
          }

          if (playerState === 0 && !isTrailerActive) {
            autoSkipNext();
          }
        }
      }
    });
  };

  // Poll current video play time and duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        if (ytPlayerRef.current && ytPlayerRef.current.getCurrentTime) {
          try {
            setCurrentTime(ytPlayerRef.current.getCurrentTime() || 0);
            setDuration(ytPlayerRef.current.getDuration() || 0);
          } catch (e) {}
        }
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sync volume state with YT player
  useEffect(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      try {
        ytPlayerRef.current.setVolume(volume * 100);
        if (volume === 0) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
        }
      } catch (e) {}
    }
  }, [volume]);

  // Sync mute state with YT player
  useEffect(() => {
    if (ytPlayerRef.current && ytPlayerRef.current.mute) {
      try {
        if (isVideoMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
        }
      } catch (e) {}
    }
  }, [isVideoMuted]);

  // Controls Handlers
  const handlePlayPause = () => {
    if (!ytPlayerRef.current) return;
    try {
      const playerState = ytPlayerRef.current.getPlayerState ? ytPlayerRef.current.getPlayerState() : -1;
      if (playerState === 1) {
        ytPlayerRef.current.pauseVideo();
        setIsPlaying(false);
        track("audio_pause", { track_title: activeTrack.title });
      } else {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        track("audio_play", { track_title: activeTrack.title });
      }
    } catch (e) {}
  };

  const handleNext = () => {
    setIsTrailerActive(false);
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    selectTrack(nextIndex);
    track("skip_next", { track_title: TRACKS[nextIndex].title });
  };

  const handlePrev = () => {
    setIsTrailerActive(false);
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    selectTrack(prevIndex);
    track("skip_prev", { track_title: TRACKS[prevIndex].title });
  };

  const selectTrack = (index: number) => {
    setIsTrailerActive(false);
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    track("select_track", { track_title: TRACKS[index].title });

    if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
      try {
        ytPlayerRef.current.loadVideoById({
          videoId: TRACKS[index].youtubeVideoId,
          startSeconds: 0
        });
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {}
    }
  };

  const handleToggleTrailer = () => {
    track("click_trailer_toggle", { current_state: isTrailerActive });
    if (!ytPlayerRef.current || !ytPlayerRef.current.loadVideoById) return;

    try {
      if (!isTrailerActive) {
        setIsTrailerActive(true);
        ytPlayerRef.current.loadVideoById({
          videoId: "F4NdmdLr7_w",
          startSeconds: 0
        });
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } else {
        setIsTrailerActive(false);
        ytPlayerRef.current.loadVideoById({
          videoId: activeTrack.youtubeVideoId,
          startSeconds: 0
        });
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {}
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scrubTime = parseFloat(e.target.value);
    setCurrentTime(scrubTime);
    if (ytPlayerRef.current && ytPlayerRef.current.seekTo) {
      try {
        ytPlayerRef.current.seekTo(scrubTime, true);
      } catch (e) {}
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Canvas visualizer loop (Red spotlight theme - procedural audio simulation)
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid line effects
      ctx.strokeStyle = "#1a0808";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      // Procedural visualizer data simulation
      if (isPlayingRef.current) {
        const time = Date.now() * 0.008;
        const vol = volumeRef.current;
        if (visualizerModeRef.current === "bars") {
          for (let i = 0; i < bufferLength; i++) {
            const noise = Math.sin(i * 0.35 + time * 1.6) * Math.cos(i * 0.07 - time * 0.8);
            const peak = Math.sin(time * (0.9 + (i % 4) * 0.12)) > 0.6 ? 1.7 : 0.75;
            const amp = Math.max(8, (55 + noise * 40) * peak * vol);
            dataArray[i] = Math.min(255, amp + Math.random() * 6);
          }
        } else {
          for (let i = 0; i < bufferLength; i++) {
            const wave = Math.sin(i * 0.22 - time * 2.2) * Math.cos(i * 0.07 + time * 1.3);
            const peak = Math.sin(time * 1.4) > 0.45 ? 1.4 : 0.8;
            dataArray[i] = 128 + (wave * 42) * peak * vol + (Math.random() - 0.5) * 3;
          }
        }
      } else {
        // Idle pulsing
        const time = Date.now() * 0.004;
        if (visualizerModeRef.current === "bars") {
          for (let i = 0; i < bufferLength; i++) {
            dataArray[i] = Math.max(0, Math.sin(i * 0.15 + time) * 14 + 10 + Math.random() * 2);
          }
        } else {
          for (let i = 0; i < bufferLength; i++) {
            dataArray[i] = 128 + Math.sin(i * 0.2 + time) * 8 + Math.random() * 1;
          }
        }
      }

      if (visualizerModeRef.current === "bars") {
        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height * 0.85;

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, "#2c0006");
          gradient.addColorStop(0.5, "#8a0014");
          gradient.addColorStop(1, "#ff0022");

          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
          
          if (barHeight > 3) {
            ctx.fillStyle = "#ff0022";
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#ff0022";
            ctx.fillRect(x, height - barHeight - 1.5, barWidth - 2, 1.5);
            ctx.shadowBlur = 0;
          }

          x += barWidth;
        }
      } else {
        // Oscilloscope Mode
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "#ff0022";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ff0022";

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    render();
  };

  useEffect(() => {
    // 1. Define callback globally
    (window as any).onYouTubeIframeAPIReady = () => {
      initYoutubePlayer();
    };

    // 2. Load YouTube API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // 3. Start visualizer
    startVisualizer();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] font-mono selection:bg-[#ff003c] selection:text-[#050505] overflow-x-hidden">
      {/* Glitch CRT Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_20%,rgba(0,0,0,0.65)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]" />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#160a0b] px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Status Label */}
        <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono tracking-widest sm:w-1/4 justify-center sm:justify-start">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff003c] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff003c]" />
          </span>
          <span>05_ONLINE</span>
        </div>

        {/* Centered Logo */}
        <div className="flex justify-center items-center sm:w-2/4">
          <span className="text-3xl md:text-4xl font-normal text-[#f5f5f5] font-sidewalk tracking-widest lowercase hover:text-[#ff003c] transition-colors duration-300 cursor-pointer translate-y-[3px] md:translate-y-[4px]">
            digit
          </span>
        </div>

        {/* Right Social Redirect Matrix (Vibrant / Clean) */}
        <div className="flex items-center justify-center sm:justify-end gap-5 text-[10px] md:text-xs font-mono font-bold tracking-widest text-zinc-400 sm:w-1/4">
          <a 
            href="https://open.spotify.com/artist/33z8eBD0nviVNHjKoe6kZZ?si=KBRyTTXrQoSX06e2hIlyxw" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => track("click_header_spotify")}
            className="hover:text-[#1db954] hover:border-[#1db954] transition-all duration-300 pb-0.5 border-b border-solid border-transparent"
          >
            SPOTIFY
          </a>
          <a 
            href="https://music.apple.com/us/artist/digit/1524901037" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => track("click_header_apple")}
            className="hover:text-[#fc3c44] hover:border-[#fc3c44] transition-all duration-300 pb-0.5 border-b border-solid border-transparent"
          >
            APPLE
          </a>
          <a 
            href="https://www.youtube.com/@05digit" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => track("click_header_youtube")}
            className="hover:text-[#ff0000] hover:border-[#ff0000] transition-all duration-300 pb-0.5 border-b border-solid border-transparent"
          >
            YOUTUBE
          </a>
          <a 
            href="https://www.instagram.com/05digit/" 
            target="_blank" 
            rel="noreferrer" 
            onClick={() => track("click_header_instagram")}
            className="hover:text-[#e1306c] hover:border-[#e1306c] transition-all duration-300 pb-0.5 border-b border-solid border-transparent"
          >
            INSTAGRAM
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* --- MULTIMEDIA TRANSMISSION HUB // CONSOLE --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 items-start">
          
          {/* COLUMN 1: LEFT PANEL (lg:col-span-3) - Cover art, Visualizer & Big Streaming Buttons */}
          <div className="lg:col-span-3 border border-[#221012] bg-[#0a0505] p-4 rounded-lg flex flex-col gap-4 relative">
            
            {/* Cover Display */}
            <div className="relative aspect-square w-full rounded border border-[#2a1316] overflow-hidden group shadow-[0_0_20px_rgba(255,0,60,0.12)]">
              <Image
                src={activeTrack.coverUrl}
                alt={activeTrack.title}
                fill
                priority
                className={`object-cover transition-transform duration-700 filter saturate-60 group-hover:saturate-100 ${isPlaying ? "scale-105" : "scale-100"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent" />
              
              <div className="absolute bottom-3 left-3">
                <h3 className="text-xl font-normal text-white font-sidewalk tracking-wide">{activeTrack.title}</h3>
                {activeTrack.feature && (
                  <p className="text-[9px] text-zinc-400 font-mono tracking-widest mt-0.5 uppercase">{activeTrack.feature}</p>
                )}
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">{activeTrack.album}</p>
              </div>
            </div>

            {/* Real Audio visualizer canvas */}
            <div className="border border-[#2a1316] rounded bg-[#050505] p-2 relative group">
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={55} 
                className="w-full h-[55px] block opacity-95"
              />
              <div className="absolute top-1.5 left-2.5 text-[7px] text-zinc-600 uppercase tracking-widest font-mono">
                visualizer // {visualizerMode}
              </div>
              <button 
                onClick={() => setVisualizerMode(visualizerMode === "bars" ? "wave" : "bars")}
                className="absolute top-1.5 right-2.5 text-[7px] text-zinc-500 hover:text-[#ff003c] border border-zinc-800 hover:border-[#ff003c] bg-black/60 px-1.5 py-0.5 rounded transition-all uppercase tracking-wider cursor-pointer font-mono"
              >
                mode
              </button>
            </div>

            {/* Song Links in Bigger Colors */}
            <div className="space-y-1.5">
              <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-mono">// STREAM THIS TRACK</span>
              <div className="grid grid-cols-3 gap-2">
                {activeTrack.spotifyUrl ? (
                  <a
                    href={activeTrack.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("click_track_spotify", { track_title: activeTrack.title })}
                    className="flex flex-col items-center justify-center py-2 rounded border border-[#1db954]/30 bg-[#1db954]/5 text-[#1db954] hover:bg-[#1db954]/10 hover:border-[#1db954] transition-all duration-300 font-mono text-[9px] font-bold tracking-widest text-center"
                  >
                    <span>SPOTIFY</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center py-2 rounded border border-zinc-900 bg-zinc-950/20 text-zinc-700 font-mono text-[9px] select-none text-center">
                    N/A
                  </div>
                )}

                {activeTrack.appleMusicUrl ? (
                  <a
                    href={activeTrack.appleMusicUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("click_track_apple", { track_title: activeTrack.title })}
                    className="flex flex-col items-center justify-center py-2 rounded border border-[#fc3c44]/30 bg-[#fc3c44]/5 text-[#fc3c44] hover:bg-[#fc3c44]/10 hover:border-[#fc3c44] transition-all duration-300 font-mono text-[9px] font-bold tracking-widest text-center"
                  >
                    <span>APPLE</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center py-2 rounded border border-zinc-900 bg-zinc-950/20 text-zinc-700 font-mono text-[9px] select-none text-center">
                    N/A
                  </div>
                )}

                {activeTrack.youtubeUrl ? (
                  <a
                    href={activeTrack.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("click_track_youtube", { track_title: activeTrack.title })}
                    className="flex flex-col items-center justify-center py-2 rounded border border-[#ff0000]/30 bg-[#ff0000]/5 text-[#ff0000] hover:bg-[#ff0000]/10 hover:border-[#ff0000] transition-all duration-300 font-mono text-[9px] font-bold tracking-widest text-center"
                  >
                    <span>YOUTUBE</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center py-2 rounded border border-zinc-900 bg-zinc-950/20 text-zinc-700 font-mono text-[9px] select-none text-center">
                    N/A
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* COLUMN 2: MIDDLE PANEL (lg:col-span-6) - YouTube Video Player & Bottom Controls */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Unified Video Box */}
            <div className="border border-[#281517] bg-[#0c0707] p-1.5 rounded-lg relative overflow-hidden group">
              {/* Target div for YouTube player loading */}
              <div className="relative aspect-video w-full rounded overflow-hidden bg-black/80 border border-[#1b0d0e]">
                <div id="yt-player" className="w-full h-full border-0 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                
                {/* Visual Video Shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-90 pointer-events-none" />

                {/* Trailer Switcher Overlay (Top Left) */}
                <div className="absolute top-3 left-3 z-20">
                  <button
                    onClick={handleToggleTrailer}
                    className={`px-2.5 py-1 rounded text-[7px] font-mono font-bold tracking-widest border transition-all duration-300 active:scale-95 cursor-pointer ${
                      isTrailerActive
                        ? "bg-[#ff003c] text-black border-[#ff003c] shadow-[0_0_8px_#ff003c]"
                        : "bg-black/85 text-zinc-400 border-zinc-800 hover:border-[#ff003c] hover:text-white"
                    }`}
                  >
                    {isTrailerActive ? "SHOW TRACK VIDEO" : "WATCH TRAILER"}
                  </button>
                </div>

                {/* Mute button overlay (Top Right) */}
                <div className="absolute top-3 right-3 z-20">
                  <button
                    onClick={() => {
                      setIsVideoMuted(!isVideoMuted);
                      track("click_video_mute_toggle", { muted: !isVideoMuted });
                    }}
                    className="bg-black/85 hover:bg-[#ff003c] text-white border border-[#3e1d21] p-1 rounded-full transition-all duration-300 active:scale-95 cursor-pointer"
                    aria-label="Mute Toggle"
                  >
                    {isVideoMuted ? <VolumeX size={12} className="text-[#ff003c]" /> : <Volume2 size={12} />}
                  </button>
                </div>

              </div>
            </div>

            {/* Player controls */}
            <div className="border border-[#221012] bg-[#0a0505] p-4 rounded-lg flex flex-col gap-3">
              
              {/* Current Track Readout (Title removed from video and integrated here) */}
              <div className="flex flex-col gap-0.5 border-b border-[#1b0d0e] pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] text-[#ff003c] font-mono tracking-widest uppercase">// NOW TRANSMITTING</span>
                  <span className="h-[1px] w-4 bg-[#2a1316]" />
                  <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase">{isTrailerActive ? "OFFICIAL TRAILER" : activeTrack.videoBadge}</span>
                </div>
                <h2 className="text-xl font-normal text-white uppercase font-sidewalk tracking-wide mt-0.5">
                  {isTrailerActive ? "Digit" : activeTrack.title}
                  {!isTrailerActive && activeTrack.feature && (
                    <span className="text-xs text-zinc-500 font-mono tracking-wider uppercase ml-2">
                      {activeTrack.feature}
                    </span>
                  )}
                </h2>
              </div>

              {/* Playback Controls Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                
                {/* Core Player Buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrev}
                    className="p-1.5 border border-[#3e1d21] hover:border-[#ff003c] hover:text-[#ff003c] rounded text-white bg-black/40 transition-all active:scale-95 cursor-pointer"
                  >
                    <SkipBack size={12} />
                  </button>

                  <button 
                    onClick={handlePlayPause}
                    className="px-5 py-1.5 bg-[#ff003c] hover:bg-[#ff1e51] text-black rounded font-bold text-[8px] uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(255,0,60,0.35)] cursor-pointer"
                  >
                    {isPlaying ? "PAUSE" : "PLAY"}
                  </button>

                  <button 
                    onClick={handleNext}
                    className="p-1.5 border border-[#3e1d21] hover:border-[#ff003c] hover:text-[#ff003c] rounded text-white bg-black/40 transition-all active:scale-95 cursor-pointer"
                  >
                    <SkipForward size={12} />
                  </button>
                </div>

                {/* Volume Slider Control */}
                <div className="flex items-center gap-2 bg-[#0c0707] border border-[#1c0f10] px-2.5 py-1.5 rounded w-full sm:w-auto justify-center sm:justify-start">
                  <button
                    onClick={() => {
                      const nextVolume = volume === 0 ? 0.8 : 0;
                      setVolume(nextVolume);
                      track("click_volume_toggle", { muted: nextVolume === 0 });
                    }}
                    className="text-zinc-500 hover:text-[#ff003c] transition-colors shrink-0 active:scale-95 cursor-pointer"
                    aria-label="Volume Toggle"
                  >
                    {volume === 0 ? <VolumeX size={11} className="text-[#ff003c]" /> : <Volume2 size={11} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    onMouseUp={() => track("change_volume", { volume_level: volume })}
                    onTouchEnd={() => track("change_volume", { volume_level: volume })}
                    className="w-16 h-1 bg-[#1a0e10] rounded-lg appearance-none cursor-pointer accent-[#ff003c] focus:outline-none"
                  />
                  <span className="text-[8px] text-zinc-500 font-mono w-5 text-right shrink-0">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

              </div>

              {/* Progress Scrub Slider */}
              <div className="space-y-0.5">
                <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleScrub}
                  className="w-full h-1 bg-[#1a0e10] rounded-lg appearance-none cursor-pointer accent-[#ff003c] focus:outline-none"
                />
              </div>

            </div>

          </div>

          {/* COLUMN 3: RIGHT PANEL (lg:col-span-3) - Interactive Tracklist */}
          <div className="lg:col-span-3 border border-[#221012] bg-[#0a0505] p-4 rounded-lg flex flex-col h-full self-stretch">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-3 font-sans">// TRACKLIST TRANSMISSION</span>
            <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[350px] lg:max-h-none pr-1">
              {TRACKS.map((t, index) => {
                const isActive = currentTrackIndex === index && !isTrailerActive;
                return (
                  <div
                    key={t.id}
                    onClick={() => selectTrack(index)}
                    className={`w-full flex flex-col p-2.5 rounded transition-all text-left cursor-pointer border ${
                      isActive 
                        ? "bg-[#ff003c]/10 border-[#ff003c]/30 text-white" 
                        : "bg-black/30 border-[#1b0d0e] text-zinc-400 hover:border-[#3e1d21] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[8px] font-mono ${isActive ? "text-[#ff003c]" : "text-zinc-600"} shrink-0`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={`font-sidewalk text-sm tracking-wide truncate ${isActive ? "text-[#ff003c]" : "text-zinc-200"}`}>
                          {t.title}
                        </span>
                      </div>
                      
                      {isActive && isPlaying ? (
                        <div className="flex items-end gap-0.5 h-2 w-3.5 justify-end shrink-0">
                          <span className="w-0.5 h-full bg-[#ff003c] animate-[bounce_0.8s_infinite_-0.2s]" />
                          <span className="w-0.5 h-2/3 bg-[#ff003c] animate-[bounce_0.8s_infinite_-0.4s]" />
                          <span className="w-0.5 h-4/5 bg-[#ff003c] animate-[bounce_0.8s_infinite_0s]" />
                        </div>
                      ) : (
                        <span className="text-[8px] text-zinc-500 font-mono shrink-0">{t.duration}</span>
                      )}
                    </div>
                    
                    {t.feature && (
                      <div className="text-[8px] text-zinc-500 font-mono pl-4 mt-0.5 lowercase">
                        {t.feature}
                      </div>
                    )}
                    
                    <div className="text-[8px] text-zinc-600 font-sans tracking-wide pl-4 mt-0.5">
                      {t.album.includes("(") ? t.album.split("(")[0].trim() : t.album}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* --- BIO SECTION --- */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-[#1a1112] pt-12">
          {/* Bio Text (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[#ff003c] font-bold font-mono text-xs">// TRANSMISSION_BIO</span>
              <span className="h-[1px] w-12 bg-[#2a1316]" />
            </div>
            <h2 className="text-3xl font-normal tracking-widest text-[#f5f5f5] font-sidewalk uppercase">
              about digit
            </h2>
            <div className="space-y-4 text-sm text-zinc-400 font-sans leading-relaxed tracking-wide">
              <p>
                Digit is a self-made artist from Lithuania, known in the underground scene for blurring the lines between hyperpop, punk, trap, drum &amp; bass, jersey club, and whatever else he feels like. <span className="text-white font-bold font-mono">Unpredictability is the point.</span>
              </p>
              <p>
                Growing up in Lithuania, Digit came from a family of creatives — orchestral musicians, theater and film actors — which shaped an open-minded approach to sound from an early age. Since picking up production in 2020, his music has been in constant sonic evolution, never settling long enough for anyone to pin him down.
              </p>
            </div>
            {/* Quick Stats Panel */}
            <div className="grid grid-cols-3 gap-4 border border-[#221012] bg-[#0a0505] p-4 rounded text-center font-mono">
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">origin</div>
                <div className="text-xs text-white uppercase mt-0.5 font-bold">Lithuania</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">active since</div>
                <div className="text-xs text-white mt-0.5 font-bold">2020</div>
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase">genre</div>
                <div className="text-xs text-[#ff003c] mt-0.5 font-bold uppercase truncate">hip-hop / undefined</div>
              </div>
            </div>

            {/* Work With Me / Contact Button */}
            <div className="pt-2 flex justify-start">
              <a 
                href="mailto:thedigitalwrld@gmail.com"
                onClick={() => track("click_contact_email")}
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#3e1d21] hover:border-[#ff003c] text-white hover:text-white rounded bg-black/40 hover:bg-[#ff003c]/10 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)] font-mono"
              >
                <svg className="w-3.5 h-3.5 text-[#ff003c] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"></path>
                </svg>
                work with digit // contact
              </a>
            </div>
          </div>

          {/* Bio Photo Collage (5 Columns) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 relative h-[380px] sm:h-[450px]">
            {/* Photo 1 (Left Column - Spans full height - Portrait format fits profile.JPG perfectly) */}
            <div className="relative rounded overflow-hidden border border-zinc-900 hover:border-[#ff003c] transition-colors duration-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] filter grayscale hover:grayscale-0 transition-all duration-700 h-full">
              <Image
                src="/photos/profile.JPG"
                alt="Digit portrait profile"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>

            {/* Right Column Stack (Two shorter landscape slots fit red.JPG and hero2.jpg perfectly) */}
            <div className="flex flex-col gap-3 h-full">
              <div className="relative flex-1 rounded overflow-hidden border border-zinc-900 hover:border-[#ff003c] transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] filter grayscale hover:grayscale-0 transition-all duration-700">
                <Image
                  src="/photos/red.JPG"
                  alt="Digit red portrait landscape"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 15vw"
                />
              </div>
              <div className="relative flex-1 rounded overflow-hidden border border-zinc-900 hover:border-[#ff003c] transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.8)] filter grayscale hover:grayscale-0 transition-all duration-700">
                <Image
                  src="/photos/hero2.jpg"
                  alt="Digit live performance landscape"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 25vw, 15vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- CONNECT / FOOTER PLATFORMS --- */}
        <section className="mb-16 border-t border-[#1a1112] pt-12">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[#ff003c] font-bold font-mono text-xs">// PLATFORM_CONNECT_MATRIX</span>
            <span className="h-[1px] w-12 bg-[#2a1316]" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("click_platform_connect", { platform_name: platform.name })}
                className={`border border-[#1f0f11] bg-[#080404] p-5 rounded-lg flex flex-col justify-between transition-all duration-300 transform active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.8)] ${platform.color}`}
              >
                <div>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase block">{platform.badge}</span>
                  <h4 className="text-sm font-bold uppercase tracking-wider mt-1 font-mono">{platform.name}</h4>
                </div>
                <div className="flex justify-end mt-6">
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-[#1a1112] bg-[#050505] py-12 px-4 md:px-8 text-center text-[9px] text-zinc-600 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-6 uppercase tracking-wider font-sans font-bold">
            <a 
              href="https://instagram.com/05digit" 
              target="_blank" 
              rel="noreferrer" 
              onClick={() => track("click_footer_instagram")}
              className="hover:text-[#ff003c] transition-colors"
            >
              Instagram
            </a>
            <a 
              href="https://open.spotify.com/artist/33z8eBD0nviVNHjKoe6kZZ?si=KBRyTTXrQoSX06e2hIlyxw" 
              target="_blank" 
              rel="noreferrer" 
              onClick={() => track("click_footer_spotify")}
              className="hover:text-[#ff003c] transition-colors"
            >
              Spotify
            </a>
            <a 
              href="https://www.youtube.com/@05digit" 
              target="_blank" 
              rel="noreferrer" 
              onClick={() => track("click_footer_youtube")}
              className="hover:text-[#ff003c] transition-colors"
            >
              YouTube
            </a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Don't Got Time. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
