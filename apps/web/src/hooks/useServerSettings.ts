import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useServerSettings(serverId: string) {
  const { data, error, mutate } = useSWR(`/api/server/${serverId}/settings`, fetcher, {
    fallbackData: {
      settings: {
        isPremium: false,
        isLifetimePremium: false,
        raidMode: false,
        antiLink: true,
        antiSpamSensitivity: "medium",
        logChannelId: "",
        muteDuration: "10m",
        blacklistedWords: [],
        captchaVerification: false,
        antiSelfbot: true,
        accountAge: "1w",
        mentionLimit: "5",
        antiMassBan: 5,
        warnAutomation: true,
        warnMuteLimit: 3,
        warnKickLimit: 5,
        warnBanLimit: 10,
        slowmode: "off",
        economyEnabled: true,
        currencySymbol: "🪙",
        startingBalance: 100,
        dailyReward: 50,
        levelingEnabled: true,
        xpRate: "1.0",
        welcomeEnabled: true,
        welcomeChannel: "",
        welcomeMsg: "Bienvenue {user} sur notre serveur {server_name} ! Amuse-toi bien."
      }
    }
  });

  const updateSettings = async (newSettings: Partial<any>) => {
    // Optimistic UI update
    mutate({ settings: { ...data?.settings, ...newSettings } }, false);
    
    // API request
    try {
      const res = await fetch(`/api/server/${serverId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (!res.ok) throw new Error('Failed to update');
      const result = await res.json();
      mutate({ settings: result.settings }, false);
    } catch (e) {
      console.error(e);
      // Revert on error by revalidating
      mutate();
    }
  };

  return {
    settings: data?.settings || {},
    isLoading: !error && !data,
    isError: error,
    updateSettings
  };
}
