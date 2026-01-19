export declare class GeminiService {
    private readonly logger;
    private ai;
    constructor();
    transcribeAudio(base64Audio: string, mimeType: string): Promise<string>;
    summarizeTranscript(transcript: string): Promise<string>;
}
