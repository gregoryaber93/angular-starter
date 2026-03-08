import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestService } from '../services/rest.service';
import { ToastService } from '../services/toast.service';
import { Product } from '../models/api-models';

@Component({
  selector: 'rest-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.css'],
})
export class RestComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { id: 0, name: '', company: '' };
  editingProduct: Product | null = null;
  showProductAddForm: boolean = false;
  showProductEditForm: boolean = false;

  constructor(private restApi: RestService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.restApi.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        console.log('Fetched products:', products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
      complete: () => {
        console.log('Products fetch completed');
      },
    });
  }

  addProduct(): void {
    this.restApi.createProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);
        this.newProduct = { id: 0, name: '', company: '' };
        this.showProductAddForm = false;
        console.log('Product added:', product);
      },
      error: (error) => {
        console.error('Error adding product:', error);
      },
    });
  }

  clearNewProduct(): void {
    this.newProduct = { id: 0, name: '', company: '' };
  }

  editProduct(product: Product): void {
    this.editingProduct = { ...product };
    this.showProductEditForm = true;
  }

  updateProduct(updatedProduct: Product): void {
    this.showProductEditForm = false;
    this.editingProduct = null;
    this.restApi.updateProduct(updatedProduct.id, updatedProduct).subscribe({
      next: (product) => {
        const index = this.products.findIndex((u) => u.id === product.id);
        if (index !== -1) {
          this.products[index] = product;
        }
      },
    });
  }

  deleteProduct(productId: number): void {
    this.restApi.deleteProduct(productId).subscribe({
      next: () => {
        this.products = this.products.filter((u) => u.id !== productId);
        console.log('Product deleted with ID:', productId);
      },
      error: (error) => {
        console.error('Error deleting product:', error);
      },
    });
  }

  getProductById(id: number): void {
      this.restApi.getProductById(id).subscribe({
        next: (product) => {
          this.toastService.show(
            `Product Found: ${product.name}`,
            product,
            'success',
            5000
          );
          alert(product ? `Product Found: ${product.name}` : `Product with ID ${id} not found`);
          console.log('Fetched product:', product);
        },
        error: (error) => {
          this.toastService.show(
            `Error fetching product with ID ${id}`,
            error,
            'error',
            3000
          );
          console.error(`Error fetching product with ID ${id}:`, error);
        },
      });
  }
}
