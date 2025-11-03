"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FaLink, FaEye, FaMousePointer, FaCalendar, FaDownload, FaChartLine, FaPercentage } from 'react-icons/fa';
import { FiSearch } from 'react-icons/fi';

// imports start here
import Dashboard from '../components/dashboard/dashboard';
import './page.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DashboardPage = () => {

    const { isSignedIn, userId } = useAuth();
    const { user, isLoaded } = useUser()

    const [userData, setUserData] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');
    const [exporting, setExporting] = useState(false);
    const [activeFilter, setActiveFilter] = useState<'all' | 'social' | 'project'>('all');
    const [query, setQuery] = useState('');

    const router = useRouter();

    const fetchAnalytics = async () => {
        try {
            const analyticsResponse = await axios.get('/api/analytics', {
                params: { 
                    userId: userId,
                    dateRange: dateRange,
                }
            });
            setAnalytics(analyticsResponse.data.analytics);
        } catch (error) {
            console.log("Error fetching analytics:", error);
        }
    };

    const handleExportData = async (format: 'json' | 'csv') => {
        setExporting(true);
        try {
            const response = await axios.get('/api/analytics/export', {
                params: { 
                    userId: userId,
                    format: format,
                },
                responseType: format === 'csv' ? 'blob' : 'json',
            });

            if (format === 'csv') {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `analytics-${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                const dataStr = JSON.stringify(response.data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = window.URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `analytics-${Date.now()}.json`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("Failed to export data");
        } finally {
            setExporting(false);
        }
    };

    useEffect(() => {
        if (!isLoaded || !userId) return;

        const fetchUserData = async () => {
            try {
                // Check if user is admin
                const adminCheck = await axios.get('/api/admin/check');
                if (adminCheck.data.isAdmin) {
                    router.push('/admin');
                    return;
                }

                const response = await axios.get('/api/user/', {
                    params: { userId: userId },
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response || response.status !== 200 || !response.data.user || response.data.user.length === 0) {
                    router.push('/create-profile')
                    return;
                }

                const data = await response.data;
                sessionStorage.setItem('userData', JSON.stringify(data));
                console.log("Dashboard user data:", data);
                setUserData(data);
                
                // Fetch analytics
                await fetchAnalytics();
                
            } catch (error) {
                console.log("Error fetching user data:", error);
                router.push('/create-profile');
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserData();
    }, [isLoaded, router, userId]);

    useEffect(() => {
        if (userId && !isLoading) {
            fetchAnalytics();
        }
    }, [dateRange, userId]);

    console.log("Rendered userData:", userData);

    if (isLoading) {
        return (
            <Dashboard>
                <div className="analytics-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </Dashboard>
        );
    }

    if (!analytics) {
        return (
            <Dashboard>
                <div className="analytics-loading">
                    <p>No analytics data available</p>
                </div>
            </Dashboard>
        );
    }

    // Filter logic
    const filteredTopLinks = (analytics.topLinks || [])
        .filter((link: any) => {
            if (activeFilter !== 'all' && link.link_type !== activeFilter) return false;
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                (link.title || '').toLowerCase().includes(q) ||
                (link.link_type || '').toLowerCase().includes(q)
            );
        });

    // Prepare chart data
    const clicksByTypeData = {
        labels: analytics.clicksByType.map((item: any) => 
            item.link_type === 'social' ? 'Social Links' : 'Project Links'
        ),
        datasets: [{
            label: 'Clicks by Type',
            data: analytics.clicksByType.map((item: any) => item.clicks),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(139, 92, 246, 0.8)',
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(139, 92, 246, 1)',
            ],
            borderWidth: 2,
        }],
    };

    const linkTypeDistributionData = {
        labels: analytics.linkTypeDistribution.map((item: any) => 
            item.link_type === 'social' ? 'Social Links' : 'Project Links'
        ),
        datasets: [{
            label: 'Link Distribution',
            data: analytics.linkTypeDistribution.map((item: any) => item.count),
            backgroundColor: [
                'rgba(236, 72, 153, 0.8)',
                'rgba(245, 158, 11, 0.8)',
            ],
            borderColor: [
                'rgba(236, 72, 153, 1)',
                'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 2,
        }],
    };

    const topLinksData = {
        labels: filteredTopLinks.map((link: any) => link.title),
        datasets: [{
            label: 'Clicks',
            data: filteredTopLinks.map((link: any) => link.clicks),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    }
                }
            },
        },
    };

    return (
        <Dashboard>
            <div className="analytics-container">
                <div className="analytics-header">
                    <div className="header-content">
                        <div className="header-left">
                            <h1>Welcome{user?.firstName ? `, ${user.firstName}` : ''}</h1>
                            <p>Here is your activity and performance overview</p>
                        </div>
                        <div className="header-right">
                            <div className="searchbar">
                                <FiSearch />
                                <input 
                                    type="text" 
                                    placeholder="Search links, titles, or types..." 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            <div className="header-actions">
                                <select 
                                    value={dateRange} 
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="date-range-select"
                                >
                                    <option value="7">Last 7 days</option>
                                    <option value="30">Last 30 days</option>
                                    <option value="90">Last 90 days</option>
                                    <option value="365">Last year</option>
                                </select>
                                <button 
                                    onClick={() => handleExportData('csv')} 
                                    disabled={exporting}
                                    className="export-btn"
                                >
                                    <FaDownload /> Export CSV
                                </button>
                                <button 
                                    onClick={() => handleExportData('json')} 
                                    disabled={exporting}
                                    className="export-btn export-btn-secondary"
                                >
                                    <FaDownload /> Export JSON
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="filter-tabs">
                        <button 
                            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('all')}
                        >All</button>
                        <button 
                            className={`filter-tab ${activeFilter === 'social' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('social')}
                        >Social</button>
                        <button 
                            className={`filter-tab ${activeFilter === 'project' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('project')}
                        >Project</button>
                    </div>
                </div>

                {/* Summary Cards */}
                <motion.div 
                    className="analytics-summary"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                            <FaLink style={{ color: '#3b82f6' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Total Links</p>
                            <h2 className="summary-value">{analytics.summary.totalLinks}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                            <FaEye style={{ color: '#22c55e' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Visible Links</p>
                            <h2 className="summary-value">{analytics.summary.visibleLinks}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                            <FaMousePointer style={{ color: '#ec4899' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Total Clicks</p>
                            <h2 className="summary-value">{analytics.summary.totalClicks}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                            <FaCalendar style={{ color: '#8b5cf6' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Member Since</p>
                            <h2 className="summary-value" style={{ fontSize: '1rem' }}>
                                {new Date(analytics.summary.accountCreatedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    year: 'numeric' 
                                })}
                            </h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                            <FaChartLine style={{ color: '#f59e0b' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Avg. Clicks/Link</p>
                            <h2 className="summary-value">{analytics.summary.avgClicksPerLink || 0}</h2>
                        </div>
                    </div>

                    <div className="summary-card">
                        <div className="summary-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                            <FaPercentage style={{ color: '#10b981' }} />
                        </div>
                        <div className="summary-content">
                            <p className="summary-label">Click Rate</p>
                            <h2 className="summary-value">{analytics.summary.clickThroughRate || 0}</h2>
                        </div>
                    </div>
                </motion.div>

                {/* Charts Grid */}
                <motion.div 
                    className="analytics-charts"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Top Links Chart */}
                    {filteredTopLinks.length > 0 && (
                        <div className="chart-card">
                            <h3>Top Performing Links</h3>
                            <div className="chart-container">
                                <Bar data={topLinksData} options={chartOptions} />
                            </div>
                        </div>
                    )}

                    {/* Clicks by Type */}
                    {analytics.clicksByType.length > 0 && (
                        <div className="chart-card">
                            <h3>Clicks by Link Type</h3>
                            <div className="chart-container">
                                <Bar data={clicksByTypeData} options={chartOptions} />
                            </div>
                        </div>
                    )}

                    {/* Link Distribution */}
                    {analytics.linkTypeDistribution.length > 0 && (
                        <div className="chart-card chart-card-small">
                            <h3>Link Type Distribution</h3>
                            <div className="chart-container">
                                <Doughnut data={linkTypeDistributionData} options={chartOptions} />
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Top Links Table */}
                {filteredTopLinks.length > 0 && (
                    <motion.div 
                        className="analytics-table"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h3>Top 5 Links</h3>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Link Title</th>
                                        <th>Type</th>
                                        <th>Clicks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTopLinks.map((link: any, index: number) => (
                                        <tr key={index}>
                                            <td>
                                                <span className="rank-badge">#{index + 1}</span>
                                            </td>
                                            <td className="link-title">{link.title}</td>
                                            <td>
                                                <span className={`type-badge ${link.link_type}`}>
                                                    {link.link_type === 'social' ? 'Social' : 'Project'}
                                                </span>
                                            </td>
                                            <td className="clicks-count">{link.clicks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
                {filteredTopLinks.length === 0 && (
                    <div className="empty-state">
                        <p>No links match your search/filter.</p>
                    </div>
                )}
            </div>
        </Dashboard>
    )
}

export default DashboardPage;