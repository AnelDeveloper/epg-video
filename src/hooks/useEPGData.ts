import { useEffect } from 'react';
import { useEPGStore } from '@/store/epgStore';
import { fetchEPGData, parseXML } from '@/utils/xmlParser';

const EPG_URL = '/epg_tvprofil.net.xml';

export function useEPGData() {
  const { setData, setLoading, setError, setSelectedDate, data } = useEPGStore();

  useEffect(() => {
    if (data) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const xmlText = await fetchEPGData(EPG_URL);
        const parsedData = parseXML(xmlText);
        setData(parsedData);
        
        if (parsedData.dates.length > 0) {
          setSelectedDate(parsedData.dates[0]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load EPG data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setData, setLoading, setError, setSelectedDate, data]);

  return useEPGStore();
}
