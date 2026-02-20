import React, { useState, useEffect } from 'react';
import { PieChart, Clock, ArrowRightLeft, TrendingUp, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../components/Card';
import { userService, groupService } from '../api/client';
import { formatCurrency } from '../utils/currency';

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [users, setUsers] = useState({});
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [acts, allUsers, allGroups] = await Promise.all([
        userService.getActivities(),
        userService.getUsers(),
        groupService.getGroups()
      ]);

      // Create lookup maps
      const userMap = {};
      (allUsers || []).forEach(u => userMap[u.id] = u.name);
      setUsers(userMap);

      const groupMap = {};
      (allGroups || []).forEach(g => groupMap[g.id] = g.name);
      setGroups(groupMap);

      // Sort activities mostly recent first
      const sortedActs = (acts || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setActivities(sortedActs);

      // Aggregate Daily Spend
      const daysMap = {};
      sortedActs.forEach(act => {
        const d = new Date(act.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        daysMap[d] = (daysMap[d] || 0) + act.amount;
      });
      const chartData = Object.entries(daysMap).map(([date, amount]) => ({
        name: date,
        amount: amount
      })).reverse(); // Oldest first for line chart

      setDailyData(chartData);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recent Activity</h1>
        <p className="text-gray-500 text-sm mt-1">A timeline of your recent expenses and settlements.</p>
      </div>

      {loading ? (
        <div className="text-center p-8 text-gray-500">Loading activities...</div>
      ) : activities.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Clock size={32} className="text-brand-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No recent activity</h3>
          <p className="text-gray-500 max-w-sm">Once you start log expenses, your history will show up here.</p>
        </div>
      ) : (
        <div className="space-y-8 pt-4">

          {/* Data Visualization Section */}
          {dailyData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="shadow-sm">
                <h3 className="text-gray-900 font-semibold mb-1 flex items-center gap-2">
                  <TrendingUp size={18} className="text-brand-500" /> Activity Trend
                </h3>
                <p className="text-xs text-gray-500 mb-4">Total amount spent per day</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `₹${val / 100}`} />
                      <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                      <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="shadow-sm">
                <h3 className="text-gray-900 font-semibold mb-1 flex items-center gap-2">
                  <BarChart3 size={18} className="text-brand-500" /> Volume
                </h3>
                <p className="text-xs text-gray-500 mb-4">Daily transaction comparisons</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `₹${val / 100}`} />
                      <RechartsTooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#f3f4f6' }} />
                      <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Feed</h3>
            {activities.map((act) => (
              <Card key={act.id} className="flex items-center gap-4 hover:bg-gray-50 transition-colors p-4 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                  <ArrowRightLeft size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <strong>{users[act.payer_id] || `User ${act.payer_id}`}</strong> paid <strong>{formatCurrency(act.amount)}</strong> for <strong>{act.description}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    in "{groups[act.group_id] || `Group ${act.group_id}`}"  •  {formatDate(act.created_at)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
