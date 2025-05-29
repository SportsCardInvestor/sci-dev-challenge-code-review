"use client";
import React, {useState, useEffect} from 'react';

type DropdownProps = {
    onSelect: (selectedValue: string) => void;
};

export default function Dropdown({onSelect}: DropdownProps) {
    const [options, setOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOptions() {
            try {
                const res = await fetch('/api/catalog');
                if (!res.ok) throw new Error('Failed to fetch dropdown options');
                const result = await res.json();
                setOptions(result.data); // Ensure we set `options` to `result.data`
                setLoading(false);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setLoading(false);
            }

        }

        fetchOptions();
    }, []);


    return (
        <div>
            {loading && <p>Loading options...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <select onChange={(e) => onSelect(e.target.value)}>
                    <option value="">Select HP</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
