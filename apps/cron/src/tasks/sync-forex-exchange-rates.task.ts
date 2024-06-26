import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  currencyCodesWithName,
  CurrencyCodeInterface,
} from '@forexsystem/helpers/utils';
import { getForexExchangeRateUrl } from '../helpers/url-builder';
import { ConfigService } from '@forexsystem/nestjs-libraries/config/config.service';
import { ForexExchangeRateUrlProps } from '../types';
import { v4 as uuidV4 } from 'uuid';
import {
  ForexJobPattern,
  SyncForexExchangeRateJob,
} from '@forexsystem/helpers/jobs';
import { generateTimestamp } from '@forexsystem/helpers/utils';
import { InjectForexExchangeRatesQueue } from '@forexsystem/nestjs-libraries/bull-mq-queue/decorators/inject-queue.decorator';
import { Queue } from 'bullmq';

@Injectable()
export class SyncForexExchangeRateService {
  constructor(
    private readonly _configService: ConfigService,
    @InjectForexExchangeRatesQueue() private _forexExchangeRatesQueue: Queue
  ) {}

  // THIS CRON WILL ONLY ADD THE USD TO JPY FETCHING URL
  // DUE TO ALPHA VANTAGE API HARD RATE LIMIT (i.e 25 requests a day only)
  @Cron(CronExpression.EVERY_30_SECONDS)
  async syncForexExchangeRatesEvery30SecondsWithDemoKey() {
    const forex_exchange_rates_expires_at_milliseconds = 1000 * 30;
    const forex_exchange_rates_id = uuidV4();
    const forex_exchange_rates_expires_at = generateTimestamp(
      forex_exchange_rates_expires_at_milliseconds
    );
    const params: ForexExchangeRateUrlProps = {
      to_currency: 'JPY',
      apiKey: this._configService.ALPHA_VANTAGE_API_KEYS,
    };

    const url = getForexExchangeRateUrl(params);

    const eventData: SyncForexExchangeRateJob['data'] = {
      url,
      forex_exchange_rates_id,
      forex_exchange_rates_expires_at,
    };

    this._forexExchangeRatesQueue.add(
      ForexJobPattern.SYNC_FOREX_EXCHANGE_RATES,
      { ...eventData }
    );
    console.log('Adding jobs to queue :', forex_exchange_rates_id);
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // async syncForexRatesEvery30Seconds() {
  //   const forex_exchange_rates_expires_at_milliseconds = 1000 * 30;
  //   const forex_exchange_rates_id = uuidV4();
  //   const forex_exchange_rates_expires_at = generateTimestamp(
  //     forex_exchange_rates_expires_at_milliseconds
  //   );
  //   currencyCodesWithName.map(async (currency: CurrencyCodeInterface) => {
  //     const params: ForexExchangeRateUrlProps = {
  //       to_currency: currency.code,
  //       apiKey: this._configService.ALPHA_VANTAGE_API_KEYS,
  //     };
  //     const url = getForexExchangeRateUrl(params);

  //     const eventData: SyncForexExchangeRateJob['data'] = {
  //       url,
  //       forex_exchange_rates_id,
  //       forex_exchange_rates_expires_at,
  //     };

  //     console.log('adding job :', forex_exchange_rates_id);
  //     this._forexExchangeRatesQueue.add(
  //       ForexJobPattern.SYNC_FOREX_EXCHANGE_RATES,
  //       { ...eventData }
  //     );
  //   });
  // }
}
