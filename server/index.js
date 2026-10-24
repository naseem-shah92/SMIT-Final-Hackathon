import app from './app.js';
import { ENV } from './config/env.js';
import { AuthService } from './services/auth.service.js';

async function bootstrap() {
  try {
    // Initialize baseline enterprise accounts
    await AuthService.initBaselineAccounts();
    console.log('[System] Baseline security accounts verified.');

    const server = app.listen(ENV.PORT, () => {
      console.log('====================================================');
      console.log(`🚀 Saylani HCM Lite Enterprise Backend Server Live`);
      console.log(`📡 Listening on: http://localhost:${ENV.PORT}`);
      console.log(`📋 API Health:   http://localhost:${ENV.PORT}/api/health`);
      console.log(`🔒 Mode:         ${ENV.NODE_ENV.toUpperCase()}`);
      console.log('====================================================');
    });

    // Graceful Shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated.');
      });
    });
  } catch (err) {
    console.error('Fatal initialization error:', err);
    process.exit(1);
  }
}

bootstrap();
