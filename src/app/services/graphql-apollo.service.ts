import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
  Offer,
  Booking,
  User,
  OfferFilter,
  OfferConnection,
  PageInfo,
  OfferEdge,
  TransportType,
  BookingStatus
} from '../models/graphql-models';

@Injectable({
  providedIn: 'root',
})
export class GraphqlApolloService {
  constructor(private apollo: Apollo) {}

  getOffers(
    filter?: OfferFilter,
    first?: number,
    after?: string
  ): Observable<OfferConnection> {
    const GET_OFFERS = gql`
      query GetOffers($filter: OfferFilter, $first: Int, $after: String) {
        offers(filter: $filter, first: $first, after: $after) {
          edges {
            cursor
            node {
              id
              destination
              price
              transportType
              availableFrom
              availableTo
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    `;

    return this.apollo
      .query<{ offers: OfferConnection }>({
        query: GET_OFFERS,
        variables: { filter, first, after },
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from query');
          }
          return result.data.offers;
        }),
        catchError(this.handleError)
      );
  }

  getMe(): Observable<User | null> {
    const GET_ME = gql`
      query GetMe {
        me {
          id
          name
          email
          bookings {
            id
            status
            updatedAt
            offer {
              id
              destination
              price
              transportType
              availableFrom
              availableTo
            }
          }
        }
      }
    `;

    return this.apollo
      .query<{ me: User | null }>({
        query: GET_ME,
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from query');
          }
          return result.data.me;
        }),
        catchError(this.handleError)
      );
  }

  bookOffer(offerId: string): Observable<Booking> {
    const BOOK_OFFER = gql`
      mutation BookOffer($offerId: ID!) {
        bookOffer(offerId: $offerId) {
          id
          status
          updatedAt
          offer {
            id
            destination
            price
            transportType
            availableFrom
            availableTo
          }
          user {
            id
            name
            email
          }
        }
      }
    `;

    return this.apollo
      .mutate<{ bookOffer: Booking }>({
        mutation: BOOK_OFFER,
        variables: { offerId },
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from mutation');
          }
          return result.data.bookOffer;
        }),
        catchError(this.handleError)
      );
  }

  subscribeToBookingStatus(bookingId: string): Observable<Booking> {
    const BOOKING_STATUS_SUBSCRIPTION = gql`
      subscription BookingStatusChanged($bookingId: ID!) {
        bookingStatusChanged(bookingId: $bookingId) {
          id
          status
          updatedAt
          offer {
            id
            destination
            price
            transportType
            availableFrom
            availableTo
          }
          user {
            id
            name
            email
          }
        }
      }
    `;

    return this.apollo
      .subscribe<{ bookingStatusChanged: Booking }>({
        query: BOOKING_STATUS_SUBSCRIPTION,
        variables: { bookingId },
      })
      .pipe(
        map((result) => {
          if (!result.data) {
            throw new Error('No data returned from subscription');
          }
          return result.data.bookingStatusChanged;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('GraphQL Apollo Error:', error);
    return throwError(
      () => new Error(error.message || 'GraphQL Apollo Service Error')
    );
  }
}

