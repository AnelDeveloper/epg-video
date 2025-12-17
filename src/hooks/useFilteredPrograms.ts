import { useMemo } from 'react';
import { useEPGStore } from '@/store/epgStore';
import { Program } from '@/types';

export function useFilteredPrograms(): Program[] {
  const { data, selectedDate, selectedChannel } = useEPGStore();

  return useMemo(() => {
    if (!data || !selectedDate || !selectedChannel) {
      return [];
    }

    return data.programs.filter((program) => 
      program.channelId === selectedChannel && program.startDate === selectedDate
    ).sort((a, b) => a.start.localeCompare(b.start));
  }, [data, selectedDate, selectedChannel]);
}
