import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { groupService, userService } from '../api/client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../utils/currency';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const DashboardPage = () => {
    const [groups, setGroups] = useState([]);
    const [stats, setStats] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const [grpData, actData] = await Promise.all([
                groupService.getGroups(),
                userService.getActivities()
            ]);
            setGroups(grpData);

            let total = 0;
            const groupTotals = {};
            (actData || []).forEach(act => {
                groupTotals[act.group_id] = (groupTotals[act.group_id] || 0) + act.amount;
                total += act.amount;
            });

            const chartData = (grpData || []).map(g => ({
                name: g.name,
                value: groupTotals[g.id] || 0
            })).filter(g => g.value > 0);

            setStats(chartData);
            setTotalSpent(total);
        } catch (error) {
            console.error("Failed to fetch groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await groupService.createGroup(newGroup);
            setIsModalOpen(false);
            setNewGroup({ name: '', description: '' });
            fetchGroups();
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage all your shared expenses from one place.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2">
                    <Plus size={18} />
                    Create Group
                </Button>
            </div>

            {/* Analytics Section */}
            {!loading && stats.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="flex flex-col justify-center bg-brand-50 border-brand-100">
                        <h3 className="text-brand-800 font-semibold mb-2">Total Logged Spend</h3>
                        <p className="text-4xl font-bold text-brand-700">{formatCurrency(totalSpent)}</p>
                        <p className="text-sm text-brand-600/80 mt-2">Across all your groups and expenses.</p>
                    </Card>
                    <Card>
                        <h3 className="text-gray-900 font-semibold mb-4">Spend Breakdown</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                        </Card>
                    ))
                ) : groups.length === 0 ? (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <Users size={32} className="text-brand-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No groups yet</h3>
                        <p className="text-gray-500 max-w-sm">Create a group to start splitting expenses with roommates, friends, or for trips.</p>
                        <Button className="mt-6" variant="secondary" onClick={() => setIsModalOpen(true)}>Create First Group</Button>
                    </div>
                ) : (
                    groups.map(group => (
                        <Link key={group.id} to={`/groups/${group.id}`} className="block group">
                            <Card className="hover:border-brand-300 hover:shadow-md transition-all h-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-lg group-hover:bg-brand-100 transition-colors">
                                        {group.name.substring(0, 2).toUpperCase()}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-brand-600 transition-colors">{group.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{group.description || 'No description provided.'}</p>
                            </Card>
                        </Link>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Group">
                <form onSubmit={handleCreateGroup} className="space-y-4">
                    <Input
                        label="Group Name"
                        placeholder="e.g. Goa Trip, Apartment 4B"
                        required
                        value={newGroup.name}
                        onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                    />
                    <Input
                        label="Description (Optional)"
                        placeholder="What is this group for?"
                        value={newGroup.description}
                        onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                    />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DashboardPage;
