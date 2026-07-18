const fs = require('fs');
const file = 'apps/web/src/components/dashboard/roles/OwnerDashboard.tsx';
let code = fs.readFileSync(file, 'utf-8');

// Fix ModuleTickets signature
code = code.replace('function ModuleTickets() {', 'function ModuleTickets({ serverId }: { serverId: string }) {');

// Fix ModuleEconomy
code = code.replace('setEnabled={setEconomyEnabled}', 'setEnabled={(val) => updateSettings({ economyEnabled: val })}');

// Fix ModuleLeveling
code = code.replace('setEnabled={setLevelingEnabled}', 'setEnabled={(val) => updateSettings({ levelingEnabled: val })}');

// Fix ModuleWelcome
code = code.replace('setEnabled={setWelcomeEnabled}', 'setEnabled={(val) => updateSettings({ welcomeEnabled: val })}');

fs.writeFileSync(file, code);
console.log('Fixed OwnerDashboard.tsx props and undefined setters');
