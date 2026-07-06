import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  maxDateStr, 
  customersData, 
  thresholdStats, 
  channelsSummary, 
  zonesSummary, 
  productSegmentsSummary,
  productCategoriesSummary,
  cohortSummary 
} from './data';
import Chart from 'chart.js/auto';
import { 
  Users, 
  AlertTriangle, 
  TrendingDown, 
  Award, 
  Search, 
  Filter, 
  TrendingUp,
  MapPin,
  Share2,
  RefreshCw,
  ShoppingBag,
  Info,
  Layers,
  Tag
} from 'lucide-react';

function App() {
  const [threshold, setThreshold] = useState(60);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [zoneFilter, setZoneFilter] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [returnFilter, setReturnFilter] = useState('');
  const [sortField, setSortField] = useState('totalSpend');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reference date
  const referenceDate = new Date(maxDateStr);

  // Compute customer churn status dynamically based on current threshold slider
  const customers = useMemo(() => {
    return customersData.map(c => ({
      ...c,
      isChurned: c.daysInactive > threshold
    }));
  }, [threshold]);

  // Overall Churn Stats based on current threshold
  const stats = useMemo(() => {
    const total = customers.length;
    const churned = customers.filter(c => c.isChurned).length;
    const rate = ((churned / total) * 100).toFixed(2);
    
    // Find min and max channels
    const channels = {};
    customers.forEach(c => {
      if (!channels[c.channel]) channels[c.channel] = { total: 0, churned: 0 };
      channels[c.channel].total++;
      if (c.isChurned) channels[c.channel].churned++;
    });

    let minRate = 100, maxRate = 0;
    let minChannel = '', maxChannel = '';
    
    Object.entries(channels).forEach(([name, s]) => {
      const rate = (s.churned / s.total) * 100;
      if (rate < minRate) {
        minRate = rate;
        minChannel = name;
      }
      if (rate > maxRate) {
        maxRate = rate;
        maxChannel = name;
      }
    });

    // Highest risk product segment
    const segments = {};
    customers.forEach(c => {
      if (!segments[c.segment]) segments[c.segment] = { total: 0, churned: 0 };
      segments[c.segment].total++;
      if (c.isChurned) segments[c.segment].churned++;
    });
    
    let maxSegmentRate = 0;
    let worstSegment = '';
    Object.entries(segments).forEach(([name, s]) => {
      const rate = (s.churned / s.total) * 100;
      if (rate > maxSegmentRate) {
        maxSegmentRate = rate;
        worstSegment = name;
      }
    });

    return {
      total,
      churned,
      rate,
      minChannel,
      minRate: minRate.toFixed(1),
      maxChannel,
      maxRate: maxRate.toFixed(1),
      worstSegment,
      worstSegmentRate: maxSegmentRate.toFixed(1)
    };
  }, [customers]);

  // Chart References
  const channelChartRef = useRef(null);
  const zoneChartRef = useRef(null);
  const segmentChartRef = useRef(null);
  const categoryChartRef = useRef(null);
  const returnChartRef = useRef(null);

  // Chart Instances
  const channelChartInst = useRef(null);
  const zoneChartInst = useRef(null);
  const segmentChartInst = useRef(null);
  const categoryChartInst = useRef(null);
  const returnChartInst = useRef(null);

  // Update Charts on threshold change
  useEffect(() => {
    // Destroy existing instances to prevent duplicate renders
    if (channelChartInst.current) channelChartInst.current.destroy();
    if (zoneChartInst.current) zoneChartInst.current.destroy();
    if (segmentChartInst.current) segmentChartInst.current.destroy();
    if (categoryChartInst.current) categoryChartInst.current.destroy();
    if (returnChartInst.current) returnChartInst.current.destroy();

    // 1. Channel Churn Data
    const channels = {};
    customers.forEach(c => {
      if (!channels[c.channel]) channels[c.channel] = { total: 0, churned: 0 };
      channels[c.channel].total++;
      if (c.isChurned) channels[c.channel].churned++;
    });
    const channelLabels = Object.keys(channels);
    const channelActiveData = channelLabels.map(ch => channels[ch].total - channels[ch].churned);
    const channelChurnedData = channelLabels.map(ch => channels[ch].churned);

    const ctxChannel = channelChartRef.current.getContext('2d');
    channelChartInst.current = new Chart(ctxChannel, {
      type: 'bar',
      data: {
        labels: channelLabels,
        datasets: [
          {
            label: 'Active',
            data: channelActiveData,
            backgroundColor: 'rgba(6, 182, 212, 0.7)',
            borderColor: 'rgba(6, 182, 212, 1)',
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: 'Churned',
            data: channelChurnedData,
            backgroundColor: 'rgba(244, 63, 94, 0.7)',
            borderColor: 'rgba(244, 63, 94, 1)',
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } }
        },
        scales: {
          x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } }
        }
      }
    });

    // 2. Zone Churn Data
    const zones = {};
    customers.forEach(c => {
      if (!zones[c.zone]) zones[c.zone] = { total: 0, churned: 0 };
      zones[c.zone].total++;
      if (c.isChurned) zones[c.zone].churned++;
    });
    const zoneLabels = Object.keys(zones);
    const zoneActiveData = zoneLabels.map(z => zones[z].total - zones[z].churned);
    const zoneChurnedData = zoneLabels.map(z => zones[z].churned);

    const ctxZone = zoneChartRef.current.getContext('2d');
    zoneChartInst.current = new Chart(ctxZone, {
      type: 'bar',
      data: {
        labels: zoneLabels,
        datasets: [
          {
            label: 'Active',
            data: zoneActiveData,
            backgroundColor: 'rgba(168, 85, 247, 0.7)',
            borderColor: 'rgba(168, 85, 247, 1)',
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: 'Churned',
            data: zoneChurnedData,
            backgroundColor: 'rgba(244, 63, 94, 0.7)',
            borderColor: 'rgba(244, 63, 94, 1)',
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } }
        },
        scales: {
          x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } }
        }
      }
    });

    // 3. Segment Churn Data
    const segs = {};
    customers.forEach(c => {
      if (!segs[c.segment]) segs[c.segment] = { total: 0, churned: 0 };
      segs[c.segment].total++;
      if (c.isChurned) segs[c.segment].churned++;
    });
    const segmentLabels = Object.keys(segs);
    const segmentActiveData = segmentLabels.map(s => segs[s].total - segs[s].churned);
    const segmentChurnedData = segmentLabels.map(s => segs[s].churned);

    const ctxSeg = segmentChartRef.current.getContext('2d');
    segmentChartInst.current = new Chart(ctxSeg, {
      type: 'bar',
      data: {
        labels: segmentLabels,
        datasets: [
          {
            label: 'Active',
            data: segmentActiveData,
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: 'Churned',
            data: segmentChurnedData,
            backgroundColor: 'rgba(244, 63, 94, 0.7)',
            borderColor: 'rgba(244, 63, 94, 1)',
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } }
        },
        scales: {
          x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } }
        }
      }
    });

    // 4. Category Churn Data
    const cats = {};
    customers.forEach(c => {
      if (!cats[c.category]) cats[c.category] = { total: 0, churned: 0 };
      cats[c.category].total++;
      if (c.isChurned) cats[c.category].churned++;
    });
    const categoryLabels = Object.keys(cats);
    const categoryActiveData = categoryLabels.map(cat => cats[cat].total - cats[cat].churned);
    const categoryChurnedData = categoryLabels.map(cat => cats[cat].churned);

    const ctxCat = categoryChartRef.current.getContext('2d');
    categoryChartInst.current = new Chart(ctxCat, {
      type: 'bar',
      data: {
        labels: categoryLabels.map(l => l.replace(' WEAR', '')),
        datasets: [
          {
            label: 'Active',
            data: categoryActiveData,
            backgroundColor: 'rgba(245, 158, 11, 0.7)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 1.5,
            borderRadius: 6
          },
          {
            label: 'Churned',
            data: categoryChurnedData,
            backgroundColor: 'rgba(244, 63, 94, 0.7)',
            borderColor: 'rgba(244, 63, 94, 1)',
            borderWidth: 1.5,
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8', font: { family: 'Outfit' } } }
        },
        scales: {
          x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 9 } } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { family: 'Outfit' } } }
        }
      }
    });

    // 5. Return Impact Churn Data
    let returnedTotal = 0, returnedChurned = 0;
    let noReturnTotal = 0, noReturnChurned = 0;

    customers.forEach(c => {
      if (c.hasReturn) {
        returnedTotal++;
        if (c.isChurned) returnedChurned++;
      } else {
        noReturnTotal++;
        if (c.isChurned) noReturnChurned++;
      }
    });

    const ctxReturn = returnChartRef.current.getContext('2d');
    returnChartInst.current = new Chart(ctxReturn, {
      type: 'doughnut',
      data: {
        labels: ['Returned (Churned)', 'Returned (Active)', 'No Return (Churned)', 'No Return (Active)'],
        datasets: [{
          data: [
            returnedChurned,
            returnedTotal - returnedChurned,
            noReturnChurned,
            noReturnTotal - noReturnChurned
          ],
          backgroundColor: [
            'rgba(244, 63, 94, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(244, 63, 94, 0.45)',
            'rgba(16, 185, 129, 0.45)'
          ],
          borderColor: '#0f172a',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#94a3b8', font: { family: 'Outfit', size: 10 } }
          }
        }
      }
    });

    // Cleanup on unmount
    return () => {
      if (channelChartInst.current) channelChartInst.current.destroy();
      if (zoneChartInst.current) zoneChartInst.current.destroy();
      if (segmentChartInst.current) segmentChartInst.current.destroy();
      if (categoryChartInst.current) categoryChartInst.current.destroy();
      if (returnChartInst.current) returnChartInst.current.destroy();
    };
  }, [customers]);

  // Handle Search and Filtering of Customer List
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchChannel = channelFilter ? c.channel === channelFilter : true;
      const matchZone = zoneFilter ? c.zone === zoneFilter : true;
      const matchSegment = segmentFilter ? c.segment === segmentFilter : true;
      const matchCategory = categoryFilter ? c.category === categoryFilter : true;
      const matchStatus = statusFilter ? (statusFilter === 'churned' ? c.isChurned : !c.isChurned) : true;
      const matchReturn = returnFilter ? (returnFilter === 'returned' ? c.hasReturn : !c.hasReturn) : true;
      return matchSearch && matchChannel && matchZone && matchSegment && matchCategory && matchStatus && matchReturn;
    }).sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];
      
      if (sortField === 'firstPurchase' || sortField === 'lastPurchase') {
        fieldA = new Date(fieldA);
        fieldB = new Date(fieldB);
      }

      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [customers, searchTerm, channelFilter, zoneFilter, segmentFilter, categoryFilter, statusFilter, returnFilter, sortField, sortOrder]);

  // Pagination
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, channelFilter, zoneFilter, segmentFilter, categoryFilter, statusFilter, returnFilter, sortField, sortOrder]);

  // Cutoff date label calculated dynamically
  const cutoffDateStr = useMemo(() => {
    const d = new Date(referenceDate - threshold * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  }, [threshold, referenceDate]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Analytical App</span>
            <span className="text-slate-400 text-sm">2026</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mt-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 bg-clip-text text-transparent">
            Omni-Product Churn Analytics
          </h1>
          <p className="text-slate-400 mt-1">Interactive churn analysis for all product lines (Gents, Ladies, Kids) & categories.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="text-xs text-slate-400 px-2 font-medium">Data Reference Date:</span>
            <span className="px-3 py-1 bg-slate-800 text-xs font-semibold rounded-lg text-slate-200">{maxDateStr}</span>
          </div>
          <a 
            href="file:///C:/Users/lesly/Downloads/Your_Choice_KPI_Report_all_products.csv"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1 self-end"
          >
            Download Exported CSV
          </a>
        </div>
      </header>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="glass-card rounded-2xl p-6 glow-cyan transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-100 mt-2">{stats.total}</h3>
            </div>
            <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold">{customersData.reduce((acc, c) => acc + c.purchaseCount, 0)} Orders</span>
            <span>across all product segments</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card rounded-2xl p-6 glow-purple transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Churn Rate ({threshold}d)</p>
              <h3 className="text-3xl font-bold text-purple-400 mt-2">{stats.rate}%</h3>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-purple-400 font-semibold">{stats.churned} Customers</span>
            <span>inactive since {cutoffDateStr}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Loyal Channel (Min Churn)</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-2">{stats.minChannel}</h3>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{stats.minRate}% Churn</span>
            <span>Direct Organic Customer Segment</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">High Risk Product Segment</p>
              <h3 className="text-3xl font-bold text-rose-400 mt-2">{stats.worstSegment}</h3>
            </div>
            <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-rose-400 font-semibold">{stats.worstSegmentRate}% Churn</span>
            <span>Requires target playbooks</span>
          </div>
        </div>

      </div>

      {/* Interactive Threshold Controller */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          Sensitivity Analysis: Customize Churn Inactivity Threshold
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <label htmlFor="threshold-slider" class="block text-sm text-slate-400 mb-2">
              Define Churn as: Inactivity of <span className="font-bold text-cyan-400 text-lg">{threshold}</span> days or more (Cutoff Date: <span className="font-bold text-slate-300">{cutoffDateStr}</span>)
            </label>
            <input 
              type="range" 
              id="threshold-slider" 
              min="30" 
              max="90" 
              step="15" 
              value={threshold} 
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-xs text-slate-500 px-1 mt-2">
              <span>30 Days (Aggressive)</span>
              <span>45 Days</span>
              <span>60 Days (Recommended)</span>
              <span>75 Days</span>
              <span>90 Days (Conservative)</span>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-center items-center text-center">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Dynamic Churn Rate</span>
            <span className="text-4xl font-extrabold text-cyan-400 mt-1">{stats.rate}%</span>
            <span className="text-xs text-slate-500 mt-1">{stats.churned} out of {stats.total} customers</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid (4 charts: 2x2 grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Acquisition Channel */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Churn by Acquisition Channel
          </h3>
          <div className="relative h-[280px]">
            <canvas ref={channelChartRef}></canvas>
          </div>
        </div>

        {/* Chart 2: Zonal Markets */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Churn by Zonal Market
          </h3>
          <div className="relative h-[280px]">
            <canvas ref={zoneChartRef}></canvas>
          </div>
        </div>

        {/* Chart 3: Product Segment */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Churn by Product Segment
          </h3>
          <div className="relative h-[280px]">
            <canvas ref={segmentChartRef}></canvas>
          </div>
        </div>

        {/* Chart 4: Product Category */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Churn by Product Category
          </h3>
          <div className="relative h-[280px]">
            <canvas ref={categoryChartRef}></canvas>
          </div>
        </div>

      </div>

      {/* Secondary Visuals: Returns & Cohort Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart 5: Order Return Impact */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            Order Return Impact
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Comparison of Churn Rates for customers with "RETURNED" orders vs. those who never returned.
          </p>
          <div className="relative h-[220px]">
            <canvas ref={returnChartRef}></canvas>
          </div>
        </div>

        {/* Cohort Retention Heatmap */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Monthly Cohort Retention Heatmap (%)
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Percentage of unique customers acquired in a given month (Cohort) returning to make a purchase in subsequent months.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-2 text-left">Cohort Month</th>
                  <th className="py-3 px-2">Size</th>
                  <th className="py-3 px-2 bg-slate-900/30">Month 0</th>
                  <th className="py-3 px-2">Month 1</th>
                  <th className="py-3 px-2">Month 2</th>
                  <th className="py-3 px-2">Month 3</th>
                  <th className="py-3 px-2">Month 4</th>
                  <th className="py-3 px-2">Month 5</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {cohortSummary.map((cohort, idx) => (
                  <tr key={cohort.cohortMonth} className="border-b border-slate-800/50">
                    <td className="py-3 px-2 text-left text-slate-300">{cohort.cohortMonth}</td>
                    <td className="py-3 px-2 text-slate-400 font-semibold">{cohort.size}</td>
                    {/* Add blank spaces for unoccurred months */}
                    {Array.from({ length: idx }).map((_, i) => (
                      <td key={i} className="bg-slate-950/20"></td>
                    ))}
                    {cohort.retention.map((ret, rIdx) => {
                      let bgClass = "bg-slate-900/40 text-slate-600 border border-slate-800/40";
                      if (ret.rate === 100) bgClass = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                      else if (ret.rate > 15) bgClass = "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
                      else if (ret.rate > 8) bgClass = "bg-emerald-500/10 text-emerald-300/90 border border-emerald-500/20";
                      else if (ret.rate > 0) bgClass = "bg-emerald-500/5 text-slate-400 border border-emerald-500/10";
                      
                      return (
                        <td key={ret.targetMonth} className={`py-3 px-2 ${bgClass}`}>
                          {ret.rate}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Customer Registry and Advanced Filters */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-200">Customer Registry</h3>
            <p className="text-xs text-slate-400">Search and audit individual customer risk, spend, and patterns.</p>
          </div>
          <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-slate-400 font-semibold border border-slate-700/50">
            Showing {filteredCustomers.length} of {stats.total} customers
          </span>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-200"
            />
          </div>

          {/* Channel Filter */}
          <select 
            value={channelFilter} 
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-300"
          >
            <option value="">All Channels</option>
            <option value="Direct">Direct</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="Pinterest">Pinterest</option>
          </select>

          {/* Zone Filter */}
          <select 
            value={zoneFilter} 
            onChange={(e) => setZoneFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-300"
          >
            <option value="">All Zones</option>
            <option value="WEST ZONE">West Zone</option>
            <option value="EAST ZONE">East Zone</option>
            <option value="SOUTH ZONE">South Zone</option>
            <option value="NORTH ZONE">North Zone</option>
          </select>

          {/* Segment Filter */}
          <select 
            value={segmentFilter} 
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-300"
          >
            <option value="">All Product Segments</option>
            <option value="GENTS">Gents</option>
            <option value="LADIES">Ladies</option>
            <option value="KIDS">Kids</option>
          </select>

          {/* Category Filter */}
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-300"
          >
            <option value="">All Product Categories</option>
            <option value="FORMAL WEAR">Formal Wear</option>
            <option value="CASUAL WEAR">Casual Wear</option>
            <option value="ATHLETIC WEAR">Athletic Wear</option>
            <option value="ACCESSORIES">Accessories</option>
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-300"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="churned">Churned</option>
          </select>

          {/* Returns Filter */}
          <select 
            value={returnFilter} 
            onChange={(e) => setReturnFilter(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-cyan-500 text-slate-300"
          >
            <option value="">All Return History</option>
            <option value="returned">Has Returned Orders</option>
            <option value="no-return">No Returned Orders</option>
          </select>

        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-800">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Segment</th>
                <th className="p-4">Category</th>
                <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => { setSortField('totalSpend'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  Lifetime Spend {sortField === 'totalSpend' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => { setSortField('purchaseCount'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  Orders {sortField === 'purchaseCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4">Channel</th>
                <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => { setSortField('daysInactive'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  Days Inactive {sortField === 'daysInactive' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {paginatedCustomers.map((c) => (
                <tr key={c.name} className="hover:bg-slate-900/30 transition">
                  <td className="p-4 font-medium text-slate-200">{c.name}</td>
                  <td className="p-4 text-slate-400 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase">{c.segment}</span>
                  </td>
                  <td className="p-4 text-slate-400 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-900/50 border border-slate-800 text-slate-400">{c.category.replace(' WEAR', '')}</span>
                  </td>
                  <td className="p-4 text-slate-300">INR {c.totalSpend.toLocaleString()}</td>
                  <td className="p-4 text-slate-400">{c.purchaseCount}</td>
                  <td className="p-4 text-slate-400">{c.channel}</td>
                  <td className="p-4 text-slate-400">{c.daysInactive} days</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${c.isChurned ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {c.isChurned ? 'Churned' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center text-xs text-slate-400 pt-4">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800/80 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Strategic Takeaway Cards */}
      <section className="glass-card rounded-2xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
          <Info className="h-5 w-5 text-cyan-400" />
          Strategic Product Line Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
          <div className="space-y-2">
            <h4 className="font-semibold text-cyan-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              Segment Churn Disparities
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Kids' products suffer from the **highest average churn rates**, followed by Gents and Ladies. This aligns with rapid growth cycles in kids' sizing. Re-engagement must emphasize size-up programs and child-growth subscription models.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              Casual vs. Formal Retainers
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Casual and athletic categories drive higher repeat purchase frequencies compared to high-ticket formal wear. Encouraging formal buyers to crossover into casual wear remains a primary loyalty multiplier.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-rose-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              Accessories Cross-Selling
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Accessories represent low average spend but have high retention rates. Bundling accessories (belts, ties, socks) during formal and casual checkouts reduces overall customer acquisition costs (CAC).
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;
