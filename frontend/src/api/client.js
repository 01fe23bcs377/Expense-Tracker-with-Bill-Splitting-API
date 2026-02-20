import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const groupService = {
    getGroups: () => api.get('/groups').then(res => res.data),
    createGroup: (data) => api.post('/groups', data).then(res => res.data),
    addExpense: (groupId, data) => api.post(`/groups/${groupId}/expenses`, data).then(res => res.data),
    getBalances: (groupId) => api.get(`/groups/${groupId}/balances`).then(res => res.data),
    getSettlements: (groupId) => api.get(`/groups/${groupId}/settlements`).then(res => res.data),
};

export const userService = {
    getUsers: () => api.get('/users').then(res => res.data),
    createUser: (data) => api.post('/users', data).then(res => res.data),
    getActivities: () => api.get('/activities').then(res => res.data),
};

export default api;
