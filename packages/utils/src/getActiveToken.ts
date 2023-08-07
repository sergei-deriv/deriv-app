/**
 * Get active_loginid
 * @returns {string} - Active loginid or empty string
 */
export const getActiveToken = (): string => {
    // Temporarily fix for getting the active token from local storage to avoid using `useStore`.
    const accounts = JSON.parse(localStorage.getItem('client.accounts') || '{}');
    const active_loginid = localStorage.getItem('active_loginid');
    const current_token = accounts?.[active_loginid || '']?.token || '';

    return current_token;
};

export default getActiveToken;
