import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Receipt, PiggyBank, Plus, ArrowRight } from 'lucide-react';
import { groupService, userService } from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { formatCurrency } from '../utils/currency';

const GroupDetailsPage = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [balances, setBalances] = useState([]);
    const [settlements, setSettlements] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Expense Modal State
    const [isExpenseOpen, setIsExpenseOpen] = useState(false);
    const [expenseForm, setExpenseForm] = useState({
        payer_id: '',
        amount: '', // in standard currency (e.g. 100.50)
        description: '',
        splitType: 'EQUAL', // EQUAL, CUSTOM
    });

    // Custom Splits State map UserID -> Amount
    const [customSplits, setCustomSplits] = useState({});

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    const fetchGroupData = async () => {
        try {
            setLoading(true);
            // In a real app we would have a getGroup endpoint. Here we quickly fetch all and find it
            const allGroups = await groupService.getGroups();
            const currentGroup = allGroups.find(g => g.id === parseInt(id));
            setGroup(currentGroup);

            // Fetch balances and settlements concurrently
            const [bals, setts, users] = await Promise.all([
                groupService.getBalances(id),
                groupService.getSettlements(id),
                userService.getUsers()
            ]);

            setBalances(bals);
            setSettlements(setts);
            setAllUsers(users || []);
        } catch (error) {
            console.error("Failed to fetch group data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get real user names
    const getUserName = (uid) => {
        const u = allUsers.find(user => user.id === uid);
        return u ? u.name : `User ${uid}`;
    };
    const getUserInitial = (uid) => {
        const name = getUserName(uid);
        return name ? name.charAt(0).toUpperCase() : 'U';
    };

    // Build a unique users list for this group from balances
    const groupUsers = balances.map(b => b.user_id);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!expenseForm.payer_id || !expenseForm.amount || !expenseForm.description) return;

        const amountInCents = Math.round(parseFloat(expenseForm.amount) * 100);

        let splits = [];
        if (expenseForm.splitType === 'EQUAL') {
            const payerId = parseInt(expenseForm.payer_id);
            let userIds = [payerId];

            // If they are the first expense, just grab another user from allUsers to split with
            if (groupUsers.length === 0) {
                const other = allUsers.find(u => u.id !== payerId);
                if (other) userIds.push(other.id);
            } else {
                userIds = Array.from(new Set([...groupUsers, payerId]));
            }

            const actualUsers = userIds.length > 0 ? userIds : [payerId];

            const baseSplit = Math.floor(amountInCents / actualUsers.length);
            let remainder = amountInCents % actualUsers.length;

            splits = actualUsers.map(uid => {
                let owed = baseSplit;
                if (remainder > 0) {
                    owed += 1;
                    remainder -= 1;
                }
                return { user_id: uid, amount_owed: owed };
            });
        } else {
            // CUSTOM SPLIT
            let totalCustom = 0;
            const customEntries = Object.entries(customSplits).map(([uidStr, val]) => {
                const owedCents = Math.round(parseFloat(val || 0) * 100);
                totalCustom += owedCents;
                return { user_id: parseInt(uidStr), amount_owed: owedCents };
            }).filter(s => s.amount_owed > 0);

            if (totalCustom !== amountInCents) {
                alert(`Custom splits (₹${(totalCustom / 100).toFixed(2)}) must exactly equal the total amount (₹${expenseForm.amount}).`);
                return;
            }
            if (customEntries.length === 0) {
                alert("Please enter custom split amounts.");
                return;
            }
            splits = customEntries;
        }

        try {
            await groupService.addExpense(id, {
                payer_id: parseInt(expenseForm.payer_id),
                amount: amountInCents,
                description: expenseForm.description,
                splits: splits
            });
            setIsExpenseOpen(false);
            setExpenseForm({ payer_id: '', amount: '', description: '', splitType: 'EQUAL' });
            fetchGroupData();
        } catch (error) {
            console.error("Failed to add expense:", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading group details...</div>;
    if (!group) return <div className="p-8 text-center text-red-500">Group not found.</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {group.name}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">{group.description || 'No description assigned.'}</p>
                    </div>
                </div>
                <Button onClick={() => setIsExpenseOpen(true)} className="flex items-center justify-center gap-2">
                    <Receipt size={18} />
                    Add Expense
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column - Balances & Group Info */}
                <div className="space-y-6 lg:col-span-1">
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Users size={20} className="text-brand-500" />
                            User Balances
                        </h2>
                        {balances.length === 0 ? (
                            <p className="text-sm text-gray-500">No balances tracked yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {balances.map(b => (
                                    <div key={b.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="font-medium text-gray-700">{getUserName(b.user_id)}</span>
                                        <span className={`font-bold ${b.net_balance > 0 ? 'text-brand-600' : b.net_balance < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {b.net_balance > 0 ? 'gets back' : b.net_balance < 0 ? 'owes' : 'settled'}: {formatCurrency(Math.abs(b.net_balance))}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column - Settlements */}
                <div className="space-y-6 lg:col-span-2">
                    <Card className="h-full">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <PiggyBank size={20} className="text-brand-500" />
                            Optimized Settlements
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Our smart algorithm minimizes the total number of transactions needed to settle all debts in the group.
                        </p>

                        {settlements.length === 0 ? (
                            <div className="py-8 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50">
                                <span className="text-gray-500 text-sm">Everyone is fully settled up! 🎉</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {settlements.map((s, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-brand-300 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-100 title" title={getUserName(s.from_user_id)}>
                                                {getUserInitial(s.from_user_id)}
                                            </div>
                                            <div className="flex flex-col items-center px-4">
                                                <span className="text-xs text-brand-600 font-semibold mb-1 tracking-wide">PAYS</span>
                                                <ArrowRight size={16} className="text-brand-300" />
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold border border-brand-100" title={getUserName(s.to_user_id)}>
                                                {getUserInitial(s.to_user_id)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">{formatCurrency(s.amount)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>

            <Modal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)} title="Add New Expense">
                <form onSubmit={handleAddExpense} className="space-y-5">
                    <Input
                        label="Description"
                        placeholder="e.g. Dinner, Uber, Groceries"
                        required
                        value={expenseForm.description}
                        onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    />
                    <div className="flex gap-4">
                        <Input
                            label="Amount (in ₹)"
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            className="flex-1"
                            placeholder="0.00"
                            value={expenseForm.amount}
                            onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        />
                        <div className="flex-1 w-full space-y-1">
                            <label className="text-sm font-medium text-gray-700">Paid By</label>
                            <select
                                value={expenseForm.payer_id}
                                onChange={e => setExpenseForm({ ...expenseForm, payer_id: e.target.value })}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white h-[42px]"
                            >
                                <option value="" disabled>Select User</option>
                                {allUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100 mt-4">
                        <label className="text-sm font-medium text-gray-700 block mb-2">Split the expense</label>
                        <div className="flex gap-2">
                            <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${expenseForm.splitType === 'EQUAL' ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" className="sr-only" checked={expenseForm.splitType === 'EQUAL'} onChange={() => setExpenseForm({ ...expenseForm, splitType: 'EQUAL' })} />
                                Split Equally
                            </label>
                            <label className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${expenseForm.splitType === 'CUSTOM' ? 'border-brand-500 bg-brand-50 text-brand-700 font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input type="radio" className="sr-only" checked={expenseForm.splitType === 'CUSTOM'} onChange={() => setExpenseForm({ ...expenseForm, splitType: 'CUSTOM' })} />
                                Custom Split
                            </label>
                        </div>
                        {expenseForm.splitType === 'CUSTOM' && (
                            <div className="space-y-3 mt-4 border border-gray-100 rounded-lg p-3 bg-gray-50">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Assign Exact Amounts</p>
                                {allUsers.map((u) => (
                                    <div key={u.id} className="flex items-center justify-between gap-3">
                                        <label className="text-sm font-medium text-gray-700 truncate flex-1">{u.name}</label>
                                        <div className="flex bg-white items-center border border-gray-300 rounded-lg px-2 w-32 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
                                            <span className="text-gray-500 text-sm">₹</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                className="w-full text-right p-1.5 focus:outline-none text-sm"
                                                value={customSplits[u.id] || ''}
                                                onChange={(e) => setCustomSplits({ ...customSplits, [u.id]: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="text-xs text-right text-gray-500 mt-2 font-medium">
                                    Total: ₹{Object.values(customSplits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)} / ₹{expenseForm.amount || '0.00'}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                        <Button variant="secondary" onClick={() => setIsExpenseOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Expense</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default GroupDetailsPage;
