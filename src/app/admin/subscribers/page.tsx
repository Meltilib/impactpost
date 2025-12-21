'use client';

import { useEffect, useState, useMemo } from 'react';
import {
    Loader2,
    Mail,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    ArrowUpDown,
    Filter,
    Search,
    UserPlus,
    RefreshCw,
    Copy,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isValidEmail } from '@/lib/utils';

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
    const [configIssue, setConfigIssue] = useState<string | null>(null);
    const [notice, setNotice] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    // Local State for UI
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = useState<'all' | 'subscribed' | 'unsubscribed'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [actionId, setActionId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<string | null>(null);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        setError(null);
        setNotice(null);
        setConfigIssue(null);
        try {
            const res = await fetch('/api/admin/subscribers', { cache: 'no-store' });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const message = data?.error || 'Failed to fetch';
                if (res.status === 503) {
                    setConfigIssue(message);
                }
                throw new Error(message);
            }

            if (Array.isArray(data.subscribers)) {
                setSubscribers(data.subscribers);
            } else {
                setSubscribers([]);
            }

            setIsMock(Boolean(data.mock));
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

        if (searchTerm.trim()) {
            const query = searchTerm.trim().toLowerCase();
            result = result.filter(s => s.email.toLowerCase().includes(query));
        }

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
    }, [subscribers, searchTerm, sortOrder, statusFilter]);

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

    const handleAddSubscriber = async () => {
        const email = newEmail.trim();
        if (!isValidEmail(email)) {
            setNotice({ type: 'error', message: 'Enter a valid email address.' });
            return;
        }

        setActionId(email);
        setActionType('add');
        setNotice(null);
        try {
            const res = await fetch('/api/admin/subscribers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const message = data?.error || 'Failed to add subscriber.';
                if (res.status === 409) {
                    setNotice({ type: 'info', message });
                    return;
                }
                if (res.status === 429) {
                    setNotice({ type: 'error', message: 'Rate limit reached. Try again in a moment.' });
                    return;
                }
                throw new Error(message);
            }

            setNewEmail('');
            setNotice({ type: 'success', message: `${email} added to subscribers.` });
            await fetchSubscribers();
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to add subscriber.';
            setNotice({ type: 'error', message });
        } finally {
            setActionId(null);
            setActionType(null);
        }
    };

    const handleToggleStatus = async (subscriber: Subscriber) => {
        const nextStatus = subscriber.status === 'subscribed' ? 'unsubscribed' : 'subscribed';
        setActionId(subscriber.id);
        setActionType('toggle');
        setNotice(null);
        try {
            const res = await fetch('/api/admin/subscribers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: subscriber.id, status: nextStatus })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || 'Failed to update status.');
            }

            setSubscribers(prev =>
                prev.map(item => item.id === subscriber.id ? { ...item, status: nextStatus } : item)
            );
            setNotice({
                type: 'success',
                message: `${subscriber.email} is now ${nextStatus}.`
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update status.';
            setNotice({ type: 'error', message });
        } finally {
            setActionId(null);
            setActionType(null);
        }
    };

    const handleDeleteSubscriber = async (subscriber: Subscriber) => {
        if (!confirm(`Delete ${subscriber.email}? This cannot be undone.`)) {
            return;
        }

        setActionId(subscriber.id);
        setActionType('delete');
        setNotice(null);
        try {
            const res = await fetch('/api/admin/subscribers', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: subscriber.id })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.error || 'Failed to delete subscriber.');
            }

            setSubscribers(prev => prev.filter(item => item.id !== subscriber.id));
            setNotice({ type: 'success', message: `${subscriber.email} deleted.` });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete subscriber.';
            setNotice({ type: 'error', message });
        } finally {
            setActionId(null);
            setActionType(null);
        }
    };

    const handleCopyEmail = async (email: string) => {
        try {
            await navigator.clipboard.writeText(email);
            setNotice({ type: 'success', message: 'Email copied to clipboard.' });
        } catch {
            setNotice({ type: 'error', message: 'Could not copy email.' });
        }
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
                <div className="flex flex-wrap gap-2">
                    <Button onClick={fetchSubscribers} variant="outline" size="sm" className="gap-2">
                        <RefreshCw size={14} /> Force Refresh
                    </Button>
                    <Button onClick={handleExportCSV} variant="secondary" size="sm" className="gap-2">
                        <Download size={16} /> Export CSV
                    </Button>
                </div>
            </div>

            {configIssue && (
                <div className="mb-6 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded-lg p-4 flex gap-3 items-start">
                    <AlertCircle size={18} className="mt-0.5" />
                    <div>
                        <p className="font-bold text-sm">Resend not configured</p>
                        <p className="text-sm">{configIssue}</p>
                        <p className="text-xs mt-1 text-yellow-700">Set RESEND_API_KEY and RESEND_AUDIENCE_ID to see live data.</p>
                    </div>
                </div>
            )}

            <div className="bg-white border rounded-lg shadow-sm p-4 mb-6 flex flex-col lg:flex-row gap-4 lg:items-end">
                <div className="flex-1">
                    <label className="text-xs font-bold uppercase text-gray-500">Search by email</label>
                    <div className="mt-2 flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                        <Search size={16} className="text-gray-400" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full text-sm outline-none"
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label className="text-xs font-bold uppercase text-gray-500">Add subscriber</label>
                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                        <input
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="new@subscriber.com"
                            className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2"
                        />
                        <Button
                            onClick={handleAddSubscriber}
                            size="sm"
                            className="gap-2"
                            disabled={actionType === 'add'}
                        >
                            <UserPlus size={14} />
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            {notice && (
                <div
                    className={`mb-6 border rounded-lg p-3 text-sm ${notice.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-700'
                            : notice.type === 'error'
                                ? 'bg-red-50 border-red-200 text-red-700'
                                : 'bg-blue-50 border-blue-200 text-blue-700'
                        }`}
                >
                    {notice.message}
                </div>
            )}

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
                                    <th className="px-6 py-4 font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSubscribers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
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
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <button
                                                        onClick={() => handleCopyEmail(sub.email)}
                                                        className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1"
                                                        type="button"
                                                    >
                                                        <Copy size={12} />
                                                        Copy
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(sub)}
                                                        className="text-xs font-bold text-gray-600 hover:text-black"
                                                        type="button"
                                                        disabled={actionId === sub.id && actionType === 'toggle'}
                                                    >
                                                        {sub.status === 'subscribed' ? 'Unsubscribe' : 'Resubscribe'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSubscriber(sub)}
                                                        className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                                                        type="button"
                                                        disabled={actionId === sub.id && actionType === 'delete'}
                                                    >
                                                        <Trash2 size={12} />
                                                        Delete
                                                    </button>
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
