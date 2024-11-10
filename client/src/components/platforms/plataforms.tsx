import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MacOS, Nintendo, Playstation, Steam, Windows, Xbox } from "./images_platforms";

type PlatformKey = "xbox" | "playstation" | "nintendo" | "macos" | "steam" | "pc";

const platformLogos: Record<PlatformKey, { logo: string; color: string }> = {
  xbox: { logo: Xbox.src, color: "bg-[#107c10]" },
  playstation: { logo: Playstation.src, color: "bg-[#00439C]" },
  nintendo: { logo: Nintendo.src, color: "bg-[#e60012]" },
  macos: { logo: MacOS.src, color: "p-0 bg-[#78C5EF] " },
  steam: { logo: Steam.src, color: "bg-[#202c3c]" },
  pc: { logo: Windows.src, color: "bg-white" },
};

const getPlatformKey = (platformName: string): PlatformKey | null => {
  for (const key in platformLogos) {
    if (platformName.toLowerCase().includes(key)) {
      return key as PlatformKey;
    }
  }
  return null;
};

interface Platform {
  platform: {
    name: string;
  };
}

const GamePlatforms = ({ platforms }: { platforms: Platform[] }) => {
  const groupedPlatforms: { [key: string]: string[] } = {};

  platforms.forEach((p) => {
    const key = getPlatformKey(p.platform.name);
    if (key) {
      if (!groupedPlatforms[key]) {
        groupedPlatforms[key] = [];
      }
      groupedPlatforms[key].push(p.platform.name);
    }
  });

  return (
    <TooltipProvider>
      <div className="flex flex-row gap-4 mb-2">
        {Object.entries(groupedPlatforms).map(([key, names]) => {
          const { logo, color } = platformLogos[key as PlatformKey];
          return (
            <Tooltip key={key}>
              <TooltipTrigger>
                <div className={`flex items-center justify-center w-16 h-16 p-2 ${color} rounded-lg`}>
                  <img src={logo} alt={key} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{names.join(", ")}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default GamePlatforms;
