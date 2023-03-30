const fs = require('fs').promises;

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      product.id = products.length + 1;
      products.push(product);
      await this.saveProducts(products);
      return product.id;
    } catch (error) {
      console.error('Error agregando producto');
      return null;
    }
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'Error') {
        return [];
      }
      console.error('Error consiguiendo productos');
      return null;
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find((product) => product.id === id) || null;
    } catch (error) {
      console.error('Error consiguiendo productos por id');
      return null;
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        return false;
      }
      const updatedProduct = { ...products[index], ...updatedFields };
      products[index] = updatedProduct;
      await this.saveProducts(products);
      return true;
    } catch (error) {
      console.error('Error actualizando product id');
      return false;
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((product) => product.id === id);
      if (index === -1) {
        return false;
      }
      products.splice(index, 1);
      await this.saveProducts(products);
      return true;
    } catch (error) {
      console.error('Error eliminando id del producto' );
      return false;
    }
  }

  async saveProducts(products) {
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error('Error guardando productos' );
    }
  }
}

const productManager = new ProductManager('./products.json');

const newProduct = {
  title: 'Nuevo producto',
  description: 'Descripción del nuevo producto',
  price: 99.99,
  thumbnail: 'https://url-del-thumbnail',
  code: 'NP001',
  stock: 10
};


productManager.addProduct(newProduct)
  .then(product => console.log('Producto agregado correctamente:', product))
  .catch(error => console.error('Error al agregar el producto:', error));

