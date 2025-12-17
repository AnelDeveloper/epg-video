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
        <p className="text-white p-4">No channels available</p>
      </div>
    );
  }

  const handleChannelClick = (channelId: string) => {
    setSelectedChannel(channelId);
    setSelectedProgram(null);
  };

  return (
    <div className="flex flex-col h-full flex-shrink-0 overflow-y-auto border-r border-white/20 relative">
      <div className="absolute left-0 bottom-4 text-white/80 text-2xl px-2 z-10 pointer-events-none">
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
              flex items-center gap-4 text-left px-4 py-3  border-b border-white/20 relative
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
                className="w-12 h-12 object-contain flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 text-left">
              <div className="font-medium text-base">
                <span className="mr-2">{channelNumber}</span>
                {channelName}
              </div>
            </div>
            {isSelected && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                <span className="text-white font-medium text-base">{programCount}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
