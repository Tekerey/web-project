
class AuthService {
    static _api = 'https://localhost:44314/api/auth/';

    static async auth() {
        const response = await fetch(`${this._api}auth`, {
            method: 'GET',
            credentials: 'include'
        });
        if (response.status === 401) {
            const data = await response.json();
            return {isAuth: false, reason: data.reason};
        } else if (response.ok) {
            return {isAuth: true};
        } else {
            return {isAuth: false, reason: 'error'};
        }
    }

    static logout() {
        return fetch(`${this._api}logout`, {
            method: 'POST',
            credentials: 'include'
        });
    }

    static async login(body) {
        const response = await fetch(`${this._api}login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.ok) return {isLogged: true};
        const data = await response.json();
        return {isLogged: false, status: data.status};
    }
}

export default AuthService;