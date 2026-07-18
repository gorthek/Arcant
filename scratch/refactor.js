const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'apps/web/src/components/dashboard/roles/OwnerDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add imports
content = content.replace(
  'import ServerVisualEditor from \'./ServerVisualEditor\';',
  'import ServerVisualEditor from \'./ServerVisualEditor\';\nimport { useServerSettings } from "@/hooks/useServerSettings";\nimport { PremiumLockWrapper } from "@/components/dashboard/PremiumLockWrapper";'
);

// 2. Pass serverId to all modules
content = content.replace(/<ModuleSecurity \/>/g, '<ModuleSecurity serverId={serverId} />');
content = content.replace(/<ModuleModeration \/>/g, '<ModuleModeration serverId={serverId} />');
content = content.replace(/<ModuleTickets \/>/g, '<ModuleTickets serverId={serverId} />');
content = content.replace(/<ModuleEconomy \/>/g, '<ModuleEconomy serverId={serverId} />');
content = content.replace(/<ModuleLeveling \/>/g, '<ModuleLeveling serverId={serverId} />');
content = content.replace(/<ModuleWelcome \/>/g, '<ModuleWelcome serverId={serverId} />');

// 3. Remove global handleSave and isSaving from OwnerDashboard since we have auto-save
// We will just remove the Save button from the UI to match "Optimistic UI" auto-save design
content = content.replace(
  /<button\s+onClick=\{handleSave\}[\s\S]*?<\/button>/m,
  `{/* Auto-save enabled. No manual save button needed. */}`
);

