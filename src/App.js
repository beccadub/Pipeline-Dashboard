import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const App = () => {
  const [selectedMetro, setSelectedMetro] = useState('santa-clara');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const availableMetros = [
    { id: 'santa-clara', name: 'Santa Clara County', display: 'Santa Clara' },
    { id: 'austin', name: 'Austin, TX', display: 'Austin Metro' }
  ];

  useEffect(() => {
    const loadMetroData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [projectsRes, analyticsRes, configRes] = await Promise.all([
          fetch(`/data/metros/${selectedMetro}/projects.json`),
          fetch(`/data/metros/${selectedMetro}/analytics.json`),
          fetch(`/data/metros/${selectedMetro}/config.json`)
        ]);
        
        if (!projectsRes.ok || !analyticsRes.ok || !configRes.ok) {
          throw new Error('Failed to load data');
        }
        
        const projects = await projectsRes.json();
        const analytics = await analyticsRes.json();
        const config = await configRes.json();
        
        setDashboardData({ projects, analytics, config });
      } catch (error) {
        console.error('Failed to load metro data:', error);
        setError(`Failed to load data for ${availableMetros.find(m => m.id === selectedMetro)?.display}`);
      } finally {
        setLoading(false);
      }
    };

    loadMetroData();
  }, [selectedMetro]);

  const exportToPDF = () => {
    if (!dashboardData?.projects) return;
    
    const doc = new jsPDF();
    const metroName = availableMetros.find(m => m.id === selectedMetro)?.display;
    
    doc.setFontSize(16);
    doc.text(`${metroName} Property Data Report`, 20, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
    
    const tableData = dashboardData.projects.map(project => [
      project.project_name,
      project.address,
      project.submarket,
      project.units.toString(),
      project.stage,
      project.estimated_delivery,
      project.developer
    ]);

    doc.autoTable({
      head: [['Project Name', 'Address', 'Submarket', 'Units', 'Stage', 'Est. Delivery', 'Developer']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });

    doc.save(`${metroName.replace(' ', '-')}-property-data-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading {availableMetros.find(m => m.id === selectedMetro)?.display} data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-400 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const analytics = dashboardData?.analytics || {};
  const projects = dashboardData?.projects || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold">Multifamily Construction Pipeline Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Last Updated: {dashboardData?.config?.last_updated || 'Unknown'}</p>
      </div>

      {/* Metro Selector */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex space-x-4">
          {availableMetros.map(metro => (
            <button
              key={metro.id}
              onClick={() => setSelectedMetro(metro.id)}
              className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                selectedMetro === metro.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {metro.display}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Evidence Index */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Evidence Index</h2>
            <button
              onClick={exportToPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
            >
              <Download size={16} />
              <span>Export Property Data PDF</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{analytics.total_units?.toLocaleString()}</div>
              <div className="text-gray-400 text-sm mt-1">Total Units in Pipeline</div>
              <div className="text-xs text-green-400 mt-1">{analytics.total_projects} total projects</div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-400">{analytics.units_next_12_months?.toLocaleString()}</div>
              <div className="text-gray-400 text-sm mt-1">Units Delivering Next 12 Months</div>
              <div className="text-xs text-blue-400 mt-1">Major projects accelerating</div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">{analytics.average_occupancy_rate}%</div>
              <div className="text-gray-400 text-sm mt-1">Current Occupancy Rate</div>
              <div className="text-xs text-yellow-400 mt-1">Market average</div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-orange-400">{analytics.largest_project_units?.toLocaleString()}</div>
              <div className="text-gray-400 text-sm mt-1">Largest Single Project</div>
              <div className="text-xs text-gray-500 mt-1">Units</div>
            </div>
          </div>

          {/* Pipeline by Stage */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analytics.pipeline_by_stage || {}).map(([stage, units]) => (
              <div key={stage} className="bg-gray-800 p-4 rounded-lg border border-blue-600">
                <div className="text-2xl font-bold text-blue-400">{units?.toLocaleString()}</div>
                <div className="text-gray-400 text-sm">{stage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Analytics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Market Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pipeline by Stage Detailed */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Pipeline by Stage</h3>
              <div className="space-y-4">
                {Object.entries(analytics.pipeline_by_stage || {}).map(([stage, units]) => {
                  const percentage = analytics.total_units ? (units / analytics.total_units * 100).toFixed(0) : 0;
                  const stageColors = {
                    'Planning': 'bg-yellow-500',
                    'Approved': 'bg-blue-500',
                    'Under Construction': 'bg-red-500'
                  };
                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <span className="text-sm">{stage}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-700 rounded-full h-3">
                          <div 
                            className={`${stageColors[stage] || 'bg-gray-500'} h-3 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm w-16">{units?.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Submarkets */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Top Submarkets by Units</h3>
              <div className="space-y-3">
                {Object.entries(analytics.submarket_distribution || {})
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([submarket, units]) => {
                    const percentage = analytics.total_units ? (units / analytics.total_units * 100).toFixed(0) : 0;
                    return (
                      <div key={submarket} className="flex justify-between items-center">
                        <span className="text-sm">{submarket}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full" 
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm">{units?.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        {/* Submarket Risk Analysis & Developer Concentration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submarket Risk Analysis */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Submarket Risk Analysis</h3>
            <div className="space-y-4">
              {Object.entries(analytics.submarket_distribution || {})
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([submarket, units]) => {
                  const concentration = analytics.total_units ? (units / analytics.total_units * 100).toFixed(1) : 0;
                  let riskLevel = 'Low';
                  let riskColor = 'text-green-400';
                  
                  if (concentration > 30) {
                    riskLevel = 'High';
                    riskColor = 'text-red-400';
                  } else if (concentration > 20) {
                    riskLevel = 'Medium';
                    riskColor = 'text-yellow-400';
                  }
                  
                  return (
                    <div key={submarket} className="flex justify-between items-center py-2">
                      <div>
                        <div className="font-medium text-sm text-white">{submarket}</div>
                        <div className="text-xs text-gray-400">{units?.toLocaleString()} pipeline / {concentration}% of total</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${riskColor}`}>{riskLevel}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Developer Concentration */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Developer Concentration</h3>
            <div className="space-y-3">
              {Object.entries(analytics.top_developers || {})
                .slice(0, 5)
                .map(([developer, units]) => {
                  const percentage = analytics.total_units ? (units / analytics.total_units * 100).toFixed(1) : 0;
                  return (
                    <div key={developer} className="flex justify-between">
                      <span className="text-sm text-white truncate mr-4">{developer}</span>
                      <span className="text-blue-400 font-semibold text-sm">
                        {units?.toLocaleString()} units ({percentage}%)
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
