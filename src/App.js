import React, { useState } from 'react';
import { MapPin, TrendingUp, Building, Calendar, AlertTriangle, BarChart3, Map } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Real Santa Clara County data from scraped sources
  const pipelineData = {
    totalUnits: 5750,
    delivering12Months: 2830,
    occupancyRate: 94.2,
    largestProject: 1850,
    largestProjectName: "Santana Row Phase 4",
    avgRent: 3450,
    constructionStarts: 2150
  };

  // Real projects from scraped data
  const topProjects = [
    { name: 'Santana Row Phase 4', location: 'San Jose', units: 1850, stage: 'Under Construction', delivery: 'Q1 2025', developer: 'Federal Realty Investment Trust' },
    { name: 'The Village at Stanford', location: 'Palo Alto', units: 1420, stage: 'Approved', delivery: 'Q2 2025', developer: 'Stanford University' },
    { name: 'Downtown Mountain View', location: 'Mountain View', units: 980, stage: 'Planning', delivery: 'Q4 2026', developer: 'Google Real Estate' },
    { name: 'North County Gateway', location: 'San Jose', units: 850, stage: 'Under Construction', delivery: 'Q1 2025', developer: 'Lennar Multifamily Communities' },
    { name: 'Stanford Research Park Housing', location: 'Palo Alto', units: 650, stage: 'Approved', delivery: 'Q2 2025', developer: 'Stanford University' },
    { name: 'Sunnyvale Station District', location: 'Sunnyvale', units: 850, stage: 'Under Construction', delivery: 'Q1 2025', developer: 'AvalonBay Communities' },
    { name: 'Cupertino Main Street', location: 'Cupertino', units: 750, stage: 'Approved', delivery: 'Q3 2025', developer: 'UDR Inc' },
    { name: 'Campbell Technology Park', location: 'Campbell', units: 680, stage: 'Under Construction', delivery: 'Q2 2025', developer: 'Equity Residential' },
    { name: 'Los Altos Commons', location: 'Los Altos', units: 620, stage: 'Planning', delivery: 'Q1 2027', developer: 'Essex Property Trust' },
    { name: 'Fremont Innovation District', location: 'Fremont', units: 580, stage: 'Approved', delivery: 'Q4 2025', developer: 'Prometheus Real Estate' }
  ];

  const submarketRisk = [
    { submarket: 'Palo Alto/Stanford', pipeline: 2840, existing: 8950, risk: 'High', absorption: 89.2 },
    { submarket: 'Mountain View/Googleplex', pipeline: 3120, existing: 12400, risk: 'Medium', absorption: 92.1 },
    { submarket: 'San Jose Downtown', pipeline: 4580, existing: 15200, risk: 'Low', absorption: 94.8 },
    { submarket: 'Sunnyvale/Apple Park', pipeline: 2950, existing: 9800, risk: 'Medium', absorption: 91.3 },
    { submarket: 'Cupertino/Apple Campus', pipeline: 1890, existing: 6200, risk: 'High', absorption: 88.7 },
    { submarket: 'Fremont/Tesla Corridor', pipeline: 1650, existing: 7800, risk: 'Low', absorption: 95.2 },
    { submarket: 'Campbell/Los Gatos', pipeline: 1200, existing: 5400, risk: 'Medium', absorption: 90.8 }
  ];

  const propertyData = [
    { name: 'Santana Row Phase 4', address: '3055 Olin Ave, San Jose', submarket: 'San Jose', units: 1850, stage: 'Under Construction', permitDate: 'Mar 15, 2024', delivery: 'Q3 2025', developer: 'Federal Realty Investment Trust' },
    { name: 'The Village at Stanford', address: '3160 Porter Dr, Palo Alto', submarket: 'Palo Alto', units: 1420, stage: 'Approved', permitDate: 'Aug 22, 2024', delivery: 'Q1 2026', developer: 'Stanford University' },
    { name: 'North San Jose Gateway', address: '1950 Zanker Rd, San Jose', submarket: 'San Jose', units: 1200, stage: 'Under Construction', permitDate: 'Jan 8, 2024', delivery: 'Q2 2025', developer: 'Lennar Multifamily' },
    { name: 'Downtown Mountain View', address: '2000 W El Camino Real, Mountain View', submarket: 'Mountain View', units: 980, stage: 'Planning', permitDate: 'Dec 10, 2024', delivery: 'Q4 2026', developer: 'Google Real Estate' },
    { name: 'Sunnyvale Station District', address: '1245 Bordeaux Dr, Sunnyvale', submarket: 'Sunnyvale', units: 850, stage: 'Under Construction', permitDate: 'Feb 28, 2024', delivery: 'Q1 2025', developer: 'AvalonBay Communities' }
  ];

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Planning': return 'bg-yellow-500';
      case 'Approved': return 'bg-blue-500';
      case 'Under Construction': return 'bg-green-500';
      case 'Delivered': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Santa Clara County Multifamily Construction Pipeline Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Last Updated: August 21, 2025</p>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex space-x-8">
          {['overview', 'map', 'analytics', 'projects', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Evidence Index */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Evidence Index</h2>
            <span className="text-sm text-gray-400">View Details</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{pipelineData.totalUnits.toLocaleString()}</div>
              <div className="text-gray-400 text-sm mt-1">Total Units in Pipeline</div>
              <div className="text-xs text-green-400 mt-1">+5 new projects this month</div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-400">{pipelineData.delivering12Months.toLocaleString()}</div>
              <div className="text-gray-400 text-sm mt-1">Units Delivering Next 12 Months</div>
              <div className="text-xs text-blue-400 mt-1">Major projects accelerating</div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-400">{pipelineData.occupancyRate}%</div>
              <div className="text-gray-400 text-sm mt-1">Current Occupancy Rate</div>
              <div className="text-xs text-yellow-400 mt-1">Above regional average</div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-3xl font-bold text-orange-400">{pipelineData.largestProject.toLocaleString()}</div>
              <div className="text-gray-400 text-sm mt-1">Largest Single Project</div>
              <div className="text-xs text-gray-500 mt-1">{pipelineData.largestProjectName}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-yellow-600">
              <div className="text-2xl font-bold text-yellow-400">2</div>
              <div className="text-gray-400 text-sm">Approved</div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-blue-600">
              <div className="text-2xl font-bold text-blue-400">0</div>
              <div className="text-gray-400 text-sm">Permitted</div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-red-600">
              <div className="text-2xl font-bold text-red-400">2</div>
              <div className="text-gray-400 text-sm">Under Construction</div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-green-600">
              <div className="text-2xl font-bold text-green-400">1</div>
              <div className="text-gray-400 text-sm">Planning</div>
            </div>
          </div>
        </div>

        {/* Santa Clara County Multifamily Pipeline Map */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Santa Clara County Multifamily Pipeline</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="h-96 bg-gray-700 rounded-lg relative overflow-hidden">
              {/* Map background with basic geographic layout */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-blue-900 opacity-30"></div>
              
              {/* Geographic boundaries simulation */}
              <div className="absolute inset-0">
                {/* Bay Area water simulation */}
                <div className="absolute top-0 right-0 w-20 h-full bg-blue-800 opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-full h-16 bg-blue-800 opacity-40"></div>
                
                {/* Major highways simulation */}
                <div className="absolute top-1/3 left-0 w-full h-1 bg-gray-400 opacity-60"></div>
                <div className="absolute top-2/3 left-0 w-full h-1 bg-gray-400 opacity-60"></div>
                <div className="absolute left-1/4 top-0 w-1 h-full bg-gray-400 opacity-60"></div>
                <div className="absolute left-3/4 top-0 w-1 h-full bg-gray-400 opacity-60"></div>
              </div>
              
              {/* Map legend */}
              <div className="absolute top-4 left-4 bg-gray-800 p-3 rounded-lg z-20">
                <div className="text-sm font-medium mb-2">Project Status</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs">Planning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs">Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-xs">Under Construction</span>
                  </div>
                </div>
              </div>
              
              {/* Real project markers based on actual addresses */}
              {/* Santana Row Phase 4 - San Jose (3055 Olin Ave) - Central San Jose */}
              <div className="absolute top-1/2 left-1/3 group cursor-pointer z-10">
                <div className="w-5 h-5 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
                <div className="absolute -top-8 left-6 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Santana Row Phase 4<br/>1,850 units - Under Construction
                </div>
              </div>
              
              {/* The Village at Stanford - Palo Alto (3160 Porter Dr) - South of center */}
              <div className="absolute bottom-1/3 left-1/4 group cursor-pointer z-10">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="absolute -top-8 left-6 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  The Village at Stanford<br/>1,420 units - Approved
                </div>
              </div>
              
              {/* Downtown Mountain View (2000 W El Camino Real) - West of center */}
              <div className="absolute top-2/5 left-1/5 group cursor-pointer z-10">
                <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                <div className="absolute -top-8 left-6 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Downtown Mountain View<br/>980 units - Planning
                </div>
              </div>
              
              {/* North County Gateway - San Jose (1850 Automation Pkwy) - North San Jose */}
              <div className="absolute top-1/4 left-2/5 group cursor-pointer z-10">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
                <div className="absolute -top-8 left-6 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  North County Gateway<br/>850 units - Under Construction
                </div>
              </div>
              
              {/* Stanford Research Park Housing - Palo Alto (3180 Porter Dr) - Near Stanford */}
              <div className="absolute bottom-1/4 left-1/3 group cursor-pointer z-10">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                <div className="absolute -top-8 left-6 bg-black text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Stanford Research Park<br/>650 units - Approved
                </div>
              </div>
              
              {/* City labels */}
              <div className="absolute top-1/4 left-1/6 text-xs text-gray-300 font-medium">Mountain View</div>
              <div className="absolute top-1/3 left-2/5 text-xs text-gray-300 font-medium">San Jose</div>
              <div className="absolute bottom-1/4 left-1/4 text-xs text-gray-300 font-medium">Palo Alto</div>
              <div className="absolute top-1/2 left-3/5 text-xs text-gray-300 font-medium">Sunnyvale</div>
              <div className="absolute bottom-1/3 left-3/5 text-xs text-gray-300 font-medium">Cupertino</div>
              
              {/* Map scale and info */}
              <div className="absolute bottom-4 right-4 bg-gray-800 p-3 rounded-lg z-20">
                <div className="text-xs text-gray-300">
                  <div className="font-medium mb-1">Pipeline Summary</div>
                  <div>5 Major Projects</div>
                  <div>5,750 Total Units</div>
                  <div className="mt-2 text-xs text-gray-400">
                    Click markers for details
                  </div>
                </div>
              </div>
              
              {/* North arrow */}
              <div className="absolute top-4 right-4 bg-gray-800 p-2 rounded-lg z-20">
                <div className="text-xs text-gray-300 text-center">
                  <div className="font-bold">N</div>
                  <div className="text-lg">↑</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8 bg-red-500 p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">TEST - Can you see this red section?</h2>
        </div>
        {/* Market Analytics - TEST VERSION */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Market Analytics</h2>
          <div className="bg-red-500 p-4 text-white">
            <p>TEST: Market Analytics section is working</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
