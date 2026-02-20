import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Receipt, LogIn } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const LoginPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (!name || !email) return;

        // Mock login - writing to localStorage
        localStorage.setItem('app_user_id', '1');
        localStorage.setItem('app_user_name', name);
        localStorage.setItem('app_user_email', email);

        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center flex-col items-center gap-2 text-brand-600 font-bold text-3xl tracking-tight mb-8">
                    <Receipt size={48} className="text-brand-500" />
                    <span>SplitWise Pro</span>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Sign in to your account</h2>
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            placeholder="john@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button type="submit" className="w-full flex justify-center gap-2">
                            <LogIn size={20} />
                            Sign in
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
