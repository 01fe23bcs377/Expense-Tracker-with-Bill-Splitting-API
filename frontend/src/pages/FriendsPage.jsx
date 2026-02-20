import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { userService } from '../api/client';

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '' });

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsers();
            setFriends(data || []);
        } catch (error) {
            console.error("Failed to fetch friends:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        try {
            await userService.createUser(newUser);
            setIsModalOpen(false);
            setNewUser({ name: '', email: '' });
            fetchFriends();
        } catch (error) {
            console.error("Error creating friend:", error);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your connections and view individual balances.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2">
                    <UserPlus size={18} />
                    Add Friend
                </Button>
            </div>

            <Card className="flex items-center gap-3 p-2 mb-6 shadow-sm border-gray-200">
                <Search size={20} className="text-gray-400 ml-2" />
                <input
                    type="text"
                    placeholder="Search friends by name or email..."
                    className="w-full bg-transparent border-none focus:ring-0 text-sm outline-none"
                />
            </Card>

            {loading ? (
                <div className="text-center p-8 text-gray-500">Loading friends...</div>
            ) : friends.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-center">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Users size={32} className="text-brand-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No friends added yet</h3>
                    <p className="text-gray-500 max-w-sm">When you add friends to groups or manually here, they will appear in this list.</p>
                    <Button className="mt-6" variant="secondary" onClick={() => setIsModalOpen(true)}>Invite a Friend</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map(friend => (
                        <Card key={friend.id} className="flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-lg">
                                {friend.name.substring(0, 1).toUpperCase()}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="text-md font-semibold text-gray-900 truncate">{friend.name}</h3>
                                <p className="text-sm text-gray-500 truncate">{friend.email}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Friend Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Friend">
                <form onSubmit={handleAddFriend} className="space-y-4">
                    <Input
                        label="Name"
                        placeholder="e.g. John Doe"
                        required
                        value={newUser.name}
                        onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={newUser.email}
                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Friend</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FriendsPage;
