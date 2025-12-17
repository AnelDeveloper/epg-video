import React from 'react';
import { DatePicker } from '@/components/DatePicker';
import { ChannelList } from '@/components/ChannelList';
import { EPGList } from '@/components/EPGList';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useEPGData } from '@/hooks/useEPGData';
import { useAutoHideUI } from '@/hooks/useAutoHideUI';

export function App() {
  const { isLoading, error } = useEPGData();
  const isUIVisible = useAutoHideUI();

  return (
    <div className="min-h-screen relative">
      <VideoPlayer />

      <div className={`relative z-10 h-screen w-screen transition-opacity duration-300 ${isUIVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {isLoading && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-white text-xl">Loading EPG data...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-red-400 text-xl">Error: {error}</div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex h-screen w-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/0 pointer-events-none z-0"></div>

            <div className="relative z-10 flex h-screen w-full">
              <DatePicker />
              <div className="w-[500px]">
                <ChannelList />
              </div>
              <div className="w-[500px]">
                <EPGList />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
