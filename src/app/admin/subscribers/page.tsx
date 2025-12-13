'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, Mail, Calendar, CheckCircle, XCircle, AlertCircle, Download, ArrowUpDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Subscriber {
    id: string;
    email: string;
    created_at: string;
    status: 'subscribed' | 'unsubscribed';
    unsubscribed_at?: string;
}

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMock, setIsMock] = useState(false);

    // Local State for UI
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all');

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/subscribers');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            if (Array.isArray(data.subscribers)) {
                setSubscribers(data.subscribers);
            } else {
                setSubscribers([]);
            }

            if (data.mock) {
                setIsMock(true);
            }
        } catch {
            setError('Could not load subscribers.');
        } finally {
            setLoading(false);
        }
    };

    // Derived Statistics
    const stats = useMemo(() => {
        const total = subscribers.length;
        const active = subscribers.filter(s => s.status === 'subscribed').length;

        // Calculate new this month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newThisMonth = subscribers.filter(s => new Date(s.created_at) >= startOfMonth).length;

        return { total, active, newThisMonth };
    }, [subscribers]);

    // Derived List for Display
    const filteredSubscribers = useMemo(() => {
        let result = [...subscribers];

        // Filter
        if (statusFilter !== 'all') {
            result = result.filter(s => s.status === statusFilter);
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [subscribers, sortOrder, statusFilter]);

    const handleExportCSV = () => {
        const csvContent = [
            ['ID', 'Email', 'Status', 'Joined Date'], // Header
            ...filteredSubscribers.map(s => [s.id, s.email, s.status, new Date(s.created_at).toISOString()])
        ].map(e => e.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'subscribers_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-heavy mb-2">Newsletter Subscribers</h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        Monitor your audience growth.
                        {isMock && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <AlertCircle size={10} /> Demo Data (Configure API Key)
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchSubscribers} variant="outline" size="sm">
                        Refresh
                    </Button>
                    <Button onClick={handleExportCSV} variant="secondary" size="sm" className="gap-2">
                        <Download size={16} /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 uppercase">Total Subscribers</h3>
                    <p className="text-4xl font-heavy mt-2">{stats.total}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 uppercase">Active Subscribers</h3>
                    <p className="text-4xl font-heavy text-brand-teal mt-2">{stats.active}</p>
                </div>
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 uppercase">New This Month</h3>
                    <p className="text-4xl font-heavy text-brand-purple mt-2">+{stats.newThisMonth}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-gray-400" size={32} />
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-2">
                    <XCircle size={18} /> {error}
                </div>
            ) : (
                <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                    {/* Controls */}
                    <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-gray-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'subscribed' | 'unsubscribed')}
                                className="text-sm border-gray-300 rounded-md p-1 bg-white border"
                            >
                                <option value="all">All Statuses</option>
                                <option value="subscribed">Subscribed Only</option>
                                <option value="unsubscribed">Unsubscribed Only</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                            className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-black"
                        >
                            <ArrowUpDown size={14} />
                            Sorted by Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-700">Email</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-700">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSubscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                            No subscribers found matching your criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSubscribers.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-purple">
                                                    <Mail size={14} />
                                                </div>
                                                {sub.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${sub.status === 'subscribed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {sub.status === 'subscribed' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="opacity-50" />
                                                    {new Date(sub.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t bg-gray-50 text-xs text-gray-500 text-center">
                        Showing {filteredSubscribers.length} of {subscribers.length} record(s)
                    </div>
                </div>
            )}
        </div>
    );
}
