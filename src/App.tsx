import React, { useState, useEffect } from 'react';
import { ScamAnalysisReport, DemoScamExample } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HelplineModal } from './components/HelplineModal';
import { AuthModal } from './components/AuthModal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomeView } from './views/HomeView';
import { AnalyzeView } from './views/AnalyzeView';
import { DashboardView } from './views/DashboardView';
import { HistoryView } from './views/HistoryView';
import { HowItWorksView } from './views/HowItWorksView';
import { AboutView } from './views/AboutView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import {
  saveUserReportToCloud,
  fetchUserReportsFromCloud,
  deleteUserReportFromCloud,
} from './lib/firestoreService';

const LOCAL_STORAGE_KEY = 'scam_shield_analysis_history';

function MainApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [history, setHistory] = useState<ScamAnalysisReport[]>([]);
  const [selectedDemo, setSelectedDemo] = useState<DemoScamExample | null>(null);
  const [helplineModalOpen, setHelplineModalOpen] = useState<boolean>(false);

  // Sync reports when user logs in or out
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (user) {
        // Authenticated user: Load from Firestore
        try {
          const cloudReports = await fetchUserReportsFromCloud(user.uid);
          if (isMounted) {
            // Also merge with any local session items that haven't been synced
            const localStored = localStorage.getItem(LOCAL_STORAGE_KEY);
            let localItems: ScamAnalysisReport[] = [];
            if (localStored) {
              try {
                localItems = JSON.parse(localStored);
              } catch (e) {
                // Ignore parse errors
              }
            }

            // Sync any unsynced local reports to Firestore in the background
            const cloudIds = new Set(cloudReports.map((r) => r.id));
            for (const item of localItems) {
              if (!cloudIds.has(item.id)) {
                saveUserReportToCloud(user.uid, item).catch(() => {});
                cloudReports.push(item);
              }
            }

            // Sort by timestamp desc
            cloudReports.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            setHistory(cloudReports);
          }
        } catch (err) {
          console.warn('Error syncing cloud history:', err);
        }
      } else {
        // Unauthenticated: load from LocalStorage
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && isMounted) {
              setHistory(parsed);
            }
          } else if (isMounted) {
            setHistory([]);
          }
        } catch (e) {
          console.warn('Failed to load history from LocalStorage', e);
        }
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Save report to history (and Firestore if logged in)
  const handleSaveToHistory = async (newReport: ScamAnalysisReport) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newReport.id);
      const updated = [newReport, ...filtered];

      // Always save copy to LocalStorage for offline capability
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
      } catch (e) {
        console.warn('Failed to persist history to LocalStorage', e);
      }

      return updated;
    });

    // If user is authenticated, save securely to Firestore
    if (user) {
      try {
        await saveUserReportToCloud(user.uid, newReport);
      } catch (err) {
        console.warn('Could not save report to Firestore cloud:', err);
      }
    }
  };

  const handleClearHistory = async () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear LocalStorage history', e);
    }

    // Also delete from Firestore if logged in
    if (user) {
      try {
        for (const item of history) {
          deleteUserReportFromCloud(user.uid, item.id).catch(() => {});
        }
      } catch (err) {
        console.warn('Failed to clear Firestore reports', err);
      }
    }
  };

  const handleTryDemo = (demo: DemoScamExample) => {
    setSelectedDemo(demo);
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnalyzeNow = () => {
    setSelectedDemo(null);
    setActiveTab('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* SaaS Cyber Background Mesh */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,116,144,0.15),rgba(255,255,255,0))] pointer-events-none" />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHelpline={() => setHelplineModalOpen(true)}
      />

      {/* Main Container Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'home' && (
          <HomeView
            onAnalyzeNow={handleAnalyzeNow}
            onTryDemo={handleTryDemo}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'analyze' && (
          <AnalyzeView
            initialDemo={selectedDemo}
            onSaveToHistory={handleSaveToHistory}
            onClearInitialDemo={() => setSelectedDemo(null)}
          />
        )}

        {/* Protected Dashboard Route */}
        {activeTab === 'dashboard' && (
          <ProtectedRoute
            featureName="Threat Intelligence Dashboard"
            fallbackTitle="Sign In to Access Security Dashboard"
            fallbackDescription="The Security Dashboard provides real-time threat trend charts, risk distributions, and telemetry. Sign in with Google or your email to view authenticated metrics and synced telemetry."
          >
            <DashboardView
              history={history}
              onSelectReport={() => {
                setActiveTab('history');
              }}
              onNavigateToAnalyze={handleAnalyzeNow}
            />
          </ProtectedRoute>
        )}

        {/* Protected Forensic History Route */}
        {activeTab === 'history' && (
          <ProtectedRoute
            featureName="Forensic Storage & Scan History"
            fallbackTitle="Sign In to Access Saved Forensic Scans"
            fallbackDescription="Your scan history is protected with end-to-end user isolation on Firebase Firestore. Sign in to review past threat assessments, download forensic PDFs, or inspect suspicious links."
          >
            <HistoryView
              history={history}
              onClearHistory={handleClearHistory}
              onNavigateToAnalyze={handleAnalyzeNow}
            />
          </ProtectedRoute>
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksView onNavigateToAnalyze={handleAnalyzeNow} />
        )}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Emergency Helpline Modal */}
      <HelplineModal
        isOpen={helplineModalOpen}
        onClose={() => setHelplineModalOpen(false)}
      />

      {/* Firebase Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
