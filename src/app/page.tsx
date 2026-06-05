"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SkipForward, SkipBack } from "lucide-react";
import { VolumeSlider } from "@/components/VolumeSlider";
import { track } from "@vercel/analytics";

// Minimal type for the YouTube IFrame API player
interface YTPlayer {
  loadVideoById(opts: { videoId: string; startSeconds: number }): void;
  playVideo(): void;
  pauseVideo(): void;
  getPlayerState(): number;
  setVolume(volume: number): void;
  mute(): void;
  unMute(): void;
  destroy(): void;
}

// --- Types ---
interface Track {
  id: string;
  title: string;
  feature?: string;
  album: string;
  coverUrl: string;
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
    album: "apakau x perfect (2024)",
    coverUrl: "/songs/apakau (feat Atikin) x perfect.jpg",
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
    duration: "2:09",
    spotifyUrl: "https://open.spotify.com/track/6RMZ738QXWNQ2Jh4QjFk2h?si=c39efe8e9c5443e9",
    appleMusicUrl: "https://music.apple.com/lt/album/deja-vu/1804513622?i=1804513630",
    youtubeUrl: "https://www.youtube.com/watch?v=TPwBpsgxirc",
    youtubeVideoId: "TPwBpsgxirc",
    videoBadge: "Official Music Video"
  },
  {
    id: "pasuktagalva",
    title: "Pasukta galva",
    album: "22:22 (2023)",
    coverUrl: "/songs/deja vu.jpg",
    duration: "2:08",
    spotifyUrl: "https://open.spotify.com/track/2HT9E1PaeGj6Rnh8GjIeXK?si=2178309151e84c92",
    appleMusicUrl: "https://music.apple.com/us/album/pasukta-galva/1804513622?i=1804513623",
    youtubeUrl: "https://www.youtube.com/watch?v=3SBb3v9r-J0",
    youtubeVideoId: "3SBb3v9r-J0",
    videoBadge: "Official Audio"
  }
];

const PLATFORMS = [
  {
    name: "Spotify",
    url: "https://open.spotify.com/artist/33z8eBD0nviVNHjKoe6kZZ?si=KBRyTTXrQoSX06e2hIlyxw",
    color: "hover:bg-[#1db954]/10 hover:border-[#1db954] hover:text-[#1db954]",
    accent: "#1db954"
  },
  {
    name: "Apple Music",
    url: "https://music.apple.com/us/artist/digit/1524901037",
    color: "hover:bg-[#fc3c44]/10 hover:border-[#fc3c44] hover:text-[#fc3c44]",
    accent: "#fc3c44"
  },
  {
    name: "YouTube Channel",
    url: "https://www.youtube.com/@05digit",
    color: "hover:bg-[#ff0000]/10 hover:border-[#ff0000] hover:text-[#ff0000]",
    accent: "#ff0000"
  },
  {
    name: "YouTube Music",
    url: "https://music.youtube.com/@05digit",
    color: "hover:bg-[#ff003c]/10 hover:border-[#ff003c] hover:text-[#ff003c]",
    accent: "#ff003c"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/05digit/",
    color: "hover:bg-[#e1306c]/10 hover:border-[#e1306c] hover:text-[#e1306c]",
    accent: "#e1306c"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@05digit",
    color: "hover:bg-[#00f2fe]/10 hover:border-[#00f2fe] hover:text-[#00f2fe]",
    accent: "#00f2fe"
  }
];



