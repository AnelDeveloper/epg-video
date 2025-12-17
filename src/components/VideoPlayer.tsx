import React, { useEffect, useRef } from 'react';
import * as shaka from 'shaka-player/dist/shaka-player.compiled';
import { usePlayerStore } from '@/store/playerStore';
import { useEPGStore } from '@/store/epgStore';

const DEFAULT_STREAM = 'https://bitmovin-a.akamaihd.net/content/art-of-motion_drm/mpds/11331.mpd';
const DRM_LICENSE_SERVER = 'https://cwip-shaka-proxy.appspot.com/no_auth';
const MAX_RECOVERY_ATTEMPTS = 3;
const RECOVERY_DELAY = 2000;

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);
  const stallCheckIntervalRef = useRef<number | null>(null);
  const lastTimeUpdateRef = useRef<number>(0);
  const currentStreamUrlRef = useRef<string | null>(null);
  const lastSelectedProgramRef = useRef<string | null>(null);
  const { setPlayerError, incrementRecoveryAttempts, resetRecoveryAttempts } = usePlayerStore();
  const { selectedChannel, selectedProgram, data } = useEPGStore();

  useEffect(() => {
    if (!videoRef.current) return;

    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      const player = new shaka.Player(videoRef.current);
      playerRef.current = player;

      player.configure({
        drm: {
          servers: {
            'com.widevine.alpha': DRM_LICENSE_SERVER,
          },
        },
      });

      player.addEventListener('error', (event: any) => {
        const error = event.detail;
        setPlayerError(error.message || 'Playback error');
        
        const errorSeverity = error.severity || 2;
        if (errorSeverity <= 2) {
          const currentAttempts = usePlayerStore.getState().recoveryAttempts;
          if (currentAttempts < MAX_RECOVERY_ATTEMPTS) {
            setTimeout(() => {
              incrementRecoveryAttempts();
              if (playerRef.current && videoRef.current) {
                const currentUrl = usePlayerStore.getState().currentStreamUrl || DEFAULT_STREAM;
                loadStream(playerRef.current, currentUrl);
              }
            }, RECOVERY_DELAY);
          }
        }
      });

      if (videoRef.current) {
        videoRef.current.addEventListener('timeupdate', () => {
          lastTimeUpdateRef.current = Date.now();
        });

        stallCheckIntervalRef.current = window.setInterval(() => {
          if (videoRef.current) {
            const video = videoRef.current;
            const now = Date.now();
            const timeSinceLastUpdate = now - lastTimeUpdateRef.current;
            
            if (!video.paused && !video.ended && timeSinceLastUpdate > 5000) {
              const currentAttempts = usePlayerStore.getState().recoveryAttempts;
              if (currentAttempts < MAX_RECOVERY_ATTEMPTS) {
                incrementRecoveryAttempts();
                const currentUrl = usePlayerStore.getState().currentStreamUrl || DEFAULT_STREAM;
                if (playerRef.current) {
                  loadStream(playerRef.current, currentUrl);
                }
              }
            }
          }
        }, 3000);
      }

      const streamUrl = usePlayerStore.getState().currentStreamUrl || DEFAULT_STREAM;
      currentStreamUrlRef.current = streamUrl;
      loadStream(player, streamUrl);
    } else {
      setPlayerError('Shaka Player is not supported in this browser');
    }

    return () => {
      if (stallCheckIntervalRef.current !== null) {
        clearInterval(stallCheckIntervalRef.current);
        stallCheckIntervalRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!playerRef.current || !selectedChannel || !data) {
      return;
    }

    const channel = data.channels.find((ch) => ch.id === selectedChannel);

    if (channel && channel.streamUrl) {
      const streamChanged = currentStreamUrlRef.current !== channel.streamUrl;
      const programChanged = selectedProgram !== lastSelectedProgramRef.current;
      const shouldReload = streamChanged || programChanged;
      
      if (shouldReload) {
        resetRecoveryAttempts();
        usePlayerStore.getState().setCurrentStream(channel.streamUrl);
        currentStreamUrlRef.current = channel.streamUrl;
        lastSelectedProgramRef.current = selectedProgram;
        loadStream(playerRef.current, channel.streamUrl);
      }
    }
  }, [selectedChannel, selectedProgram, data, resetRecoveryAttempts]);

  const loadStream = async (player: shaka.Player, url: string) => {
    try {
      setPlayerError(null);
      resetRecoveryAttempts();
      
      try {
        const currentUri = player.getAssetUri();
        if (currentUri) {
          await player.unload();
        }
      } catch (unloadError) {
      }
      
      await player.load(url);
      currentStreamUrlRef.current = url;
      
      if (videoRef.current) {
        lastTimeUpdateRef.current = Date.now();
        videoRef.current.play().catch((err) => {
          setTimeout(() => {
            if (videoRef.current && !videoRef.current.paused) {
              videoRef.current.play().catch(() => {
              });
            }
          }, 1000);
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load stream';
      setPlayerError(errorMessage);
      
      const currentAttempts = usePlayerStore.getState().recoveryAttempts;
      if (currentAttempts < MAX_RECOVERY_ATTEMPTS) {
        setTimeout(() => {
          incrementRecoveryAttempts();
          if (playerRef.current) {
            loadStream(playerRef.current, url);
          }
        }, RECOVERY_DELAY);
      }
    }
  };

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 w-full h-full object-cover z-0"
      autoPlay
      muted
      playsInline
    />
  );
}
