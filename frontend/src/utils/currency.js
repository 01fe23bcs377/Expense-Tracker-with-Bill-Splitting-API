export const getCurrencySymbol = () => {
    const currency = localStorage.getItem('app_currency') || 'INR';
    switch (currency) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'INR': default: return '₹';
    }
};

export const setCurrency = (currency) => {
    localStorage.setItem('app_currency', currency);
    // Dispatch event to update other components if needed
    window.dispatchEvent(new Event('app_currency_changed'));
};

export const getCurrencyCode = () => {
    return localStorage.getItem('app_currency') || 'INR';
};

export const formatCurrency = (cents) => {
    return getCurrencySymbol() + (cents / 100).toFixed(2);
};
