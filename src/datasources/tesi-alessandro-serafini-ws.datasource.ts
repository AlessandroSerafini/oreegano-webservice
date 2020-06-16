import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'TesiAlessandroSerafiniWs',
  connector: 'mysql',
  url: '',
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'tesi-alessandro-serafini-ws'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TesiAlessandroSerafiniWsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'TesiAlessandroSerafiniWs';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.TesiAlessandroSerafiniWs', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }

  /**
   * Start the datasource when application is started
   */
  async start(): Promise<void> {
    // Add your logic here to be invoked when the application is started
  }
}
