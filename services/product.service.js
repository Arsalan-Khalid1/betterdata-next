import axios from "axios";

export class ProductService {
  static index() {
    return axios({
      url: "https://fakestoreapi.com/products",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    });
  }
  static show(id) {
    return axios({
      url: `https://fakestoreapi.com/products/${id}`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    });
  }
  static getCategory() {
    return axios({
      url: "https://fakestoreapi.com/products/categories",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      method: "GET",
    });
  }
}
