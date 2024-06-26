import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@forexsystem/nestjs-libraries/dal/redis/redis.service';
import {
  ForexExchangeRatesData,
  ForexExchangeRatesRedisData,
} from '@forexsystem/helpers/interfaces';
import { CurrencyCode } from '@prisma/client';

// CRON JOB WILL UPDATE THE SAME KEY IN EVERY 30 SECONDS
const FOREX_EXCHANGE_RATES_TTL = 60;
const FOREX_EXCHANGE_RATES_LASTEST_TTL = 60;

@Injectable()
export class SaveForexExchangeRateToRedisService {
  private readonly logger = new Logger(
    SaveForexExchangeRateToRedisService.name
  );
  constructor(private readonly _redisSerivce: RedisService) {}

  async saveForexExchangeRateToRedis(data: ForexExchangeRatesData) {
    // check if the forex exchange rates exists or not
    this.logger.debug('Saving forex exchange rates in redis');
    try {
      const forexExchangeRate: ForexExchangeRatesRedisData = {
        forex_exchange_rates_id: data.forex_exchange_rates_id,
        forex_exchange_rates_expires_at: data.forex_exchange_rates_expires_at,
        currency_exchange_rates: [data.currency_exchange_rates],
      };

      await this._redisSerivce.setForexExchangeRateWithExpiry(
        `${data.currency_exchange_rates.from_currency_code}:${data.currency_exchange_rates.to_currency_code}`,
        forexExchangeRate,
        FOREX_EXCHANGE_RATES_TTL
      );

      // const forex_exchange_rates =
      //   (await this._redisSerivce.getForexExchangeRate(
      //     data.forex_exchange_rates_id
      //   )) as ForexExchangeRatesRedisData | null;

      // if (!forex_exchange_rates) {
      //   await this._redisSerivce.setForexExchangeRate(
      //     data.forex_exchange_rates_id,
      //     forexExchangeRate,
      //     FOREX_EXCHANGE_RATES_TTL
      //   );
      // } else {
      //   // copying the previous currency exchange rates
      //   const previousCurrencyExchangeRate =
      //     forex_exchange_rates.currency_exchange_rates;

      //   const updatedforexExchangeRate: ForexExchangeRatesRedisData = {
      //     forex_exchange_rates_id: data.forex_exchange_rates_id,
      //     forex_exchange_rates_expires_at: data.forex_exchange_rates_expires_at,
      //     currency_exchange_rates: [
      //       ...previousCurrencyExchangeRate,
      //       data.currency_exchange_rates,
      //     ],
      //   };

      //   // await this._redisSerivce.deleteForexExchangeRateById(
      //   //   data.forex_exchange_rates_id
      //   // );

      //   await this._redisSerivce.setForexExchangeRate(
      //     data.forex_exchange_rates_id,
      //     updatedforexExchangeRate,
      //     FOREX_EXCHANGE_RATES_TTL
      //   );
      // }
    } catch (e) {
      this.logger.error('Error in saving forex exchange rates in redis:', e);
      throw e;
    }
  }

  async getForexExchangeRate(
    from_currency_code: CurrencyCode,
    to_currency_code: CurrencyCode
  ) {
    try {
      return await this._redisSerivce.getForexExchangeRate(
        `${from_currency_code}:${to_currency_code}`
      );
    } catch (e) {
      this.logger.error('Error in saving forex exchange rates in redis:', e);
      throw e;
    }
  }

  async setForexExchangeRateAsLastest(
    key: string,
    data: ForexExchangeRatesRedisData
  ) {
    try {
      return await this._redisSerivce.setForexExchangeRateWithExpiry(
        key,
        data,
        FOREX_EXCHANGE_RATES_LASTEST_TTL
      );
    } catch (e) {
      this.logger.error('Error in saving forex exchange rates in redis:', e);
      throw e;
    }
  }
}
