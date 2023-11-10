import { AudioTranscription, ScreenCapture } from "../types";

export function getUnifiedData(data: any) {
    let unifiedData: any[] = [];
  
    if (data && data.audio_transcriptions && data.screencaptures) {
      unifiedData = [
        ...data.audio_transcriptions.map((at: AudioTranscription) => ({
          ...at,
          datatype: "audio",
        })),
        ...data.screencaptures.map((sc: ScreenCapture) => ({
          ...sc,
          datatype: "screencapture",
        })),
      ];
  
      unifiedData.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }
  
    return unifiedData;
  }
  