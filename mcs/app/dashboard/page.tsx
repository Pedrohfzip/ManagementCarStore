'use client';
import React, { useEffect, useState } from "react";

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                setLoading(true);
                // const data = await getUsers();
                // setUsers(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message || 'Erro ao buscar usuários');
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Dashboard Home</h1>
            {loading && <p>Carregando usuários...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map((user, idx) => (
                    <li key={user.id || idx}>{user.nome || JSON.stringify(user)}</li>
                ))}
            </ul>
        </div>
    );
}