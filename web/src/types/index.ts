export interface AudioTranscription {
    timestamp: string;
    content: string;
    type: string;
  }
  
  export interface ScreenCapture {
    timestamp: string;
    path: string;
    processes: string;
  }