import React, { useState, useEffect } from 'react';
import { Settings, Bell, Lock, User, CreditCard } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { getCurrencyCode, setCurrency } from '../utils/currency';

const SettingsPage = () => {
    const [currencyInput, setCurrencyInput] = useState('INR');
    const [name, setName] = useState(localStorage.getItem('app_user_name') || 'Current User');
    const [email, setEmail] = useState(localStorage.getItem('app_user_email') || 'user@example.com');
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        setCurrencyInput(getCurrencyCode());
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        setCurrency(currencyInput);
        localStorage.setItem('app_user_name', name);
        localStorage.setItem('app_user_email', email);
        alert("Settings saved successfully!");
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account preferences and configurations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

                {/* Settings Sidebar */}
                <div className="md:col-span-1 space-y-1">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <User size={18} />
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <Lock size={18} />
                        Security
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'payments' ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                        <CreditCard size={18} />
                        Payment Methods
                    </button>
                </div>

                {/* Settings Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        <>
                            <Card>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Personal Information</h2>
                                <form className="space-y-5">
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-3xl border-2 border-brand-200 uppercase">
                                            {name.charAt(0)}
                                        </div>
                                        <div>
                                            <Button variant="secondary" className="text-sm">Change Avatar</Button>
                                            <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                                        </div>
                                    </div>

                                    <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
                                    <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} />

                                    <div className="pt-4">
                                        <Button type="submit" onClick={handleSave}>Save Changes</Button>
                                    </div>
                                </form>
                            </Card>

                            <Card>
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Preferences</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Default Currency</label>
                                        <select
                                            className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                                            value={currencyInput}
                                            onChange={e => setCurrencyInput(e.target.value)}
                                        >
                                            <option value="INR">₹ Indian Rupee (INR)</option>
                                            <option value="USD">$ US Dollar (USD)</option>
                                            <option value="EUR">€ Euro (EUR)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-1">Time Zone</label>
                                        <select className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                                            <option value="IST">(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                        </select>
                                    </div>
                                </div>
                            </Card>
                        </>
                    )}

                    {activeTab === 'notifications' && (
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Notification Preferences</h2>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                                        <p className="text-xs text-gray-500 mt-1">Receive emails about new expenses and settlements.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                                        <p className="text-xs text-gray-500 mt-1">Get immediate pings on your devices when someone pays you back.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Marketing Updates</h3>
                                        <p className="text-xs text-gray-500 mt-1">Receive tips and product updates.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" value="" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                    </label>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Security Settings</h2>
                            <form className="space-y-5" onSubmit={e => { e.preventDefault(); alert("Password updated successfully!"); }}>
                                <Input label="Current Password" type="password" placeholder="••••••••" required />
                                <Input label="New Password" type="password" placeholder="••••••••" required />
                                <Input label="Confirm New Password" type="password" placeholder="••••••••" required />
                                <div className="pt-4">
                                    <Button type="submit">Update Password</Button>
                                </div>
                            </form>
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
                                <p className="text-xs text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                <Button variant="secondary" className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300" onClick={() => alert("Contact support to delete account.")}>
                                    Delete Account
                                </Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'payments' && (
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Payment Methods</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold italic text-xs">
                                            VISA
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                                            <p className="text-xs text-gray-500">Expires 12/28</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">Default</span>
                                </div>
                            </div>
                            <Button variant="secondary" className="w-full mt-6 flex items-center justify-center gap-2" onClick={() => alert("Stripe/Razorpay element would open here!")}>
                                + Add Payment Method
                            </Button>
                        </Card>
                    )}
                </div>

            </div>

        </div>
    );
};

export default SettingsPage;
