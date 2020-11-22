import { RequestInit } from 'node-fetch';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

export interface RequestOptions<T extends ParsedUrlQuery = ParsedUrlQuery> extends RequestInit {
  ctx?: GetServerSidePropsContext<T>;
  pathVariable?: (ctx: GetServerSidePropsContext<T>) => string;
}
