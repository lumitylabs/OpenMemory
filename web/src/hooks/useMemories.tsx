export const useMemories = async () => {
    const response = await fetch('http://127.0.0.1:8000/memories', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
};