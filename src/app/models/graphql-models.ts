// Enums
export enum TransportType {
  PLANE = 'PLANE',
  TRAIN = 'TRAIN',
  BUS = 'BUS'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export interface Offer {
  id: string;
  destination: string;
  price: number;
  transportType: TransportType;
  availableFrom: string;
  availableTo: string;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  offer: Offer;
  user: User;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookings: Booking[];
}

export interface OfferFilter {
  destination?: string;
  priceMin?: number;
  priceMax?: number;
  transportType?: TransportType;
  availableFrom?: string;
  availableTo?: string;
}

export interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
}

export interface OfferEdge {
  cursor: string;
  node: Offer;
}

export interface OfferConnection {
  edges: OfferEdge[];
  pageInfo: PageInfo;
}
