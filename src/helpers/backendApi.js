export default class Api {
    static _api = 'https://localhost:44314/api/';

    static getContacts(resF, errF) {
        return fetch(this._api + 'adresses')
        .then(
            res => {
                if (res.ok) return res.json();
                else return null;
            }
        );
    }

    // static getContactsLess() {
    //     return fetch(this._api + 'adresses')
    //     .then(res => res.json());
    // }

    static getContactsLess() {
        return fetch(this._api + 'adresses/less')
        .then(
            res => {
                if (res.ok) return res.json();
                else return null;
            }
        );
    }

    static getDoctorTypes() {
        return fetch(this._api + 'doctortypes')
        .then(
            res => {
                if (res.ok) return res.json();
                else return null;
            }
        );
    }

    static getDoctors() {
        return fetch(this._api + 'doctors')
        .then(
            res => {
                if (res.ok) return res.json();
                else return null;
            }
        );
    }

    static getTimeSlotsByDoctor(docId) {
        return fetch(this._api + `timeslots/doc/${Number.parseInt(docId)}`)
        .then(
            res => {
                if (res.ok) return res.json();
                else return null;
            }
        );
    }

    static async postAppointment(data) {
        return fetch(this._api + 'appointments', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(res => {
            if (res.status === 201) return res.json()
            else return null;
        });
    }

    static async getAppointmentsByUser(userId) {
        return fetch(this._api + `appointments/user/${Number.parseInt(userId)}`, {
            method: 'GET',
            credentials: 'include',
        }).then(async res => {
            const data = await res.json();
            if (res.ok) return { isAuth: true, data: data };
            else if (res.status === 401) return { isAuth: false, data: null };
            else return { isAuth: true, data: null };
        });
    }

    // static async getAppointmentsByDoctor(userId) {
    //     return fetch(this._api + `appointments/doctor/${Number.parseInt(userId)}`, {
    //         method: 'GET',
    //         credentials: 'include',
    //     }).then(async res => {
    //         const data = await res.json();
    //         if (res.ok) return { isAuth: true, data: data };
    //         else if (res.status === 401) return { isAuth: false, data: null };
    //         else return { isAuth: true, data: null };
    //     });
    // }

    static async deleteAppointment(id) {
        return fetch(this._api + `appointments/${Number.parseInt(id)}`, {
            method: 'DELETE',
            credentials: 'include',
        }).then(async res => {
            const data = await res.json();
            if (res.ok) return { isAuth: true, data: data };
            else if (res.status === 401) return { isAuth: false, data: null };
            else return { isAuth: true, data: null };
        });
    }

    static async getUserData(userId) {
        return fetch(this._api + `auth/${Number.parseInt(userId)}`, {
            method: 'GET',
            credentials: 'include',
        }).then(async res => {
            const data = await res.json();
            if (res.ok) return { isAuth: true, data: data };
            else if (res.status === 401) return { isAuth: false, data: null };
            else return { isAuth: true, data: null };
        });
    }

    static async updateUserData(data) {
        return fetch(this._api + 'auth', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async res => {
            const data = await res.json();
            if (res.ok) return { isAuth: true, data: data };
            else if (res.status === 401) return { isAuth: false, data: null };
            else return { isAuth: true, data: null };
        });
    }

    // status = {empty - пусті поля, auth - вже авторизований, email - такий юзер вже існує}
    static async createUser(data) {
        return fetch(this._api + 'auth/signup', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async res => {
            if (res.ok) return { isSignup: true, status: 'ok' };
            const data = await res.json();
            return { isSignup: false, status: data.status };
        });
    }

    static async getDoctorByUser(userId) {
        return fetch(this._api + `doctors/user/${Number.parseInt(userId)}`, {
            method: 'GET',
            credentials: 'include',
        }).then(res => {
            if (res.ok) return res.json();
            else return null;
        });
    }

    static async createTimeSlots(data) {
        return fetch(this._api + 'timeslots/create', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async res => {
            if (res.ok) return { isAuth: true, isCreated: true, status: 'ok' };
            const data = await res.json();
            if (res.status === 401) return { isAuth: false, isCreated: false, status: data.reason };
            return { isAuth: true, isCreated: false, status: data.status };
        });
    }

    static async deleteTimeSlots(data) {
        return fetch(this._api + 'timeslots/delete', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(async res => {
            if (res.ok) return { isAuth: true, isDeleted: true };
            if (res.status === 401) return { isAuth: false, isDeleted: false };
            return { isAuth: true, isDeleted: false };
        });
    }
}
