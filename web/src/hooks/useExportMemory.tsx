export const useExportMemory = (id:string) => {
    var route = "http://127.0.0.1:8000/export_memory?memory_id=" + id
    return fetch(route, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};
