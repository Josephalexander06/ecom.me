import { useState, useCallback } from 'react';
import { API_BASE } from '../utils/api';

const useAISearch = () => {
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState(null);

    const performSearch = useCallback(async (query) => {
        if (!query) {
            setResults([]);
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/products/ai-search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Neural search synchronization failed.');
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
            console.error('AI Search Sync Error:', err);
        } finally {
            setIsSearching(false);
        }
    }, []);

    return { results, isSearching, error, performSearch };
};

export default useAISearch;
