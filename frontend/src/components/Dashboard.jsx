import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import api from '../api';
import {
    FiLogOut,
    FiUsers,
    FiUserCheck,
    FiClock,
    FiTrendingUp,
    FiHome,
    FiList,
    FiGrid,
    FiSearch,
    FiFilter,
    FiChevronDown,
    FiChevronRight,
    FiPlus,
    FiStar,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiDollarSign,
    FiBarChart2,
    FiActivity,
    FiTarget,
    FiAward,
    FiThumbsUp,
    FiBriefcase,
    FiGlobe,
} from 'react-icons/fi';

// ============================================================
// LAYOUT COMPONENT (with Sidebar)
// ============================================================
function Layout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: FiHome },
        { path: '/dashboard/leads', label: 'All Leads', icon: FiList },
        { path: '/dashboard/indiamart', label: 'IndiaMART Leads', icon: FiGlobe },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white flex-shrink-0 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'w-20' : 'w-72'
                    }`}
            >
                {/* Brand */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-gray-700/50 min-h-[72px]">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="bg-blue-500 text-white font-bold p-2 rounded-xl shadow-lg shadow-blue-500/30 flex-shrink-0">
                            <FiBriefcase size={22} />
                        </div>
                        {!isCollapsed && (
                            <span className="text-xl font-bold tracking-tight whitespace-nowrap">
                                Lead<span className="text-blue-400">Manager</span>
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-700/50 transition text-gray-400 hover:text-white flex-shrink-0"
                    >
                        {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronDown size={18} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                                        : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                                    }`}
                            >
                                <item.icon size={isCollapsed ? 22 : 20} className="flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}
                                {isActive && !isCollapsed && (
                                    <span className="ml-auto w-1.5 h-6 bg-white rounded-full"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Logout */}
                <div className="px-3 pb-6 border-t border-gray-700/50 pt-4">
                    {!isCollapsed ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                    JD
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">John Doe</p>
                                    <p className="text-xs text-gray-400 truncate">Admin</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                            >
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition"
                            >
                                <FiLogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between flex-shrink-0 border-b border-gray-100">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            {location.pathname === '/dashboard' && 'Dashboard'}
                            {location.pathname === '/dashboard/leads' && 'All Leads'}
                            {location.pathname === '/dashboard/indiamart' && 'IndiaMART Leads'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {location.pathname === '/dashboard' && 'Overview of your lead pipeline'}
                            {location.pathname === '/dashboard/leads' && 'Manage all your leads in one place'}
                            {location.pathname === '/dashboard/indiamart' && 'Leads sourced from IndiaMART'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 transition"
                            />
                        </div>
                        <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition relative">
                            <FiMail size={20} />
                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
                        </button>
                        <button className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                            <FiPlus size={20} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiLogOut size={28} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Logout?</h3>
                            <p className="text-gray-500 text-sm mt-2">Are you sure you want to sign out?</p>
                            <div className="flex space-x-3 mt-6">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium shadow-lg shadow-red-600/20"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================
// STATS CARD COMPONENT
// ============================================================
function StatsCard({ label, value, icon: Icon, color, trend, trendLabel }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                    {trend !== undefined && (
                        <div className="flex items-center mt-2 space-x-1">
                            <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                            </span>
                            <span className="text-xs text-gray-400">{trendLabel || 'vs last month'}</span>
                        </div>
                    )}
                </div>
                <div className={`${color} p-3 rounded-2xl shadow-lg`}>
                    <Icon size={22} className="text-white" />
                </div>
            </div>
        </div>
    );
}

// ============================================================
// STATUS BADGE
// ============================================================
function StatusBadge({ status }) {
    const styles = {
        New: 'bg-amber-50 text-amber-700 border-amber-200',
        Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
        Qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'In Progress': 'bg-purple-50 text-purple-700 border-purple-200',
        Closed: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    const dots = {
        New: 'bg-amber-500',
        Contacted: 'bg-blue-500',
        Qualified: 'bg-emerald-500',
        'In Progress': 'bg-purple-500',
        Closed: 'bg-gray-500',
    };
    return (
        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.New}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.New}`}></span>
            <span>{status || 'New'}</span>
        </span>
    );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/leads');
                setLeads(res.data);
            } catch (err) {
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, [navigate]);

    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const contacted = leads.filter(l => l.status === 'Contacted').length;
    const qualified = leads.filter(l => l.status === 'Qualified').length;
    const inProgress = leads.filter(l => l.status === 'In Progress').length;

    const stats = [
        { label: 'Total Leads', value: total, icon: FiUsers, color: 'bg-blue-500', trend: 12 },
        { label: 'New', value: newLeads, icon: FiClock, color: 'bg-amber-500', trend: 8 },
        { label: 'Contacted', value: contacted, icon: FiTrendingUp, color: 'bg-purple-500', trend: -3 },
        { label: 'Qualified', value: qualified, icon: FiUserCheck, color: 'bg-emerald-500', trend: 15 },
        { label: 'In Progress', value: inProgress, icon: FiActivity, color: 'bg-indigo-500', trend: 5 },
    ];

    const recentLeads = leads.slice(0, 6);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-500 text-sm">Loading your leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                {stats.map((stat, idx) => (
                    <StatsCard key={idx} {...stat} trendLabel="vs last month" />
                ))}
            </div>

            {/* Quick Actions + Chart placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Lead Activity</h3>
                        <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Last 30 days</span>
                    </div>
                    <div className="h-48 flex items-end justify-between space-x-2">
                        {[65, 45, 78, 55, 90, 70, 85, 60, 72, 88, 50, 68].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                                <div
                                    className="w-full bg-blue-500/20 hover:bg-blue-500/40 transition rounded-t-lg"
                                    style={{ height: `${h * 0.55}%`, minHeight: '8px' }}
                                >
                                    <div
                                        className="w-full bg-blue-500 rounded-t-lg transition-all"
                                        style={{ height: `${h * 0.45}%`, minHeight: '4px' }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-gray-400">W{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                            <span className="text-sm text-gray-500">Conversion Rate</span>
                            <span className="font-semibold text-gray-800">24.5%</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                            <span className="text-sm text-gray-500">Avg. Response Time</span>
                            <span className="font-semibold text-gray-800">2.4h</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                            <span className="text-sm text-gray-500">IndiaMART Share</span>
                            <span className="font-semibold text-gray-800">38%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Active Deals</span>
                            <span className="font-semibold text-gray-800">12</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Leads Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Recent Leads</h3>
                    <Link to="/dashboard/leads" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                        <span>View All</span>
                        <FiChevronRight size={16} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5 text-left font-semibold">Company</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Contact</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Phone</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Product</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Source</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <FiUsers size={40} className="text-gray-300 mb-3" />
                                            <p>No leads yet. They'll appear here once synced.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{lead.companyName || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.contactPerson || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.productInterest || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center space-x-1 text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">
                                                <FiGlobe size={12} />
                                                <span>IndiaMART</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={lead.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// ALL LEADS PAGE
// ============================================================
function AllLeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sourceFilter, setSourceFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/leads');
                setLeads(res.data);
            } catch (err) {
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, [navigate]);

    const statuses = ['All', 'New', 'Contacted', 'Qualified', 'In Progress', 'Closed'];
    const sources = ['All', 'IndiaMART', 'Website', 'Referral', 'Other'];

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            (lead.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.phone || '').includes(searchTerm) ||
            (lead.productInterest || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        const matchesSource = sourceFilter === 'All' || (lead.source || 'IndiaMART') === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-500 text-sm">Loading leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative flex-1 w-full sm:w-auto">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center space-x-2">
                            <FiFilter size={16} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        >
                            {sources.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-400 whitespace-nowrap">
                            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5 text-left font-semibold">Company</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Contact</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Phone</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Email</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Product</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Source</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <FiList size={40} className="text-gray-300 mb-3" />
                                            <p>No leads match your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{lead.companyName || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.contactPerson || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.email || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.productInterest || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center space-x-1 text-xs bg-gray-100 px-2.5 py-1 rounded-full text-gray-600">
                                                <FiGlobe size={12} />
                                                <span>{lead.source || 'IndiaMART'}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={lead.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// INDIA MART LEADS PAGE
// ============================================================
function IndiaMARTLeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/leads');
                // Filter to only IndiaMART leads (or those without a source specified)
                const allLeads = res.data;
                // In a real app, you'd have a source field. For demo, we'll treat
                // leads without a source or with 'IndiaMART' as IndiaMART leads
                const indiamartLeads = allLeads.filter(l =>
                    l.source === 'IndiaMART' || !l.source || l.source === ''
                );
                setLeads(indiamartLeads);
            } catch (err) {
                if (err.response?.status === 401) navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, [navigate]);

    const statuses = ['All', 'New', 'Contacted', 'Qualified', 'In Progress', 'Closed'];

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            (lead.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.phone || '').includes(searchTerm) ||
            (lead.productInterest || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const total = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const contacted = leads.filter(l => l.status === 'Contacted').length;
    const qualified = leads.filter(l => l.status === 'Qualified').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-500 text-sm">Loading IndiaMART leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* IndiaMART Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                            <FiGlobe size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">IndiaMART Leads</h2>
                            <p className="text-blue-100 text-sm">Leads sourced from IndiaMART platform</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{total}</p>
                            <p className="text-blue-100 text-xs">Total</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-200">{newLeads}</p>
                            <p className="text-blue-100 text-xs">New</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-200">{contacted}</p>
                            <p className="text-blue-100 text-xs">Contacted</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-200">{qualified}</p>
                            <p className="text-blue-100 text-xs">Qualified</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative flex-1 w-full sm:w-auto">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search IndiaMART leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center space-x-2">
                            <FiFilter size={16} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                            >
                                {statuses.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-sm text-gray-400 whitespace-nowrap">
                            {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5 text-left font-semibold">Company</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Contact</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Phone</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Product</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Enquiry Date</th>
                                <th className="px-6 py-3.5 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center">
                                            <FiGlobe size={40} className="text-gray-300 mb-3" />
                                            <p>No IndiaMART leads found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-medium text-gray-800">{lead.companyName || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.contactPerson || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">{lead.productInterest || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={lead.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// MAIN DASHBOARD EXPORT (with Routes)
// ============================================================
export default function Dashboard() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/leads" element={<AllLeadsPage />} />
                <Route path="/indiamart" element={<IndiaMARTLeadsPage />} />
            </Routes>
        </Layout>
    );
}