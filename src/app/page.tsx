"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Pause, SkipForward, SkipBack, Disc, Headphones, Radio, Volume2, VolumeX } from "lucide-react";

// --- Types ---
interface Track {
  id: string;
  title: string;
  album: string;
  coverUrl: string;
  audioUrl: string;
  duration: string;
  tempo: string; // BPM
  description: string;
  youtubeUrl?: string; // YouTube song links if available
}

const TRACKS: Track[] = [
  {
    id: "primityva",
    title: "Primityva",
    album: "Primityva (2026)",
    coverUrl: "/songs/primityva cover v2 jpeg.jpg",
    audioUrl: "/songs/primityva v2.wav",
    duration: "2:50",
    tempo: "140 BPM",
    description: "Lithuanian underground supertrap anthem. Blurring the lines between heavy digital slides and distorted sub frequencies.",
    youtubeUrl: "https://www.youtube.com/watch?v=F4NdmdLr7_w"
  },
  {
    id: "nebeskambink",
    title: "Nebeskambink",
    album: "Nebeskambink (2025)",
    coverUrl: "/songs/nebeskambink cover.jpg",
    audioUrl: "/songs/nebeskambink final .wav",
    duration: "2:40",
    tempo: "130 BPM",
    description: "Dark atmosphere pad textures mixed with rapid-fire hi-hat rolls. Collaboration with Obsalon.",
    youtubeUrl: "https://www.youtube.com/watch?v=aX0aSpsqEy8"
  },
  {
    id: "apakau",
    title: "apakau",
    album: "apakau x perfect (2024)",
    coverUrl: "/songs/apakau (feat Atikin) x perfect.jpg",
    audioUrl: "/songs/apakau feat atikin.wav",
    duration: "2:15",
    tempo: "150 BPM",
    description: "Feat. Atikin. Hyper-speed hat rolls, distorted slides and high-pitch synth bells.",
    youtubeUrl: "https://www.youtube.com/watch?v=FRqvZ1aif4c"
  },
  {
    id: "perfect",
    title: "perfect",
    album: "perfect v4 (2024)",
    coverUrl: "/songs/apakau (feat Atikin) x perfect.jpg",
    audioUrl: "/songs/perfect v4_Master.wav",
    duration: "3:05",
    tempo: "145 BPM",
    description: "Industrial darkwave bass fused with glitchy snare structures and atmospheric pads.",
    youtubeUrl: "https://www.youtube.com/watch?v=fAP2UOOGTn4"
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
  badge: string;
}

const VIDEO_CLIPS: VideoClip[] = [
  {
    id: "F4NdmdLr7_w",
    title: "Primityva",
    badge: "OFFICIAL VISUALIZER"
  },
  {
    id: "aX0aSpsqEy8",
    title: "Nebeskambink",
    badge: "OFFICIAL MUSIC VIDEO"
  },
  {
    id: "FRqvZ1aif4c",
    title: "apakau",
    badge: "OFFICIAL VISUALIZER"
  },
  {
    id: "fAP2UOOGTn4",
    title: "perfect",
    badge: "OFFICIAL VISUALIZER"
  }
];

export default function Home() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const activeVideoClip = VIDEO_CLIPS[activeVideoIndex];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeTrack = TRACKS[currentTrackIndex];

  // Initialize Web Audio context from user interaction
  const initAudioContext = () => {
    if (audioContextRef.current) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyserRef.current = analyser;

    if (audioRef.current) {
      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;
      source.connect(analyser);
      analyser.connect(ctx.destination);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    initAudioContext();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Resume AudioContext if suspended (browser security)
      if (audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        startVisualizer();
      }).catch(err => {
        console.error("Playback failed", err);
      });
    }
  };

  const handleNext = () => {
    const wasPlaying = isPlaying;
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(false);

    if (wasPlaying && audioRef.current) {
      // Small timeout to let source switch src cleanly
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            startVisualizer();
          });
        }
      }, 100);
    }
  };

  const handlePrev = () => {
    const wasPlaying = isPlaying;
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    setIsPlaying(false);

    if (wasPlaying && audioRef.current) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            startVisualizer();
          });
        }
      }, 100);
    }
  };

  const selectTrack = (index: number) => {
    const wasPlaying = isPlaying;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(false);

    if (wasPlaying && audioRef.current) {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.load();
          audioRef.current.play().then(() => {
            setIsPlaying(true);
            startVisualizer();
          });
        }
      }, 100);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const scrubTime = parseFloat(e.target.value);
      audioRef.current.currentTime = scrubTime;
      setCurrentTime(scrubTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Canvas visualizer loop (Red spotlight theme)
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
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

      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Idle pulsing
        const time = Date.now() * 0.004;
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.max(0, Math.sin(i * 0.15 + time) * 20 + 10 + Math.random() * 5);
        }
      }

      const barWidth = (width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height * 0.85;

        // Visualizer color: Red glow
        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, "#2c0006");
        gradient.addColorStop(0.5, "#8a0014");
        gradient.addColorStop(1, "#ff0022");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
        
        // Neon red tip indicator
        if (barHeight > 3) {
          ctx.fillStyle = "#ff0022";
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#ff0022";
          ctx.fillRect(x, height - barHeight - 1.5, barWidth - 2, 1.5);
          ctx.shadowBlur = 0;
        }

        x += barWidth;
      }
    };

    render();
  };

  useEffect(() => {
    startVisualizer();
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f5f5f5] font-mono selection:bg-[#ff003c] selection:text-[#050505] overflow-x-hidden">
      {/* Glitch CRT Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_20%,rgba(0,0,0,0.65)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]" />

      {/* HTML5 Audio Node */}
      <audio
        ref={audioRef}
        src={activeTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#181212] px-4 md:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff003c] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff003c]" />
          </div>
          <span className="text-3xl font-normal text-[#f5f5f5] font-sidewalk tracking-widest lowercase hover:text-[#ff003c] transition-colors duration-300">
            digit
          </span>
        </div>

        {/* Header Social Badges */}
        <div className="flex items-center gap-4 text-zinc-400">
          <a 
            href="https://open.spotify.com/artist/33z8eBD0nviVNHjKoe6kZZ?si=KBRyTTXrQoSX06e2hIlyxw" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white transition-colors"
          >
            <span className="text-[10px] tracking-widest font-bold font-sans">SPOTIFY</span>
          </a>
          <a 
            href="https://music.apple.com/us/artist/digit/1524901037" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white transition-colors"
          >
            <span className="text-[10px] tracking-widest font-bold font-sans">APPLE</span>
          </a>
          <a 
            href="https://www.youtube.com/@05digit" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-[#ff003c] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
          </a>
          <a 
            href="https://www.instagram.com/05digit/" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-[#ff003c] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {/* --- HERO VIDEO BLOCK --- */}
        <section className="mb-12">
          <div className="border border-[#281517] bg-[#0c0707] p-1.5 rounded-lg relative overflow-hidden group">
            {/* Accents */}
            <div className="absolute top-3 left-4 text-[9px] text-zinc-500 font-mono tracking-widest">
              [ TRANSMISSION_05D_ACTIVE ]
            </div>
            <div className="absolute top-3 right-4 text-[9px] text-[#ff003c] font-mono tracking-widest uppercase flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff003c] animate-pulse" />
              DIGIT_VISUALIZER.MP4
            </div>

            {/* Video Box */}
            <div className="relative aspect-video w-full rounded overflow-hidden bg-black/80 border border-[#1b0d0e]">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoClip.id}?autoplay=1&mute=${isVideoMuted ? 1 : 0}&loop=1&playlist=${activeVideoClip.id}&controls=1&rel=0&modestbranding=1`}
                title={activeVideoClip.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 pointer-events-none" />

              {/* Title Overlay in Pretty Sidewalk Font */}
              <div className="absolute bottom-6 left-6 md:left-8 pointer-events-none select-none z-10">
                <span className="text-[10px] text-[#ff003c] tracking-[0.35em] uppercase font-bold block mb-2 font-sans">
                  {activeVideoClip.badge}
                </span>
                <h1 className="text-4xl md:text-7xl font-normal text-white uppercase font-sidewalk tracking-wide leading-none">
                  {activeVideoClip.title}
                </h1>
              </div>

              {/* Video control toggles */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 z-10">
                <button
                  onClick={() => {
                    setActiveVideoIndex((prev) => (prev + 1) % VIDEO_CLIPS.length);
                  }}
                  className="bg-black/85 hover:bg-[#ff003c]/20 border border-[#3e1d21] hover:border-[#ff003c] text-white text-[9px] font-bold px-3 py-1.5 rounded tracking-widest uppercase transition-all duration-300 active:scale-95"
                >
                  SWITCH CLIP
                </button>
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className="bg-black/85 hover:bg-[#ff003c] text-white border border-[#3e1d21] p-1.5 rounded-full transition-all duration-300 active:scale-95"
                >
                  {isVideoMuted ? <VolumeX size={14} className="text-[#ff003c]" /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- MUSIC & REAL AUDIO PLAYBACK HUB --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Cover Display Panel (5 Cols) */}
          <div className="lg:col-span-5 border border-[#221012] bg-[#0a0505] p-5 rounded-lg flex flex-col gap-4 relative">
            <div className="absolute top-2 right-4 text-[9px] text-zinc-600">
              AUDIO_SOURCE // STAGE_1
            </div>

            {/* Release Cover Display */}
            <div className="relative aspect-square w-full rounded border border-[#2a1316] overflow-hidden group shadow-[0_0_25px_rgba(255,0,60,0.15)]">
              <Image
                src={activeTrack.coverUrl}
                alt={activeTrack.title}
                fill
                priority
                className={`object-cover transition-transform duration-700 filter saturate-60 group-hover:saturate-100 ${isPlaying ? "scale-105" : "scale-100"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              
              <div className="absolute bottom-4 left-4">
                <span className="text-[9px] text-[#ff003c] tracking-widest uppercase font-bold block font-sans">LOADED_TRACK</span>
                <h3 className="text-3xl font-normal text-white font-sidewalk tracking-wide mt-1">{activeTrack.title}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">{activeTrack.album}</p>
              </div>
            </div>

            {/* Real Audio visualizer canvas */}
            <div className="border border-[#2a1316] rounded bg-[#050505] p-2 relative">
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={55} 
                className="w-full h-[55px] block opacity-95"
              />
              <div className="absolute top-1 left-2 text-[8px] text-zinc-600 uppercase tracking-widest">
                REALTIME FREQUENCY DECODER
              </div>
            </div>
          </div>

          {/* Player controls & playlist (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Audio Panel */}
            <div className="border border-[#221012] bg-[#0a0505] p-6 rounded-lg relative overflow-hidden">
              <div className="absolute top-2 right-4 text-[9px] text-zinc-600">
                DECODER_CONTROL // STAGE_2
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">CORE AUDIO STREAM</span>
                  <h2 className="text-xl font-normal text-[#ff003c] font-sidewalk tracking-widest mt-1">interactive deck</h2>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#ff003c]/10 border border-[#ff003c]/30 px-2.5 py-1 rounded text-[9px] text-[#ff003c] font-bold">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full bg-[#ff003c] ${isPlaying ? "animate-pulse" : ""}`} />
                  {isPlaying ? "ACTIVE SIGNAL" : "SIGNAL DECK READY"}
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-6 uppercase tracking-wide leading-relaxed min-h-[36px]">
                {activeTrack.description}
              </p>

              {/* Progress Slider (Real Time) */}
              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-[#ff003c]">{activeTrack.tempo}</span>
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

              {/* Player Controllers */}
              <div className="flex items-center justify-between mb-5">
                <button 
                  onClick={handlePrev}
                  className="p-2.5 border border-[#3e1d21] hover:border-[#ff003c] hover:text-[#ff003c] rounded text-white bg-black/40 transition-all active:scale-95"
                >
                  <SkipBack size={15} />
                </button>

                <button 
                  onClick={handlePlayPause}
                  className="px-8 py-3 bg-[#ff003c] hover:bg-[#ff1e51] text-black rounded font-bold text-xs uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,0,60,0.35)]"
                >
                  {isPlaying ? "PAUSE WAV STREAM" : "PLAY WAV STREAM"}
                </button>

                <button 
                  onClick={handleNext}
                  className="p-2.5 border border-[#3e1d21] hover:border-[#ff003c] hover:text-[#ff003c] rounded text-white bg-black/40 transition-all active:scale-95"
                >
                  <SkipForward size={15} />
                </button>
              </div>

              {/* WAV Notice */}
              <div className="border border-dashed border-[#341b1e] p-3 rounded bg-black/60 flex items-start gap-2.5">
                <Headphones size={15} className="text-[#ff003c] shrink-0 mt-0.5" />
                <span className="text-[9px] text-zinc-500 uppercase leading-relaxed font-sans">
                  <strong className="text-zinc-300">HQ AUDIO SOURCE:</strong> Currently playing your actual CD-quality WAV stems linked directly in the page player. Adjust slider to skip parts.
                </span>
              </div>
            </div>

            {/* Release Track list selection */}
            <div className="border border-[#221012] bg-[#0a0505] p-5 rounded-lg flex-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-4 font-sans">SELECT_TRACK // TRIGGER</span>
              <div className="space-y-2">
                {TRACKS.map((track, index) => {
                  const isActive = currentTrackIndex === index;
                  return (
                    <button
                      key={track.id}
                      onClick={() => selectTrack(index)}
                      className={`w-full flex items-center justify-between p-3 rounded transition-all text-left text-xs ${
                        isActive 
                          ? "bg-[#ff003c]/10 border border-[#ff003c]/30 text-white" 
                          : "bg-black/40 border border-[#1b0d0e] text-zinc-400 hover:border-[#3e1d21] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold ${isActive ? "text-[#ff003c]" : "text-zinc-600"}`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <div className={`font-sidewalk text-base tracking-wide ${isActive ? "text-[#ff003c]" : "text-zinc-200"}`}>{track.title}</div>
                          <div className="text-[9px] text-zinc-500 tracking-wider mt-0.5">{track.album}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] text-zinc-600">{track.tempo}</span>
                        {isActive && isPlaying ? (
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 h-full bg-[#ff003c] animate-[bounce_0.8s_infinite_-0.2s]" />
                            <span className="w-0.5 h-2/3 bg-[#ff003c] animate-[bounce_0.8s_infinite_-0.4s]" />
                            <span className="w-0.5 h-4/5 bg-[#ff003c] animate-[bounce_0.8s_infinite_0s]" />
                          </div>
                        ) : (
                          <span className="text-zinc-500">{track.duration}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* --- STREAMS AND SOCIAL PLATFORMS DIAL DIRECT (Forwarding priority) --- */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8 border-b border-[#221012] pb-4">
            <h2 className="text-xl font-normal tracking-widest text-[#f5f5f5] font-sidewalk flex items-center gap-2">
              <Radio size={16} className="text-[#ff003c] animate-pulse" />
              establish connection // stream link
            </h2>
            <span className="text-[9px] text-zinc-500 font-sans uppercase">OFFICIAL REDIRECT MATRIX</span>
          </div>

          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-6 font-sans">
            SELECT A PLATFORM IN THE SYSTEM GRID BELOW TO ESTABLISH AN IMMEDIATE AUDIO/VIDEO CONNECTION TO DIGIT'S CHANNELS:
          </p>

          {/* Grid of Streaming redirects */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PLATFORMS.map((platform, idx) => (
              <a
                key={idx}
                href={platform.url}
                target="_blank"
                rel="noreferrer"
                className={`border border-[#1f0f11] bg-[#080404] p-5 rounded-lg flex flex-col justify-between transition-all duration-300 transform active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.8)] ${platform.color}`}
              >
                <div>
                  <span className="text-[8px] text-zinc-600 block tracking-widest mb-1 font-sans">
                    REDIRECT_MATRIX_0{idx + 1}
                  </span>
                  <h3 className="text-2xl font-normal font-sidewalk tracking-wide mt-1 mb-3">
                    {platform.name}
                  </h3>
                </div>
                <div className="flex justify-between items-center text-[10px] border-t border-[#1a0f10] pt-3 mt-1">
                  <span className="text-zinc-500 font-mono lowercase tracking-wide">
                    {platform.badge}
                  </span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
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
          <div className="flex items-center gap-2.5">
            <span className="text-[#ff003c] font-bold">DIGIT SOUND SYSTEM</span>
            <span className="font-sans"> Lithuania Underground. Transmissions secure.</span>
          </div>
          <div className="flex gap-6 uppercase tracking-wider font-sans font-bold">
            <a href="https://instagram.com/05digit" target="_blank" rel="noreferrer" className="hover:text-[#ff003c] transition-colors">Instagram</a>
            <a href="https://open.spotify.com/artist/33z8eBD0nviVNHjKoe6kZZ?si=KBRyTTXrQoSX06e2hIlyxw" target="_blank" rel="noreferrer" className="hover:text-[#ff003c] transition-colors">Spotify</a>
            <a href="https://www.youtube.com/@05digit" target="_blank" rel="noreferrer" className="hover:text-[#ff003c] transition-colors">YouTube</a>
          </div>
          <div>
            &copy; {new Date().getFullYear()} digit.
          </div>
        </div>
      </footer>
    </div>
  );
}
