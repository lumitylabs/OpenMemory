export const useGetCaptureState = () => {
    return fetch('http://127.0.0.1:8000/get_capture_state', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json());
};