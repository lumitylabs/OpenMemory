  export const useExportMemory = (id:number) => {
    const route = "http://127.0.0.1:8000/export_memory/"+id;

    return fetch(route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    });
};
