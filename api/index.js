"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
let app;
async function bootstrap() {
    if (!app) {
        app = await core_1.NestFactory.create(app_module_1.AppModule);
        const configService = app.get(config_1.ConfigService);
        app.use((0, helmet_1.default)());
        app.enableCors({
            origin: configService.get('FRONTEND_URL') || 'http://localhost:5173',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
    }
    return app;
}
async function handler(req, res) {
    const app = await bootstrap();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
}
if (process.env.NODE_ENV !== 'production') {
    bootstrap().then(async (app) => {
        const configService = app.get(config_1.ConfigService);
        const port = configService.get('PORT') || 3000;
        await app.listen(port);
        console.log(`Application is running on: http://localhost:${port}`);
    });
}
//# sourceMappingURL=main.js.map