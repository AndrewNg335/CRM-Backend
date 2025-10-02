import { Controller, Get, Post, Patch, Param, Body, Query, Delete, Put, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from 'src/schemas/task.schema';
import { parseHttpQueryToMongo } from 'src/common/utils/query-parser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permissions } from 'src/auth/permissions.decorator';
import { Permissions as PermissionsEnum } from 'src/common/enums/permissions.enum';

@Controller('tasks')
export class TasksController {
    constructor(private readonly service: TasksService) { }

    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.VIEW_TASKS_ALL)
    @Get()
    async findAll(@Query() raw: Record<string, any>) {
        const parsed = parseHttpQueryToMongo(raw, {
            textSearchFields: ['title', 'description'],
            allowedFilterFields: ['stage', 'ownerId', 'leadId', 'dueDateFrom', 'dueDateTo'],
            defaultSort: { dueDate: 1 },
        });

        const { items, total, page, pageSize, totalPages } = await this.service.findAllParsed(parsed);
        return { data: items, total, page, pageSize, totalPages };
    }

    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.VIEW_TASKS_SELF)
    @Get('user/:userId')
    async findByUserId(@Param('userId') userId: string, @Query() raw: Record<string, any>) {
        const parsed = parseHttpQueryToMongo(raw, {
            textSearchFields: ['title', 'description'],
            allowedFilterFields: ['stage', 'dueDateFrom', 'dueDateTo', 'userId'],
            defaultSort: { dueDate: 1 },
        });
        const { items, total, page, pageSize, totalPages } = await this.service.findByUserId(userId, parsed);
        return { data: items, total, page, pageSize, totalPages };
    }

    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.CREATE_TASK)
    @Post()
    async create(@Body() body: Partial<Task>) {
        if (!body.stage) {
            body.stage = "todo";
        }
        const data = await this.service.create(body);
        return { data };
    }

    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.VIEW_SINGLE_TASK)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const data = await this.service.findById(id);
        return { data };
    }


    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.UPDATE_TASK)
    @Put(':id')
    async update(@Param('id') id: string, @Body() body: Partial<Task>) {
        const data = await this.service.update(id, body);
        return { data };
    }

    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.DELETE_TASK)
    @Delete('bulk')
    async deleteMany(@Body() body: { ids: string[] }) {
        return this.service.deleteMany(body.ids);
    }

    @UseGuards(JwtAuthGuard)
    @Permissions(PermissionsEnum.DELETE_TASK)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}