// 4. Refactor ModuleSecurity
content = content.replace(
  /function ModuleSecurity\(\) \{[\s\S]*?return \(/m,
  `function ModuleSecurity({ serverId }: { serverId: string }) {
  const { settings, updateSettings } = useServerSettings(serverId);
  return (`
);
// replace ToggleSwitch in ModuleSecurity
content = content.replace(/enabled=\{raidMode\} setEnabled=\{setRaidMode\}/g, 'enabled={settings.raidMode} setEnabled={(val) => updateSettings({ raidMode: val })}');
content = content.replace(/enabled=\{captchaVerification\} setEnabled=\{setCaptchaVerification\}/g, 'enabled={settings.captchaVerification} setEnabled={(val) => updateSettings({ captchaVerification: val })}');
content = content.replace(/enabled=\{antiSelfbot\} setEnabled=\{setAntiSelfbot\}/g, 'enabled={settings.antiSelfbot} setEnabled={(val) => updateSettings({ antiSelfbot: val })}');
content = content.replace(/enabled=\{antiLink\} setEnabled=\{setAntiLink\}/g, 'enabled={settings.antiLink} setEnabled={(val) => updateSettings({ antiLink: val })}');
// replaces selects/inputs
content = content.replace(/value=\{accountAge\}\s+onChange=\{\(e\) => setAccountAge\(e.target.value\)\}/g, 'value={settings.accountAge} onChange={(e) => updateSettings({ accountAge: e.target.value })}');
content = content.replace(/value=\{mentionLimit\}\s+onChange=\{\(e\) => setMentionLimit\(e.target.value\)\}/g, 'value={settings.mentionLimit} onChange={(e) => updateSettings({ mentionLimit: e.target.value })}');
content = content.replace(/value=\{antiMassBan\}\s+onChange=\{\(e\) => setAntiMassBan\(parseInt\(e.target.value\) \|\| 0\)\}/g, 'value={settings.antiMassBan} onChange={(e) => updateSettings({ antiMassBan: parseInt(e.target.value) || 0 })}');


// 5. Refactor ModuleModeration
content = content.replace(
  /function ModuleModeration\(\) \{[\s\S]*?return \(/m,
  `function ModuleModeration({ serverId }: { serverId: string }) {
  const { settings, updateSettings } = useServerSettings(serverId);
  return (`
);
content = content.replace(/enabled=\{warnAutomation\} setEnabled=\{setWarnAutomation\}/g, 'enabled={settings.warnAutomation} setEnabled={(val) => updateSettings({ warnAutomation: val })}');
content = content.replace(/value=\{warnMuteLimit\}\s+onChange=\{\(e\) => setWarnMuteLimit\(parseInt\(e.target.value\) \|\| 0\)\}/g, 'value={settings.warnMuteLimit} onChange={(e) => updateSettings({ warnMuteLimit: parseInt(e.target.value) || 0 })}');
content = content.replace(/value=\{warnKickLimit\}\s+onChange=\{\(e\) => setWarnKickLimit\(parseInt\(e.target.value\) \|\| 0\)\}/g, 'value={settings.warnKickLimit} onChange={(e) => updateSettings({ warnKickLimit: parseInt(e.target.value) || 0 })}');
content = content.replace(/value=\{warnBanLimit\}\s+onChange=\{\(e\) => setWarnBanLimit\(parseInt\(e.target.value\) \|\| 0\)\}/g, 'value={settings.warnBanLimit} onChange={(e) => updateSettings({ warnBanLimit: parseInt(e.target.value) || 0 })}');
content = content.replace(/value=\{slowmode\}\s+onChange=\{\(e\) => setSlowmode\(e.target.value\)\}/g, 'value={settings.slowmode} onChange={(e) => updateSettings({ slowmode: e.target.value })}');
content = content.replace(/value=\{whitelist\}\s+onChange=\{\(e\) => setWhitelist\(e.target.value\)\}/g, 'value={settings.whitelist} onChange={(e) => updateSettings({ whitelist: e.target.value })}');
content = content.replace(/value=\{selectedLogsChannel\}\s+onChange=\{\(e\) => setSelectedLogsChannel\(e.target.value\)\}/g, 'value={settings.selectedLogsChannel} onChange={(e) => updateSettings({ selectedLogsChannel: e.target.value })}');

// 6. Refactor ModuleEconomy
content = content.replace(
  /function ModuleEconomy\(\) \{[\s\S]*?return \(/m,
  `function ModuleEconomy({ serverId }: { serverId: string }) {
  const { settings, updateSettings } = useServerSettings(serverId);
  return (`
);
content = content.replace(/economyEnabled/g, 'settings.economyEnabled');
content = content.replace(/enabled=\{settings\.settings\.economyEnabled\} setEnabled=\{setEconomyEnabled\}/g, 'enabled={settings.economyEnabled} setEnabled={(val) => updateSettings({ economyEnabled: val })}');
// Fix the double settings
content = content.replace(/settings\.settings\.economyEnabled/g, 'settings.economyEnabled');
content = content.replace(/value=\{currencySymbol\}\s+onChange=\{\(e\) => setCurrencySymbol\(e.target.value\)\}/g, 'value={settings.currencySymbol} onChange={(e) => updateSettings({ currencySymbol: e.target.value })}');
content = content.replace(/value=\{startingBalance\}\s+onChange=\{\(e\) => setStartingBalance\(parseInt\(e.target.value\) \|\| 0\)\}/g, 'value={settings.startingBalance} onChange={(e) => updateSettings({ startingBalance: parseInt(e.target.value) || 0 })}');
content = content.replace(/value=\{dailyReward\}\s+onChange=\{\(e\) => setDailyReward\(parseInt\(e.target.value\) \|\| 0\)\}/g, 'value={settings.dailyReward} onChange={(e) => updateSettings({ dailyReward: parseInt(e.target.value) || 0 })}');

// 7. Refactor ModuleLeveling
content = content.replace(
  /function ModuleLeveling\(\) \{[\s\S]*?return \(/m,
  `function ModuleLeveling({ serverId }: { serverId: string }) {
  const { settings, updateSettings } = useServerSettings(serverId);
  return (`
);
content = content.replace(/levelingEnabled/g, 'settings.levelingEnabled');
content = content.replace(/enabled=\{settings\.settings\.levelingEnabled\} setEnabled=\{setLevelingEnabled\}/g, 'enabled={settings.levelingEnabled} setEnabled={(val) => updateSettings({ levelingEnabled: val })}');
content = content.replace(/settings\.settings\.levelingEnabled/g, 'settings.levelingEnabled');
content = content.replace(/value=\{xpRate\}\s+onChange=\{\(e\) => setXpRate\(e.target.value\)\}/g, 'value={settings.xpRate} onChange={(e) => updateSettings({ xpRate: e.target.value })}');

// 8. Refactor ModuleWelcome
content = content.replace(
  /function ModuleWelcome\(\) \{[\s\S]*?return \(/m,
  `function ModuleWelcome({ serverId }: { serverId: string }) {
  const { settings, updateSettings } = useServerSettings(serverId);
  return (`
);
content = content.replace(/welcomeEnabled/g, 'settings.welcomeEnabled');
content = content.replace(/enabled=\{settings\.settings\.welcomeEnabled\} setEnabled=\{setWelcomeEnabled\}/g, 'enabled={settings.welcomeEnabled} setEnabled={(val) => updateSettings({ welcomeEnabled: val })}');
content = content.replace(/settings\.settings\.welcomeEnabled/g, 'settings.welcomeEnabled');
content = content.replace(/value=\{welcomeChannel\}\s+onChange=\{\(e\) => setWelcomeChannel\(e.target.value\)\}/g, 'value={settings.welcomeChannel} onChange={(e) => updateSettings({ welcomeChannel: e.target.value })}');
content = content.replace(/value=\{welcomeMsg\}\s+onChange=\{\(e\) => setWelcomeMsg\(e.target.value\)\}/g, 'value={settings.welcomeMsg} onChange={(e) => updateSettings({ welcomeMsg: e.target.value })}');


fs.writeFileSync(filePath, content, 'utf-8');
console.log('Refactoring complete');
