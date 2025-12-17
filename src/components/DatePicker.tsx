import React, { useState, useEffect, useRef } from 'react';
import { useEPGStore } from '@/store/epgStore';

export function DatePicker() {
    const { data, selectedDate, setSelectedDate } = useEPGStore();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const manualToggleRef = useRef(false);

    if (!data || data.dates.length === 0) {
        return (
            <div className="flex flex-col h-full w-[200px] flex-shrink-0">
                <p className="text-white p-4">No dates available</p>
            </div>
        );
    }

    const formatDateDisplay = (dateStr: string): string => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }

        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const isTodayOrTomorrow = (dateStr: string): boolean => {
        const date = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return date.toDateString() === today.toDateString() || date.toDateString() === tomorrow.toDateString();
    };

    useEffect(() => {
        if (!manualToggleRef.current) {
            if (selectedDate && isTodayOrTomorrow(selectedDate)) {
                setIsCollapsed(true);
            } else if (selectedDate && !isTodayOrTomorrow(selectedDate)) {
                setIsCollapsed(false);
            }
        }
        manualToggleRef.current = false;
    }, [selectedDate]);

    if (isCollapsed && selectedDate) {
        return (
            <div className="flex flex-col h-full w-[50px] flex-shrink-0 relative">
                <button
                    onClick={() => {
                        manualToggleRef.current = true;
                        setIsCollapsed(false);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-2xl hover:text-white/80 cursor-pointer z-10 w-8 h-8 flex items-center justify-center"
                >
                    ←
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-[200px] flex-shrink-0 overflow-y-auto">
            {data.dates.map((date) => {
                const isSelected = selectedDate === date;

                return (
                    <button
                        key={date}
                        onClick={() => {
                            if (isSelected && isTodayOrTomorrow(date)) {
                                manualToggleRef.current = true;
                                setIsCollapsed(!isCollapsed);
                            } else {
                                manualToggleRef.current = false;
                                setSelectedDate(date);
                            }
                        }}
                        className={`
                            w-full text-left px-4 py-3 border-b border-white/20 relative
                            ${isSelected
                                ? 'bg-white/30 text-white'
                                : 'bg-transparent text-white hover:bg-white/10'
                            }
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div className="font-medium text-base">{formatDateDisplay(date)}</div>
                            {isSelected && isTodayOrTomorrow(date) && (
                                <span className="text-white text-xl">→</span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
