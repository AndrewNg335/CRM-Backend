"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GeminiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
let GeminiService = GeminiService_1 = class GeminiService {
    logger = new common_1.Logger(GeminiService_1.name);
    ai;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not found in environment variables');
        }
        this.ai = new genai_1.GoogleGenAI({ apiKey });
    }
    async transcribeAudio(base64Audio, mimeType) {
        const transcriptPrompt = `
      Bạn là một hệ thống chuyển đổi âm thanh thành văn bản chuyên nghiệp.
      Hãy chuyển đổi toàn bộ nội dung cuộc trò chuyện trong file audio này thành văn bản tiếng Việt.

      Yêu cầu:
      - Phân biệt rõ người nói (nếu có nhiều người): "Người nói 1:", "Người nói 2:"
      - Định dạng output dễ đọc, rõ ràng
      - Ghi chính xác nội dung, không thêm thắt
    `;
        const transcriptResult = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                { text: transcriptPrompt },
                {
                    inlineData: {
                        mimeType,
                        data: base64Audio,
                    },
                },
            ],
        });
        const transcript = transcriptResult.text || '';
        if (!transcript) {
            throw new Error('Failed to transcribe audio: Empty transcript received');
        }
        return transcript;
    }
    async summarizeTranscript(transcript) {
        if (!transcript || transcript.trim().length === 0) {
            throw new Error('Transcript is empty');
        }
        const summaryPrompt = `
      Bạn là một trợ lý AI chuyên tóm tắt cuộc trò chuyện với khách hàng trong hệ thống CRM.
      
      Hãy tóm tắt nội dung cuộc trò chuyện sau thành các ý chính ngắn gọn:
      
      "${transcript}"
      
      Yêu cầu tóm tắt:
      - Rút gọn thành các ý chính quan trọng nhất (5 - 7 ý)
      - Mỗi ý chính viết dưới dạng bullet point ngắn gọn (bắt đầu bằng dấu •)
      - Tập trung vào: nhu cầu khách hàng, thông tin quan trọng
      - Viết ngắn gọn, dễ hiểu và rõ ràng
      - Không thêm thông tin không có trong cuộc trò chuyện
      
      Format output: Chỉ trả về các bullet points, không cần giải thích thêm.
    `;
        const summaryResult = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: summaryPrompt,
        });
        const summary = summaryResult.text || '';
        return summary;
    }
};
exports.GeminiService = GeminiService;
exports.GeminiService = GeminiService = GeminiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GeminiService);
//# sourceMappingURL=gemini.service.js.map