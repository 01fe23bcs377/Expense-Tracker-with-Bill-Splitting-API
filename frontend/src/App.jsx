import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import FriendsPage from './pages/FriendsPage';
import ActivityPage from './pages/ActivityPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('app_user_id') !== null;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <MainLayout />
                    </PrivateRoute>
                }>
                    <Route index element={<DashboardPage />} />
                    <Route path="groups/:id" element={<GroupDetailsPage />} />
                    <Route path="friends" element={<FriendsPage />} />
                    <Route path="activity" element={<ActivityPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
