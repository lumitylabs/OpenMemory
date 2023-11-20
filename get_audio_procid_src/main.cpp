#include <iostream>
#include <windows.h>
#include <audiopolicy.h>
#include <mmdeviceapi.h>
#include <endpointvolume.h>

class AudioManager {
public:
    AudioManager() : pEnumerator(nullptr), pDevice(nullptr), pManager(nullptr), pSessionList(nullptr) {
        CoInitialize(NULL); // Initialize COM
        InitializeAudioDevice();
    }

    ~AudioManager() {
        CleanUp();
        CoUninitialize(); // Uninitialize COM
    }

    void DetectAudioSessions() {
        int count;
        pSessionList->GetCount(&count);

        for (int i = 0; i < count; ++i) {
            IAudioSessionControl* pControl = nullptr;
            pSessionList->GetSession(i, &pControl);
            ProcessAudioSession(pControl);
            if (pControl) pControl->Release();
        }
    }

private:
    IMMDeviceEnumerator* pEnumerator;
    IMMDevice* pDevice;
    IAudioSessionManager2* pManager;
    IAudioSessionEnumerator* pSessionList;

    void InitializeAudioDevice() {
        // Get enumerator for audio endpoints
        CoCreateInstance(__uuidof(MMDeviceEnumerator), NULL, CLSCTX_ALL, __uuidof(IMMDeviceEnumerator), (void**)&pEnumerator);

        // Get default audio device
        pEnumerator->GetDefaultAudioEndpoint(eRender, eConsole, &pDevice);

        // Activate session manager
        pDevice->Activate(__uuidof(IAudioSessionManager2), CLSCTX_ALL, NULL, (void**)&pManager);

        // Enumerate sessions
        pManager->GetSessionEnumerator(&pSessionList);
    }

    void ProcessAudioSession(IAudioSessionControl* pControl) {
        IAudioMeterInformation* pMeterInfo = nullptr;
        pControl->QueryInterface(__uuidof(IAudioMeterInformation), (void**)&pMeterInfo);

        float peak = 0.0f;
        pMeterInfo->GetPeakValue(&peak);

        if (peak > 0.01f) {
            AudioSessionState state;
            pControl->GetState(&state);

            if (state == AudioSessionStateActive) {
                DWORD pid;
                IAudioSessionControl2* pControl2 = nullptr;
                pControl->QueryInterface(__uuidof(IAudioSessionControl2), (void**)&pControl2);
                pControl2->GetProcessId(&pid);
                std::cout << "Process ID emitting audio: " << pid << std::endl;

                if (pControl2) pControl2->Release();
            }
        }

        if (pMeterInfo) pMeterInfo->Release();
    }

    void CleanUp() {
        if (pSessionList) pSessionList->Release();
        if (pManager) pManager->Release();
        if (pDevice) pDevice->Release();
        if (pEnumerator) pEnumerator->Release();
    }
};

int main() {
    AudioManager audioManager;
    audioManager.DetectAudioSessions();
    return 0;
}