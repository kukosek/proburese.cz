export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: 'Query';
  donates: Array<Donate>;
};


export type QueryDonatesArgs = {
  skip?: Maybe<Scalars['Float']>;
  take?: Maybe<Scalars['Float']>;
  search?: Maybe<Scalars['String']>;
  sortBy?: Maybe<SortType>;
};

export type Donate = {
  __typename?: 'Donate';
  id: Scalars['ID'];
  bankId: Scalars['String'];
  account: Scalars['String'];
  author: Scalars['String'];
  amount: Scalars['String'];
  message: Scalars['String'];
  date: Scalars['DateTime'];
  score: Scalars['Float'];
  duplicate: Scalars['Boolean'];
};


/** Enumeration for sort types */
export enum SortType {
  Hot = 'HOT',
  Newest = 'NEWEST',
  Top = 'TOP'
}
