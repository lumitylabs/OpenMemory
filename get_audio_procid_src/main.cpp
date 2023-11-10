#include <iostream>
#include <windows.h>
#include <audiopolicy.h>
#include <mmdeviceapi.h>
#include <Windows.h>
#include <endpointvolume.h>
#include <stdio.h>
int main() {
    CoInitialize(NULL);  // Initialize COM

    // Get enumerator for audio endpoints
    IMMDeviceEnumerator *pEnumerator = NULL;
    CoCreateInstance(__uuidof(MMDeviceEnumerator), NULL, CLSCTX_ALL, __uuidof(IMMDeviceEnumerator), (void**)&pEnumerator);

    // Get default audio device
    IMMDevice *pDevice = NULL;
    pEnumerator->GetDefaultAudioEndpoint(eRender, eConsole, &pDevice);

    // Activate session manager
    IAudioSessionManager2 *pManager = NULL;
    pDevice->Activate(__uuidof(IAudioSessionManager2), CLSCTX_ALL, NULL, (void**)&pManager);

    // Enumerate sessions
    IAudioSessionEnumerator *pSessionList = NULL;
    pManager->GetSessionEnumerator(&pSessionList);
    int count;
    pSessionList->GetCount(&count);

    for (int i = 0; i < count; ++i) {
        IAudioSessionControl *pControl = NULL;
        pSessionList->GetSession(i, &pControl);

        // Get Audio Meter Information
        IAudioMeterInformation *pMeterInfo = NULL;
        pControl->QueryInterface(__uuidof(IAudioMeterInformation), (void**)&pMeterInfo);

        float peak = 0.0f;
        pMeterInfo->GetPeakValue(&peak);

        if (peak > 0.01f) {  
            AudioSessionState state;
            pControl->GetState(&state);

            if (state == AudioSessionStateActive) {
                // This session is actually producing audio
                DWORD pid;
                IAudioSessionControl2 *pControl2 = NULL;
                pControl->QueryInterface(__uuidof(IAudioSessionControl2), (void**)&pControl2);
                pControl2->GetProcessId(&pid);
                std::cout << "Process ID emitting audio: " << pid << std::endl;
            }
        }

        // Properly release the COM objects
        if (pMeterInfo) pMeterInfo->Release();
        if (pControl) pControl->Release();
    }

    // Release remaining COM objects
    if (pSessionList) pSessionList->Release();
    if (pManager) pManager->Release();
    if (pDevice) pDevice->Release();
    if (pEnumerator) pEnumerator->Release();

    CoUninitialize();  // Uninitialize COM
    return 0;
}
