export const useCreateMemory = (name:string) => {
    var route = "http://127.0.0.1:8000/create_memory/" + name
    return fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};
