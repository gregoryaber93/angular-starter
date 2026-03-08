// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, catchError, map, throwError } from 'rxjs';
// import { User } from '../models/api-models';

// @Injectable({
//   providedIn: 'root',
// })
// export class GraphqlService {
//   private apiUrl = 'http://localhost:3001/';

//   constructor(private http: HttpClient) {}

//   getUsers(): Observable<User[]> {
//     const query = `
//       query {
//         users {
//             id
//             name
//             email
//           }
//       }
//       `;

//     return this.executeQuery<{ users: { data: User[] } }>(query).pipe(
//       map((response) => response.users.data)
//     );
//   }

//   getUserById(id: number): Observable<User> {
//     const query = `
//       query GetUser($id: ID!) {
//         user(id: $id) {
//           id
//           name
//           email
//         }
//       }
//     `;

//     const variables = { id: id };

//     return this.executeQuery<{ user: User }>(query, variables).pipe(
//       map((response) => response.user)
//     );
//   }

//   getUsersByPage(page: number, limit: number): Observable<User[]> {
//     const query = `
//       query GetUsers($page: Int, $limit: Int) {
//         users(options: { paginate: { page: $page, limit: $limit } }) {
//           data {
//             id
//             title
//             body
//           }
//         }
//       }
//     `;
//     const variables = { page, limit };
//     return this.executeQuery<{ users: { data: User[] } }>(query, variables).pipe(
//       map((response) => response.users.data)
//     );
//   }

//   createUser(user: User): Observable<User> {
//     const mutation = `
//       mutation CreateUser($input: CreateUserInput!) {
//         createUser(input: $input) {
//           id
//           name
//           email
//         }
//       }
//     `;

//     const variables = {
//       input: user,
//     };
//     return this.executeQuery<{ createUser: User }>(mutation, variables).pipe(
//       map((response) => response.createUser)
//     );
//   }

//   updateUser(id: number, user: User): Observable<User> {
//     const mutation = `
//       mutation UpdateUser($id: ID!, $input: CreateUserInput!) {
//         updateUser(id: $id, input: $input) {
//           id
//           name
//           email
//         }
//       }
//     `;

//     const variables = {
//       id: id,
//       input: user,
//     };
//     return this.executeQuery<{ updateUser: User }>(mutation, variables).pipe(
//       map((response) => response.updateUser)
//     );
//   }

//   deleteUser(id: number): Observable<User> {
//     const mutation = `mutation DeleteUser($id: ID!) {
//       deleteUser(id: $id)
//     }`;

//     const variables = {
//       id,
//     };
//     return this.executeQuery<{ deleteUser: User }>(mutation, variables).pipe(
//       map((response) => response.deleteUser)
//     );
//   }

//   private executeQuery<T>(query: string, variables?: any): Observable<T> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//     });

//     const body = {
//       query,
//       variables: variables || {},
//     };

//     return this.http.post<{ data: T }>(this.apiUrl, body, { headers }).pipe(
//       map((response) => response.data),
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: any): Observable<never> {
//     console.error('GraphQL Error:', error);
//     return throwError(() => new Error(error.message || 'GraphQL Service Error'));
//   }
// }