export default function Home() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const [isTrailerActive, setIsTrailerActive] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);

  const ytPlayerRef = useRef<YTPlayer | null>(null);

  const isPlayingRef = useRef<boolean>(false);
  const volumeRef = useRef<number>(0.8);
  const currentTrackIndexRef = useRef<number>(0);

  // Keep refs synced with React state to prevent stale closures in async player callbacks
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

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
  const displayTrack = isTrailerActive 
    ? (TRACKS.find(t => t.id === "pasuktagalva") || activeTrack)
    : activeTrack;

  // Helper to skip track automatically on end
  const autoSkipNext = () => {
    const nextIndex = (currentTrackIndexRef.current + 1) % TRACKS.length;
    selectTrack(nextIndex);
  };

  // Initialize YouTube API Player
  const initYoutubePlayer = () => {
    const container = document.getElementById("yt-player");
    if (!container || ytPlayerRef.current) return;

    ytPlayerRef.current = new (window as unknown as { YT: { Player: new (id: string, opts: unknown) => YTPlayer } }).YT.Player("yt-player", {
      videoId: isTrailerActive ? "F4NdmdLr7_w" : TRACKS[currentTrackIndex].youtubeVideoId,
      playerVars: {
        autoplay: 0,
        controls: 1, // Native YouTube player controls visible
        rel: 0,
        modestbranding: 1,
        mute: isVideoMuted ? 1 : 0,
      },
      events: {
        onReady: (event: { target: YTPlayer }) => {
          event.target.setVolume(volumeRef.current * 100);
        },
        onStateChange: (event: { data: number }) => {
          const playerState = event.data;
          // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
          if (playerState === 1) {
            setIsPlaying(true);
            setIsVideoMuted(false);
            if (volumeRef.current === 0) {
              setVolume(0.8);
            }
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
      } catch {}
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
      } catch {}
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
        setIsVideoMuted(false);
        if (volume === 0) {
          setVolume(0.8);
        }
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
        track("audio_play", { track_title: activeTrack.title });
      }
    } catch {}
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

  const playVideoById = (videoId: string) => {
    setIsVideoMuted(false);
    if (volume === 0) {
      setVolume(0.8);
    }
    if (ytPlayerRef.current && ytPlayerRef.current.loadVideoById) {
      try {
        ytPlayerRef.current.loadVideoById({ videoId, startSeconds: 0 });
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch {}
    }
  };

  const selectTrack = (index: number) => {
    setIsTrailerActive(false);
    setCurrentTrackIndex(index);
    track("select_track", { track_title: TRACKS[index].title });
    playVideoById(TRACKS[index].youtubeVideoId);
  };

  const handleToggleTrailer = () => {
    track("click_trailer_toggle", { current_state: isTrailerActive });
    if (!ytPlayerRef.current || !ytPlayerRef.current.loadVideoById) return;

    if (!isTrailerActive) {
      setIsTrailerActive(true);
      playVideoById("F4NdmdLr7_w");
    } else {
      setIsTrailerActive(false);
      playVideoById(activeTrack.youtubeVideoId);
    }
  };



  // Mount / Unmount scripts and setup
  useEffect(() => {
    // 1. Register the YouTube API ready callback
    (window as unknown as { onYouTubeIframeAPIReady: () => void }).onYouTubeIframeAPIReady = initYoutubePlayer;

    // 2. Load the API script, or call immediately if the API is already cached
    const win = window as unknown as { YT?: { Player: unknown } };
    if (win.YT && win.YT.Player) {
      initYoutubePlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    return () => {
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div className="flex justify-center items-center sm:w-2/4 flex-col">
          <h1 className="sr-only">05digit / digit / 05 Official Artist Website</h1>
          <span className="inline-block text-3xl md:text-4xl font-normal text-[#f5f5f5] font-sidewalk tracking-widest lowercase cursor-pointer logo-glow">
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
        
        {/* --- MUSIC & VIDEO SYSTEM --- */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 mb-16 items-stretch justify-center w-full min-h-[480px]">
          
          {/* COLUMN 1: COVER ART & LINKS */}
          <div className={`transition-all duration-700 ease-in-out origin-right flex flex-col items-end max-w-md mx-auto lg:max-w-none relative ${
            isExpanded 
              ? "w-full lg:w-[25%] lg:mr-6 max-h-[1000px] lg:max-h-none opacity-100 scale-100 pointer-events-auto mt-0" 
              : "w-full lg:w-0 lg:mr-0 max-h-0 lg:max-h-none opacity-0 scale-95 overflow-hidden pointer-events-none -mt-6 lg:mt-0"
          }`}>
            <div className="border border-[#221012] bg-[#0a0505] p-4 rounded-lg flex flex-col gap-6 h-full justify-center w-full lg:w-[270px] shrink-0">
              
              {/* Cover Display */}
              <div className="relative aspect-square w-full max-w-[320px] lg:max-w-none mx-auto rounded border border-[#2a1316] overflow-hidden group shadow-[0_0_20px_rgba(255,0,60,0.12)]">
                <Image
                  src={displayTrack.coverUrl}
                  alt={displayTrack.title}
                  fill
                  priority
                  className={`object-cover transition-transform duration-700 filter saturate-60 group-hover:saturate-100 ${isPlaying ? "scale-105" : "scale-100"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 to-transparent" />
                
                <div className="absolute bottom-3 left-3">
                  <h3 className="text-xl font-normal text-white font-sidewalk tracking-wide">{displayTrack.title}</h3>
                  {displayTrack.feature && (
                    <p className="text-[9px] text-zinc-400 font-mono tracking-widest mt-0.5 uppercase">{displayTrack.feature}</p>
                  )}
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">{displayTrack.album}</p>
                </div>
              </div>

              {/* Song Links in Bigger Colors */}
              <div className="grid grid-cols-3 gap-2">
                {displayTrack.spotifyUrl ? (
                  <a
                    href={displayTrack.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("click_track_spotify", { track_title: displayTrack.title })}
                    className="flex flex-col items-center justify-center py-2 rounded border border-[#1db954]/30 bg-[#1db954]/5 text-[#1db954] hover:bg-[#1db954]/10 hover:border-[#1db954] transition-all duration-300 font-mono text-[9px] font-bold tracking-widest text-center"
                  >
                    <span>SPOTIFY</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center py-2 rounded border border-zinc-900 bg-zinc-950/20 text-zinc-700 font-mono text-[9px] select-none text-center">
                    N/A
                  </div>
                )}

                {displayTrack.appleMusicUrl ? (
                  <a
                    href={displayTrack.appleMusicUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("click_track_apple", { track_title: displayTrack.title })}
                    className="flex flex-col items-center justify-center py-2 rounded border border-[#fc3c44]/30 bg-[#fc3c44]/5 text-[#fc3c44] hover:bg-[#fc3c44]/10 hover:border-[#fc3c44] transition-all duration-300 font-mono text-[9px] font-bold tracking-widest text-center"
                  >
                    <span>APPLE</span>
                  </a>
                ) : (
                  <div className="flex items-center justify-center py-2 rounded border border-zinc-900 bg-zinc-950/20 text-zinc-700 font-mono text-[9px] select-none text-center">
                    N/A
                  </div>
                )}

                {displayTrack.youtubeUrl ? (
                  <a
                    href={displayTrack.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("click_track_youtube", { track_title: displayTrack.title })}
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

          {/* COLUMN 2: VIDEO & PLAYBACK SYSTEM */}
          <div className={`transition-all duration-700 ease-in-out flex flex-col ${
            isExpanded 
              ? "w-full lg:w-[50%]" 
              : "w-full lg:w-[65%] max-w-4xl mx-auto"
          }`}>
            <div className="border border-[#221012] bg-[#0a0505] p-4 rounded-lg flex flex-col gap-4 h-full justify-between">
              
              {/* Unified Video & Audio Side Controller Box */}
              <div className="border border-[#281517] bg-[#0c0707] p-2 rounded-lg flex flex-row gap-3 items-stretch relative overflow-hidden group">
                {/* Target div for YouTube player loading */}
                <div className="relative aspect-video flex-1 rounded overflow-hidden bg-black/80 border border-[#1b0d0e]">
                    <div id="yt-player" className="w-full h-full border-0 grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                </div>

                {/* Vertical Audio Controller on the Side */}
                <VolumeSlider
                  initialVolume={volume}
                  isVideoMuted={isVideoMuted}
                  setIsVideoMuted={setIsVideoMuted}
                  onVolumeChangeCommit={(newVolume) => setVolume(newVolume)}
                  ytPlayerRef={ytPlayerRef}
                />
              </div>

              {/* Player controls */}
              <div className="flex flex-col gap-3 justify-between flex-1 mt-2">
                
                {/* Current Track Readout */}
                <div className="flex flex-col gap-0.5 border-b border-[#1b0d0e] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] text-[#ff003c] font-mono tracking-widest uppercase">{"//"} NOW PLAYING</span>
                    <span className="h-[1px] w-4 bg-[#2a1316]" />
                    <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase">{isTrailerActive ? "OFFICIAL ARTIST TRAILER" : activeTrack.videoBadge}</span>
                  </div>
                  <h2 className="text-xl font-normal text-white uppercase font-sidewalk tracking-wide mt-0.5">
                    {isTrailerActive ? "digit" : activeTrack.title}
                    {!isTrailerActive && activeTrack.feature && (
                      <span className="text-xs text-zinc-500 font-mono tracking-wider uppercase ml-2">
                        {activeTrack.feature}
                      </span>
                    )}
                  </h2>
                  {isTrailerActive && (
                    <p className="text-[9px] text-zinc-400 font-mono tracking-widest mt-1 uppercase">
                      Background Track: <span className="text-[#ff003c] font-bold">Pasukta galva</span>
                    </p>
                  )}
                </div>

                {/* Playback Controls and Trailer Switcher Row */}
                <div className={`flex gap-3 transition-all duration-700 ease-in-out w-full ${
                  isExpanded ? "flex-col" : "flex-col sm:flex-row items-center justify-between"
                }`}>
                  
                  {/* Left part: Core Playback buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePrev}
                      aria-label="Previous track"
                      className="p-1.5 border border-[#3e1d21] hover:border-[#ff003c] hover:text-[#ff003c] rounded text-white bg-black/40 transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff003c]"
                    >
                      <SkipBack size={12} />
                    </button>

                    <button 
                      onClick={handlePlayPause}
                      aria-label={isPlaying ? "Pause track" : "Play track"}
                      className="px-5 py-1.5 bg-[#ff003c] hover:bg-[#ff1e51] text-black rounded font-bold text-[8px] uppercase tracking-widest transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_12px_rgba(255,0,60,0.35)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0505]"
                    >
                      {isPlaying ? "PAUSE" : "PLAY"}
                    </button>

                    <button 
                      onClick={handleNext}
                      aria-label="Next track"
                      className="p-1.5 border border-[#3e1d21] hover:border-[#ff003c] hover:text-[#ff003c] rounded text-white bg-black/40 transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff003c]"
                    >
                      <SkipForward size={12} />
                    </button>
                  </div>

                  {/* Right part: Trailer switcher button (moved off the video frame) */}
                  {!isTrailerActive && (
                    <button
                      onClick={handleToggleTrailer}
                      className="px-4 py-1.5 rounded text-[8px] font-mono font-bold tracking-widest border bg-black/85 text-zinc-400 border-zinc-800 hover:border-[#ff003c] hover:text-white transition-all duration-300 active:scale-95 cursor-pointer w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff003c]"
                    >
                      WATCH TRAILER
                    </button>
                  )}

                </div>

                {/* Toggle Cover/Tracklist button - Animates position by moving down below controls when expanded */}
                <div className="transition-all duration-700 ease-in-out w-full mt-1">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-2 bg-transparent border border-[#ff003c]/40 hover:border-[#ff003c] text-[#ff003c] hover:bg-[#ff003c]/10 rounded font-mono font-bold text-[8px] uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_10px_rgba(255,0,60,0.1)] hover:shadow-[0_0_15px_rgba(255,0,60,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff003c]"
                  >
                    {isExpanded ? "COLLAPSE" : "MORE MUSIC"}
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* COLUMN 3: TRACKLIST */}
          <div className={`transition-all duration-700 ease-in-out origin-left flex flex-col items-start max-w-md mx-auto lg:max-w-none relative ${
            isExpanded 
              ? "w-full lg:w-[25%] lg:ml-6 max-h-[1000px] lg:max-h-none opacity-100 scale-100 pointer-events-auto mt-0" 
              : "w-full lg:w-0 lg:ml-0 max-h-0 lg:max-h-none opacity-0 scale-95 overflow-hidden pointer-events-none -mt-6 lg:mt-0"
          }`}>
            <div className="border border-[#221012] bg-[#0a0505] p-4 rounded-lg flex flex-col h-full justify-between w-full lg:w-[270px] shrink-0">
              
              <div className="flex flex-col flex-1 min-h-0">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-3 font-sans">{"//"} TRACKLIST</span>
                <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                  {TRACKS.map((t, index) => {
                    const isActive = currentTrackIndex === index && !isTrailerActive;
                    return (
                      <button
                        key={t.id}
                        onClick={() => selectTrack(index)}
                        aria-current={isActive ? "true" : undefined}
                        className={`w-full flex flex-col p-2.5 rounded transition-all text-left cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff003c] ${
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
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* --- BIO SECTION --- */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-[#1a1112] pt-12">
          {/* Bio Text (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[#ff003c] font-bold font-mono text-xs">{"//"} BIO</span>
              <span className="h-[1px] w-12 bg-[#2a1316]" />
            </div>
            <h2 className="text-3xl font-normal tracking-widest text-[#f5f5f5] font-sidewalk uppercase">
              about digit
            </h2>
            <div className="space-y-4 text-sm text-zinc-400 font-sans leading-relaxed tracking-wide">
              <p>
                Digit is an independent artist and creative from Vilnius, Lithuania. Winner of Pusės Dainos Festival 2023, he has been building his own sound since 2020 — rooted in hip-hop but never confined to it, drawing from whatever serves the core vision.
              </p>
              <p>
                Coming from a family of orchestral musicians and theater and film actors, a broad approach to sound and art was never a choice — it was just the environment. That foundation shows in how far his work extends: lyrics, production, mixing, mastering, photography, video, VFX, editing, management and even this website :D
              </p>
              <p>
                He has collaborated closely with Lithuanian artists including Atikin, Nikobarisas, Jūsų Kilnybė, and producer Obsalon, while staying tapped into the international scene — including creative work with Seattle-based artist Adam Fadi.
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
            <span className="text-[#ff003c] font-bold font-mono text-xs">{"//"} STAY IN TOUCH</span>
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
            &copy; {new Date().getFullYear()} Don&apos;t Got Time. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
