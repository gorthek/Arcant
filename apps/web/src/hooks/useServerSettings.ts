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
        dailyReward: 250,
        dailyRewardCoins: 250,
        dailyRewardXp: 100,
        dailyStreakMultiplier: 1.2,
        questsConfig: [
          { id: "q1", title: "Bavard du Serveur", desc: "Envoyer 50 messages dans les salons textuels.", target: 50, rewardCoins: 300, rewardXp: 150, category: "Textuel" },
          { id: "q2", title: "Habitué du Vocal", desc: "Passer 2h dans les salons vocaux du serveur.", target: 2, rewardCoins: 500, rewardXp: 300, category: "Vocal" },
          { id: "q3", title: "Soutien des Idées", desc: "Voter pour 2 suggestions sur le dashboard.", target: 2, rewardCoins: 200, rewardXp: 100, category: "Dashboard" }
        ],
        battlepassConfig: [
          { tier: 1, reward: "100 💰", unlocked: true },
          { tier: 2, reward: "Badge 🌟", unlocked: true },
          { tier: 3, reward: "250 XP", unlocked: true },
          { tier: 4, reward: "500 💰", unlocked: true },
          { tier: 5, reward: "Rôle VIP (7j)", unlocked: false },
          { tier: 6, reward: "1000 XP", unlocked: false },
          { tier: 7, reward: "Titre Exclusif", unlocked: false },
          { tier: 8, reward: "750 💰", unlocked: false },
          { tier: 9, reward: "Coffre Rare 🎁", unlocked: false },
          { tier: 10, reward: "Badge Légende 🔥", unlocked: false },
          { tier: 11, reward: "1500 💰 + Titre Supreme", unlocked: false },
          { tier: 12, reward: "Aura Néon Discord ⚡", unlocked: false }
        ],
        craftingRecipes: [
          { id: "c1", name: "Badge Alchimiste 🧪", costCoins: 500, costFragments: 2, rewardType: "Badge Alchimiste 🧪" },
          { id: "c2", name: "Rôle Cyber VIP (30j) 👑", costCoins: 2500, costFragments: 5, rewardType: "Rôle Cyber VIP 👑" },
          { id: "c3", name: "Titre Légendaire ✨", costCoins: 1000, costFragments: 3, rewardType: "Titre Légendaire ✨" }
        ],
        minigamesConfig: {
          wheelCost: 50,
          wheelRewards: ["+150 Coins 💰", "+300 XP ⭐", "Badge Chanceux 🍀", "+500 Coins 💎", "+100 XP ⚡"],
          coinflipMaxBet: 1000
        },
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
