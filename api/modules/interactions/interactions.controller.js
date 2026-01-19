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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const query_parser_1 = require("../../common/utils/query-parser");
const interactions_service_1 = require("./interactions.service");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const permissions_decorator_1 = require("../../auth/permissions.decorator");
const permissions_enum_1 = require("../../common/enums/permissions.enum");
let InteractionsController = class InteractionsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(body) {
        return this.service.create(body);
    }
    async findAll(raw) {
        const parsed = (0, query_parser_1.parseHttpQueryToMongo)(raw, {
            textSearchFields: ['detail'],
            allowedFilterFields: ['interactionType', 'leadId'],
            defaultSort: { createdAt: -1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
        return { data: items, total, page, pageSize, totalPages };
    }
    async findOne(id) {
        return this.service.findOne(id);
    }
    async findByLead(leadId) {
        const data = await this.service.findByLead(leadId);
        return { data };
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    async deleteMany(body) {
        return this.service.deleteMany(body.ids);
    }
    async delete(id) {
        return this.service.delete(id);
    }
    async transcribeAudio(file) {
        if (!file) {
            throw new common_1.BadRequestException('No audio file uploaded');
        }
        const base64Audio = file.buffer.toString('base64');
        return this.service.transcribeAudio(base64Audio, file.mimetype);
    }
    async summarize(body) {
        if (!body.transcript || body.transcript.trim().length === 0) {
            throw new common_1.BadRequestException('Transcript is required');
        }
        return this.service.summarizeTranscript(body.transcript);
    }
};
exports.InteractionsController = InteractionsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.CREATE_INTERACTION),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_INTERACTIONS),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_SINGLE_INTERACTION),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.VIEW_LEAD_INTERACTIONS),
    (0, common_1.Get)('lead/:leadId'),
    __param(0, (0, common_1.Param)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "findByLead", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.UPDATE_INTERACTION),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_INTERACTION),
    (0, common_1.Delete)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, permissions_decorator_1.Permissions)(permissions_enum_1.Permissions.DELETE_INTERACTION),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)('transcribe-audio'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('audioFile', {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 25 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            const allowedMimes = [
                'audio/mp3',
                'audio/m4a',
                'audio/x-m4a',
                'audio/mp4',
                'audio/x-mp4',
                'audio/wav',
                'audio/x-wav',
                'audio/ogg',
                'audio/webm',
                'audio/mpeg',
                'audio/x-mpeg',
                'audio/mpga',
            ];
            const fileName = file.originalname?.toLowerCase() || '';
            const isValidMime = allowedMimes.includes(file.mimetype);
            const isValidExtension = fileName.endsWith('.mp3') ||
                fileName.endsWith('.m4a') ||
                fileName.endsWith('.wav') ||
                fileName.endsWith('.ogg') ||
                fileName.endsWith('.webm');
            if (isValidMime || isValidExtension) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException(`Only audio files are allowed. Received: ${file.mimetype || 'unknown'}`), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "transcribeAudio", null);
__decorate([
    (0, common_1.Post)('summarize'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InteractionsController.prototype, "summarize", null);
exports.InteractionsController = InteractionsController = __decorate([
    (0, common_1.Controller)('interactions'),
    __metadata("design:paramtypes", [interactions_service_1.InteractionsService])
], InteractionsController);
//# sourceMappingURL=interactions.controller.js.map