import * as fs from 'fs';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { getMetadataArgsStorage } from 'typeorm';
import { join } from 'path';

export default () => {
  const isProd = process.env.NODE_ENV === 'production';
  const isDev = process.env.NODE_ENV === 'development';
  const isStaging = process.env.NODE_ENV === 'staging';

  const TMP_UPLOAD_DIR_NAME = 'tmp';
  const ASSET_DIR_NAME = 'assets';
  const UPLOAD_DIR = 'public';
  const assetDir = UPLOAD_DIR + '/' + ASSET_DIR_NAME;
  const tmpDir = UPLOAD_DIR + '/' + TMP_UPLOAD_DIR_NAME;

  const webAppDomain = process.env.WEB_APP_DOMAIN;

  fs.mkdir(UPLOAD_DIR, (): void => {
    fs.mkdir(assetDir, (): void => { });
    fs.mkdir(tmpDir, (): void => { });
  });

  Handlebars.registerHelper('formatDate', function () {
    var year = new Date().getFullYear();
    return year;
  });

  return {
    isProd,
    isDev,
    isStaging,
    port: parseInt(process.env.APP_PORT, 10) || 3100,
    domain: process.env.APP_DOMAIN,
    webAppDomain,
    defaultUserPicture: webAppDomain + '/public/img/user_placeholder.svg',

    uploadDir: UPLOAD_DIR,
    assetDir,
    assetDirName: ASSET_DIR_NAME,
    tmpDir,
    tmpDirName: TMP_UPLOAD_DIR_NAME,

    auth: {
      secret: process.env.AUTH_SECRET,
      expiresIn: +process.env.AUTH_EXPIRES_IN || 2592000,
      facebook: {
        clientId: process.env.AUTH_FB_CLIENT_ID,
        secret: process.env.AUTH_FB_SECRET,
      }
    },
    hcaptcha: {
      secret: process.env.HCAPTCHA_SECRET,
    },
    typeorm: {
      type: 'postgres',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: parseInt(process.env.TYPEORM_PORT, 10) || 1433,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      logging: isDev ? ['query', 'error'] : ['error'],
      logger: 'advanced-console',
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: false,
      autoLoadEntities: true,
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      db: parseInt(process.env.REDIS_DB, 10) || 0,
      password: process.env.REDIS_PASSWORD,
    },
    mail: {
      transport: {
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        debug: true
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
      preview: true,
      template: {
        dir: join(process.cwd(), 'templates/pages'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      options: {
        partials: {
          dir: join(process.cwd(), 'templates/partials'),
        },
      },
    },
    stripe: {
      secret: process.env.STRIPE_SECRET_KEY,
    },
    sentry: {
      dsn: process.env.SENTRY_DSN,
      debug: isProd ? false : true,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
    }
  };
};
