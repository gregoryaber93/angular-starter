// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RestService } from '../services/rest.service';
// import { ToastService } from '../services/toast.service';
// import { User } from '../models/api-models';
// import { GraphqlService } from '../services/graphql.service';

// @Component({
//   selector: 'graphql-component',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './graphql.component.html',
//   styleUrls: ['./graphql.component.css'],
// })
// export class GraphqlComponent implements OnInit {
//   users: User[] = [];
//   newUser: User = { id: 0, name: '', email: '' };
//   editingUser: User | null = null;
//   showUserAddForm: boolean = false;
//   showUserEditForm: boolean = false;

//   constructor(
//     private graphqlApi: GraphqlService,
//     private toastService: ToastService
//   ) {}

//   ngOnInit(): void {
//     this.fetchUsers();
//   }

//   fetchUsers(): void {
//     // this.users = [
//     //   {
//     //     id: 1,
//     //     name: 'John Doe',
//     //     email: 'asd',
//     //   },
//     //   {
//     //     id: 2,
//     //     name: 'Jane Smith',
//     //     email: 'qwe',
//     //   },
//     //   {
//     //     id: 3,
//     //     name: 'Alice Johnson',
//     //     email: 'zxc',
//     //   },
//     // ];
//     this.graphqlApi.getUsers().subscribe({
//       next: (users) => {
//         this.users = users;
//         console.log('Fetched users:', users);
//       },
//       error: (error) => {
//         console.error('Error fetching users:', error);
//       },
//       complete: () => {
//         console.log('Users fetch completed');
//       },
//     });
//   }

//   addUser(): void {
//     // const maxId = this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) : 0;
//     // const newId = maxId + 1;
//     // this.users.push({ ...this.newUser, id: newId });
//     // console.log('User added:', this.newUser);
//     // this.newUser = { id: 0, name: '', email: '' };
//     // this.showUserAddForm = false;
//     this.graphqlApi.createUser(this.newUser).subscribe({
//       next: (user) => {
//         this.users.push(user);
//         this.newUser = { id: 0, name: '', email: '' };
//         this.showUserAddForm = false;
//         console.log('User added:', user);
//       },
//       error: (error) => {
//         console.error('Error adding user:', error);
//       },
//     });
//   }

//   clearNewUser(): void {
//     this.newUser = { id: 0, name: '', email: '' };
//   }

//   editUser(user: User): void {
//     this.editingUser = { ...user };
//     this.showUserEditForm = true;
//   }

//   updateUser(updatedUser: User): void {
//     // const index = this.users.findIndex((u) => u.id === updatedUser.id);
//     // if (index !== -1) {
//     //   this.users[index] = updatedUser;
//     // }

//     // this.showUserEditForm = false;
//     // this.editingUser = null;
//     this.graphqlApi.updateUser(updatedUser.id, updatedUser).subscribe({
//       next: (user) => {
//         const index = this.users.findIndex((u) => u.id === user.id);
//         if (index !== -1) {
//           this.users[index] = user;
//         }
//       },
//     });
//   }

//   deleteUser(userId: number): void {
//     // this.users = this.users.filter((u) => u.id !== userId);
//     // console.log('User deleted with ID:', userId);
//     this.graphqlApi.deleteUser(userId).subscribe({
//       next: () => {
//         this.users = this.users.filter((u) => u.id !== userId);
//         console.log('User deleted with ID:', userId);
//       },
//       error: (error) => {
//         console.error('Error deleting user:', error);
//       },
//     });
//   }

//   getUserById(id: number): void {
//     const user = this.users.find((u) => u.id === id);
//     // alert(user ? `User Found: ${user.name}` : `User with ID ${id} not found`);
//     // if (user) {
//     //   this.toastService.show(
//     //     `User Found: ${user.name}`,
//     //     user,
//     //     'success',
//     //     5000
//     //   );
//     //   console.log('Fetched user:', user);
//     // } else {
//     //   this.toastService.show(
//     //     `User with ID ${id} not found`,
//     //     null,
//     //     'error',
//     //     3000
//     //   );
//     // }
//       this.graphqlApi.getUserById(id).subscribe({
//         next: (user) => {
//           this.toastService.show(
//             `User Found: ${user.name}`,
//             user,
//             'success',
//             5000
//           );
//           console.log('Fetched user:', user);
//         },
//         error: (error) => {
//           this.toastService.show(
//             `Error fetching user with ID ${id}`,
//             error,
//             'error',
//             3000
//           );
//           console.error(`Error fetching user with ID ${id}:`, error);
//         },
//       });
//   }
// }
