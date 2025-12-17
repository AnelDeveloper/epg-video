import { create } from 'zustand';
import { PlayerState } from '@/types';

export const usePlayerStore = create<PlayerState>(function (set) {
    return {
        currentStreamUrl: null,
        isPlaying: false,
        error: null,
        recoveryAttempts: 0,
        setCurrentStream: function (url: string | null) {
            set({ currentStreamUrl: url });
        },
        setPlaying: function (playing: boolean) {
            set({ isPlaying: playing });
        },
        setPlayerError: function (error: string | null) {
            set({ error });
        },
        incrementRecoveryAttempts: function () {
            set(function (state) {
                return { recoveryAttempts: state.recoveryAttempts + 1 };
            });
        },
        resetRecoveryAttempts: function () {
            set({ recoveryAttempts: 0 });
        },
    };
});

