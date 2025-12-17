import { create } from 'zustand';
import { EPGState, EPGData } from '@/types';

export const useEPGStore = create<EPGState>(function (set) {
    return {
        data: null,
        selectedDate: null,
        selectedChannel: null,
        selectedProgram: null,
        isLoading: false,
        error: null,
        setData: function (data: EPGData) {
            set({ data });
        },
        setSelectedDate: function (date: string | null) {
            set({ selectedDate: date });
        },
        setSelectedChannel: function (channelId: string | null) {
            set({ selectedChannel: channelId });
        },
        setSelectedProgram: function (programId: string | null) {
            set({ selectedProgram: programId });
        },
        setSelectedProgramAndChannel: function (programId: string, channelId: string) {
            set({ selectedProgram: programId, selectedChannel: channelId });
        },
        setLoading: function (loading: boolean) {
            set({ isLoading: loading });
        },
        setError: function (error: string | null) {
            set({ error });
        },
    };
});

