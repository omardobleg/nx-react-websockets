/*
https://docs.nestjs.com/providers#services
*/

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BoredElement } from '@org/models';
import { interval, map, mergeMap, skipWhile, take, tap } from 'rxjs';

@Injectable()
export class PollingService {
  url = 'https://www.boredapi.com/api/activity';
  constructor(private readonly httpClient: HttpService) {}
  poll(threshold = 0.7, intervalTime = 1000) {
    let attempts = 0;
    return interval(intervalTime).pipe(
      mergeMap(() => this.httpClient.get<BoredElement>(this.url)),
      tap((data) => {
        attempts++;
        console.log('Data feched', attempts, data.data.activity);
      }),
      map((resp) => ({ ...resp.data, attempts })),
      skipWhile((resp) => resp.accessibility < threshold),
      take(1)
    );
  }
}
