import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { InteractionsService } from './interactions.service';
import { Interaction } from 'src/schemas/interaction.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly service: InteractionsService) { }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.CREATE_INTERACTION)
  @Post()
  async create(@Body() body: Partial<Interaction>) {
    return this.service.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_INTERACTIONS)
  @Get()
  async findAll(@Query() raw: Record<string, any>) {
    const parsed = parseHttpQueryToMongo(raw, {
      textSearchFields: ['detail'],
      allowedFilterFields: ['interactionType', 'leadId'],
      defaultSort: { createdAt: -1 },
    });
    const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
    return { data: items, total, page, pageSize, totalPages };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_SINGLE_INTERACTION)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.VIEW_LEAD_INTERACTIONS)
  @Get('lead/:leadId')
  async findByLead(@Param('leadId') leadId: string) {
    const data = await this.service.findByLead(leadId);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.UPDATE_INTERACTION)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Interaction>) {
    return this.service.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_INTERACTION)
  @Delete('bulk')
  async deleteMany(@Body() body: { ids: string[] }) {
    return this.service.deleteMany(body.ids);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions(PermissionsEnum.DELETE_INTERACTION)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post('transcribe-audio')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('audioFile', {
      storage: memoryStorage(),
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
        } else {
          cb(new BadRequestException(`Only audio files are allowed. Received: ${file.mimetype || 'unknown'}`), false);
        }
      },
    }),
  )
  async transcribeAudio(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No audio file uploaded');
    }

    const base64Audio = file.buffer.toString('base64');

    return this.service.transcribeAudio(base64Audio, file.mimetype);

  }

  @Post('summarize')
  @UseGuards(JwtAuthGuard)
  async summarize(@Body() body: { transcript: string }) {
    if (!body.transcript || body.transcript.trim().length === 0) {
      throw new BadRequestException('Transcript is required');
    }

    return this.service.summarizeTranscript(body.transcript);
  }
}