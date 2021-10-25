export default () => ({
  app: {
    environment: process.env.NODE_ENV || 'development',
    encryption_key: process.env.SERVER_SECRET || 'AppSecret',
  },
  service: {
    name: 'Weedle App',
    port: process.env.PORT || 4003,
    host: `${process.env.BASE_URL || 'http://localhost'}:${
      process.env.PORT || 4003
    }`,
    url: `${process.env.BASE_URL || 'http://localhost'}:${
      process.env.PORT || 4003
    }`,
    verify_redirect_url:
      `${process.env.DOMAIN}/verify` ||
      `http://${process.env.BASE_URL}:${process.env.PORT}/verify`,
    reset_redirect_url:
      `${process.env.DOMAIN}/reset` ||
      `http://${process.env.BASE_URL}:${process.env.PORT}/reset`,
    no_reply: { email: 'no-reply@joinweedle.com', name: 'Weedle App' },
    version: 1,
    lang: 'en',
    pagination: {
      items_per_page: 10,
    },
    database: {
      postgres: {
        host: `${process.env.DB_HOST || ''}`,
        username: `${process.env.DB_USERNAME || ''}`,
        password: `${process.env.DB_PASSWORD || ''}`,
        post: Number(process.env.DB_PORT || ''),
        database: `${process.env.DB_DATABASE || ''}`,
      },
    },
    email_templates: {
      verify_account: process.env.VERIFY_ACCOUNT || '',
    },
    google: {
      gcs: {
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFile: process.env.GOOGLE_CLOUD_KEYFILE,
        bucket: process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
      },
    },
    rabbitMQ: {
      url: process.env.RABBITMQ_URL || '',
    },
    amazon: {
      s3: {
        key: process.env.AWS_ACCESS_KEY || '',
        secret: process.env.AWS_SECRET_KEY || '',
        bucket: process.env.AWS_BUCKET || '',
        region: process.env.AWS_REGION || '',
      },
    },
  },
});
