export const useSelectMemory = (data:any) => {
    return fetch('http://127.0.0.1:8000/select_memory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json());
};
