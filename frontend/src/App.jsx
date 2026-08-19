import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import RecommendationFeed from './components/RecommendationFeed';
import CampaignSummaryDashboard from './components/CampaignSummaryDashboard';
import HeatmapView from './components/HeatmapView';
import FatigueTimelineView from './components/FatigueTimelineView';
import MonthlyPerformanceTrackerView from './components/MonthlyPerformanceTrackerView';
import DecisionHistoryTrackerView from './components/DecisionHistoryTrackerView';
import CrossProductBundlesView from './components/CrossProductBundlesView';
import BusinessArchitectureView from './components/BusinessArchitectureView';
import ChatbotWidget from './components/ChatbotWidget';
import ProductAssessmentModal from './components/ProductAssessmentModal';
import UserProfileModal from './components/UserProfileModal';

const API_BASE = 'http://localhost:5001/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('FEED'); // 'FEED', 'SUMMARY', 'HEATMAP', 'FATIGUE', 'MONTHLY_PERFORMANCE', 'DECISION_HISTORY'
  const [persona, setPersona] = useState('MARKETING');
  const [activeDatasetId, setActiveDatasetId] = useState('SYNTHETIC');
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [fatigueData, setFatigueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessmentItem, setSelectedAssessmentItem] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Sravanthi',
    email: 'sravanthi.malothu@promoalign.ai',
    role: 'Admin / Category Lead',
    regionFocus: 'ALL',
    currency: 'INR',
    alerts: {
      stockout: true,
      margin: true,
      fatigue: true
    }
  });

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [recsRes, sumRes, heatRes, fatRes] = await Promise.all([
        fetch(`${API_BASE}/recommendations`),
        fetch(`${API_BASE}/campaign/summary`),
        fetch(`${API_BASE}/analytics/heatmap`),
        fetch(`${API_BASE}/analytics/fatigue`)
      ]);

      const recsJson = await recsRes.json();
      const sumJson = await sumRes.json();
      const heatJson = await heatRes.json();
      const fatJson = await fatRes.json();

      if (recsJson.activeDatasetId) {
        setActiveDatasetId(recsJson.activeDatasetId);
      }

      setRecommendations(recsJson.recommendations || []);
      setSummary(sumJson);
      setHeatmapData(heatJson.heatmap || []);
      setFatigueData(fatJson.segmentFatigue || []);
    } catch (err) {
      console.error('Error connecting to PromoAlign backend:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectDataset = async (datasetId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/datasets/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to select dataset:', err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic local update
    setRecommendations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const res = await fetch(`${API_BASE}/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData(true);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      fetchData(true);
    }
  };

  const handleDiscountChange = async (id, discount_pct) => {
    try {
      const res = await fetch(`${API_BASE}/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discount_pct })
      });
      if (res.ok) {
        fetchData(true);
      }
    } catch (err) {
      console.error('Failed to update discount:', err);
    }
  };

  const handleAddNote = async (id, noteText) => {
    try {
      const res = await fetch(`${API_BASE}/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText })
      });
      if (res.ok) {
        fetchData(true);
      }
    } catch (err) {
      console.error('Failed to post note:', err);
    }
  };

  const handleBulkApproveHealthy = async () => {
    const healthyDrafts = recommendations.filter(
      (r) => r.constraintEval.riskLevel === 'HEALTHY' && r.status === 'DRAFT'
    );

    // Optimistic local update
    setRecommendations((prev) =>
      prev.map((r) =>
        r.constraintEval.riskLevel === 'HEALTHY' && r.status === 'DRAFT'
          ? { ...r, status: 'APPROVED' }
          : r
      )
    );

    await Promise.all(
      healthyDrafts.map((r) =>
        fetch(`${API_BASE}/recommendations/${r.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'APPROVED' })
        })
      )
    );

    fetchData(true);
  };

  const handleNLSearch = async (queryStr) => {
    try {
      const res = await fetch(`${API_BASE}/nl-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryStr })
      });
      const data = await res.json();
      
      const params = new URLSearchParams(data.filters);
      const recsRes = await fetch(`${API_BASE}/recommendations?${params.toString()}`);
      const recsJson = await recsRes.json();
      setRecommendations(recsJson.recommendations || []);
    } catch (err) {
      console.error('NL Search failed:', err);
    }
  };

  const handleResetDataset = async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/dataset/reset`, { method: 'POST' });
      fetchData();
    } catch (err) {
      console.error('Dataset reset failed:', err);
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!summary || !summary.approvedItems || summary.approvedItems.length === 0) return;

    const headers = [
      'Product Name',
      'Category',
      'Target Segment',
      'Region',
      'Discount %',
      'Fit Score',
      'Projected Revenue Lift ($)',
      'Post-Promo Margin (%)',
      'Risk Level',
      'Dataset Source'
    ];

    const rows = summary.approvedItems.map((item) => [
      `"${item.product_name}"`,
      `"${item.category}"`,
      `"${item.segment_name}"`,
      `"${item.region}"`,
      `${item.discount_pct}%`,
      item.metrics.fitScore,
      item.metrics.projectedRevenue,
      `${(item.metrics.marginPctAfterDiscount * 100).toFixed(1)}%`,
      `"${item.constraintEval.riskLevel}"`,
      `"${item.dataset_source || summary.datasetName || 'Retail Dataset'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PromoAlign_Approved_Campaign_Plan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex bg-[#F4F6FA] font-sans relative">
      
      {/* Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <Navbar
          persona={persona}
          setPersona={setPersona}
          activeDatasetId={activeDatasetId}
          onSelectDataset={handleSelectDataset}
          summary={summary}
          onResetDataset={handleResetDataset}
          onGlobalSearch={(q) => handleNLSearch(q)}
          userProfile={userProfile}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
          {loading ? (
            <div className="saas-card p-16 text-center space-y-4 my-8">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h3 className="text-base font-bold text-slate-900">Loading {summary?.datasetName || 'Retail Dataset'}...</h3>
              <p className="text-xs text-slate-500">Parsing transactional records, store promos, customer segments, and demand indices.</p>
            </div>
          ) : (
            <>
              {activeTab === 'FEED' && (
                <RecommendationFeed
                  recommendations={recommendations}
                  summary={summary}
                  onStatusChange={handleStatusChange}
                  onDiscountChange={handleDiscountChange}
                  onAddNote={handleAddNote}
                  onBulkApproveHealthy={handleBulkApproveHealthy}
                  onNLSearch={handleNLSearch}
                  onInspectAssessment={(item) => setSelectedAssessmentItem(item)}
                />
              )}

              {activeTab === 'BUSINESS_TREE' && (
                <BusinessArchitectureView />
              )}

              {activeTab === 'CROSS_PRODUCT_BUNDLES' && (
                <CrossProductBundlesView />
              )}

              {activeTab === 'DECISION_HISTORY' && (
                <DecisionHistoryTrackerView />
              )}

              {activeTab === 'MONTHLY_PERFORMANCE' && (
                <MonthlyPerformanceTrackerView />
              )}

              {activeTab === 'SUMMARY' && (
                <CampaignSummaryDashboard
                  summary={summary}
                  onExportCSV={handleExportCSV}
                  onStatusChange={handleStatusChange}
                />
              )}

              {activeTab === 'HEATMAP' && (
                <HeatmapView heatmapData={heatmapData} />
              )}

              {activeTab === 'FATIGUE' && (
                <FatigueTimelineView fatigueData={fatigueData} />
              )}
            </>
          )}
        </main>

        <footer className="border-t border-slate-200 py-3 text-center text-xs text-slate-400 bg-white">
          PromoAlign — AI-Driven Personalized Promotion & Inventory Alignment Planner • Dataset: {summary?.datasetName || 'Retail Benchmark'}
        </footer>

      </div>

      {/* Floating AI Retail Assistant Chatbot Widget */}
      <ChatbotWidget
        persona={persona}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onFilterRisk={(riskLevel) => handleNLSearch(riskLevel)}
        onFilterRegion={(region) => handleNLSearch(region)}
        onBulkApproveHealthy={handleBulkApproveHealthy}
        onExportCSV={handleExportCSV}
        onSelectDataset={handleSelectDataset}
      />

      {/* Product Assessment Modal */}
      {selectedAssessmentItem && (
        <ProductAssessmentModal
          item={selectedAssessmentItem}
          onClose={() => setSelectedAssessmentItem(null)}
        />
      )}

      {/* User Profile & Category Lead Settings Drawer */}
      {isProfileOpen && (
        <UserProfileModal
          userProfile={userProfile}
          onSaveProfile={(updated) => {
            setUserProfile(updated);
            if (updated.regionFocus && updated.regionFocus !== 'ALL') {
              handleNLSearch(updated.regionFocus);
            }
          }}
          onClose={() => setIsProfileOpen(false)}
          onExportAudit={handleExportCSV}
        />
      )}

    </div>
  );
}
