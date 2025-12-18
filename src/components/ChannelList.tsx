import React from 'react';
import { useEPGStore } from '@/store/epgStore';

const extractChannelNumber = (displayName: string): string => {
  const match = displayName.match(/^(\d+)\s/);
  return match ? match[1] : '';
};

const extractChannelName = (displayName: string): string => {
  const match = displayName.match(/^\d+\s(.+)$/);
  return match ? match[1] : displayName;
};

export function ChannelList() {
  const { data, selectedChannel, setSelectedChannel, setSelectedProgram, selectedDate } = useEPGStore();

  if (!data || data.channels.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-white p-2 md:p-4 text-sm md:text-base">No channels available</p>
      </div>
    );
  }

  const handleChannelClick = (channelId: string) => {
    setSelectedChannel(channelId);
    setSelectedProgram(null);
  };

  return (
    <div className="flex flex-col h-full flex-shrink-0 overflow-y-auto border-r-0 md:border-r border-b md:border-b-0 border-white/20 relative">
      <div className="absolute left-0 bottom-4 text-white/80 text-xl md:text-2xl px-2 z-10 pointer-events-none hidden md:block">
        &lt;
      </div>
      {data.channels.map((channel, index) => {
        const isSelected = selectedChannel === channel.id;
        const channelNumber = extractChannelNumber(channel.displayName) || String(index + 1);
        const channelName = extractChannelName(channel.displayName);

        const programCount = data.programs.filter((p) => 
          p.channelId === channel.id && p.startDate === selectedDate
        ).length;

        return (
          <button
            key={channel.id}
            onClick={() => handleChannelClick(channel.id)}
            className={`
              flex items-center gap-2 md:gap-4 text-left px-3 md:px-4 py-2 md:py-3 border-b border-white/20 relative
              ${isSelected
                ? 'bg-white/30 text-white'
                : 'bg-transparent text-white hover:bg-white/10'
              }
            `}
          >
            {channel.icon && (
              <img
                src={channel.icon}
                alt={channelName}
                className="w-8 h-8 md:w-12 md:h-12 object-contain flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-sm md:text-base truncate">
                <span className="mr-1 md:mr-2">{channelNumber}</span>
                <span className="truncate">{channelName}</span>
              </div>
            </div>
            {isSelected && (
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-white font-medium text-xs md:text-base">{programCount}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
