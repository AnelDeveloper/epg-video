export interface Channel {
  id: string;
  displayName: string;
  icon?: string;
  streamUrl?: string;
}

export interface Program {
  id: string;
  channelId: string;
  title: string;
  start: string;
  stop: string;
  startDate: string;
  desc?: string;
  category?: string;
  icon?: string;
}

export interface EPGData {
  channels: Channel[];
  programs: Program[];
  dates: string[];
}

export interface EPGState {
  data: EPGData | null;
  selectedDate: string | null;
  selectedChannel: string | null;
  selectedProgram: string | null;
  isLoading: boolean;
  error: string | null;
  setData: (data: EPGData) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedChannel: (channelId: string | null) => void;
  setSelectedProgram: (programId: string | null) => void;
  setSelectedProgramAndChannel: (programId: string, channelId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface PlayerState {
  currentStreamUrl: string | null;
  isPlaying: boolean;
  error: string | null;
  recoveryAttempts: number;
  setCurrentStream: (url: string | null) => void;
  setPlaying: (playing: boolean) => void;
  setPlayerError: (error: string | null) => void;
  incrementRecoveryAttempts: () => void;
  resetRecoveryAttempts: () => void;
}
