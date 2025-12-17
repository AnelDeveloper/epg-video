import { Channel, Program, EPGData } from '@/types';

const STREAM_URLS = [
  'https://bitmovin-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
];

const getRandomStreamUrl = (): string => {
  return STREAM_URLS[Math.floor(Math.random() * STREAM_URLS.length)];
};

export function parseXML(xmlText: string): EPGData {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  const channels: Channel[] = [];
  const programs: Program[] = [];
  const dateSet = new Set<string>();

  const channelElements = xmlDoc.getElementsByTagName('channel');
  for (let i = 0; i < channelElements.length; i++) {
    const channelEl = channelElements[i];
    const id = channelEl.getAttribute('id') || '';
    const displayNameEl = channelEl.getElementsByTagName('display-name')[0];
    const iconEl = channelEl.getElementsByTagName('icon')[0];

    if (id && displayNameEl) {
      channels.push({
        id,
        displayName: displayNameEl.textContent || '',
        icon: iconEl?.getAttribute('src') || undefined,
        streamUrl: getRandomStreamUrl(),
      });
    }
  }

  const programmeElements = xmlDoc.getElementsByTagName('programme');
  for (let i = 0; i < programmeElements.length; i++) {
    const progEl = programmeElements[i];
    const channelId = progEl.getAttribute('channel') || '';
    const start = progEl.getAttribute('start') || '';
    const stop = progEl.getAttribute('stop') || '';
    const titleEl = progEl.getElementsByTagName('title')[0];
    const descEl = progEl.getElementsByTagName('desc')[0];
    const categoryEl = progEl.getElementsByTagName('category')[0];
    const iconEl = progEl.getElementsByTagName('icon')[0];

    if (channelId && start && titleEl) {
      const startDate = parseXMLTVDate(start);
      const dateKey = startDate.toISOString().split('T')[0];
      dateSet.add(dateKey);

      programs.push({
        id: `${channelId}-${start}`,
        channelId,
        title: titleEl.textContent || '',
        start: formatTime(startDate),
        stop: stop ? formatTime(parseXMLTVDate(stop)) : '',
        startDate: dateKey,
        desc: descEl?.textContent || undefined,
        category: categoryEl?.textContent || undefined,
        icon: iconEl?.getAttribute('src') || undefined,
      });
    }
  }

  const dates = Array.from(dateSet).sort();

  return {
    channels,
    programs,
    dates,
  };
}

const parseXMLTVDate = (dateStr: string): Date => {
  const year = parseInt(dateStr.substring(0, 4), 10);
  const month = parseInt(dateStr.substring(4, 6), 10) - 1;
  const day = parseInt(dateStr.substring(6, 8), 10);
  const hour = parseInt(dateStr.substring(8, 10), 10);
  const minute = parseInt(dateStr.substring(10, 12), 10);
  const second = parseInt(dateStr.substring(12, 14), 10);

  return new Date(Date.UTC(year, month, day, hour, minute, second));
};

const formatTime = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const fetchEPGData = async (url: string): Promise<string> => {
  const isLocalFile = url.startsWith('/');

  if (isLocalFile) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      throw new Error(`Failed to load local file: ${url}. Make sure the file exists in the public/ folder.`);
    }
  }

  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    try {
      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
      ];

      for (let i = 0; i < proxies.length; i++) {
        try {
          const proxyResponse = await fetch(proxies[i]);
          if (!proxyResponse.ok) continue;

          const data = await proxyResponse.json();
          if (data.contents) {
            return data.contents;
          }
          if (data.content) {
            return data.content;
          }
          if (typeof data === 'string') {
            return data;
          }
        } catch (proxyError) {
          continue;
        }
      }

      throw new Error('All CORS proxies failed');
    } catch (proxyError) {
      throw new Error(
        'Failed to fetch EPG data. Please download epg_tvprofil.net.xml and place it in the public/ folder, then change the URL in useEPGData.ts to "/epg_tvprofil.net.xml"'
      );
    }
  }
};
