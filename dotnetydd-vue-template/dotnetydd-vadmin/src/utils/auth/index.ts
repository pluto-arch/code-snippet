import router from '@/router';

export function formatToken(token: string) {
    return `Bearer ${token}`;
}

// 跳转到登录页面的函数
export function redirectToLogin() {
    router.push({ name: 'Login' });
}



// 检查用户是否已登录
export function isAuthenticated() {
    // 这里假设你将Token存储在localStorage中
    const token = localStorage.getItem('authToken');
    return !!token;
}

// 保存Token
export function saveToken(token: string) {
    localStorage.setItem('authToken', token);
}

// 清除Token
export function clearToken() {
    localStorage.removeItem('authToken');
}