import React from 'react';
import { useEPGStore } from '@/store/epgStore';
import { useFilteredPrograms } from '@/hooks/useFilteredPrograms';

export function EPGList() {
  const { selectedProgram, setSelectedProgramAndChannel, data } = useEPGStore();
  const programs = useFilteredPrograms();

  if (programs.length === 0) {
    return (
      <div className="flex flex-col h-full flex-1">
        <p className="text-white p-4">No Information Available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1 overflow-y-auto px-4 py-2">
      {programs.map((program) => {
        const isSelected = selectedProgram === program.id;
        const channel = data?.channels.find((ch) => ch.id === program.channelId);
        const imageUrl = program.icon || channel?.icon;

        return (
          <div key={program.id} className="relative mb-2">
            {isSelected && (
              <>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-white text-xl z-20 pointer-events-none">
                  &lt;
                </div>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-white text-xl z-20 pointer-events-none">
                  &gt;
                </div>
              </>
            )}
            <button
              onClick={() => setSelectedProgramAndChannel(program.id, program.channelId)}
              className={`
                w-full flex items-center gap-3 text-left px-3 py-2 relative
                ${isSelected
                  ? 'bg-black/80 text-white border-2 border-white'
                  : 'bg-black/40 text-white hover:bg-black/50'
                }
              `}
            >
              <div className={`text-sm font-mono text-white min-w-[50px] relative ${isSelected ? 'ml-3' : ''}`}>
                {isSelected && (
                  <span className="absolute left-1/2 -translate-x-1/2 -top-3 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
                {program.start}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm text-white">{program.title}</div>
              </div>
              <div className="w-28 h-16 bg-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-600 relative">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.no-image-text')) {
                          const noImage = document.createElement('span');
                          noImage.className = 'no-image-text text-white text-xs';
                          noImage.textContent = 'No Image';
                          parent.appendChild(noImage);
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/0 pointer-events-none"></div>
                  </>
                ) : (
                  <span className="text-white text-xs">No Image</span>
                )}
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
