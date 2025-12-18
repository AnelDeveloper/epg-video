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
            <div className="text-white text-base md:text-xl px-4">Loading EPG data...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-screen">
            <div className="text-red-400 text-base md:text-xl px-4">Error: {error}</div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-col md:flex-row h-screen w-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/0 pointer-events-none z-0"></div>

            <div className="relative z-10 flex flex-col md:flex-row h-screen w-full">
              <DatePicker />
              <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
                <div className="w-full md:w-[500px] flex-shrink-0 h-1/2 md:h-full">
                  <ChannelList />
                </div>
                <div className="w-full md:w-[500px] flex-shrink-0 h-1/2 md:h-full">
                  <EPGList />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
