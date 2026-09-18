import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { ChatView } from './components/views/ChatView';
import { ProjectsView } from './components/views/ProjectsView';
import { AgentsView } from './components/views/AgentsView';
import { SkillsPluginsView } from './components/views/SkillsPluginsView';
import { TerminalView } from './components/views/TerminalView';
import { GitGitHubView } from './components/views/GitGitHubView';
import { SettingsView } from './components/views/SettingsView';
import { AutomationView } from './components/views/AutomationView';
import { UsageReportsView } from './components/views/UsageReportsView';
import { MCPIntegrationsView } from './components/views/MCPIntegrationsView';
import { FileManagerView } from './components/views/FileManagerView';

const MainLayout: React.FC = () => {
  const { activeView, language } = useApp();
  const isArabic = language === 'ar';

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'chat':
        return <ChatView />;
      case 'projects':
        return <ProjectsView />;
      case 'agents':
        return <AgentsView />;
      case 'skills':
      case 'plugins':
      case 'tools':
        return <SkillsPluginsView />;
      case 'terminal':
        return <TerminalView />;
      case 'github':
        return <GitGitHubView />;
      case 'automation':
        return <AutomationView />;
      case 'usage':
      case 'reports':
        return <UsageReportsView />;
      case 'mcps':
        return <MCPIntegrationsView />;
      case 'files':
        return <FileManagerView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#081017] text-slate-100 flex flex-col selection:bg-orange-500/30 selection:text-orange-200">
      <Header />
      
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />

        {/* Main Content Area offset by Sidebar width on lg screens */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          isArabic ? 'lg:mr-64' : 'lg:ml-64'
        }`}>
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
