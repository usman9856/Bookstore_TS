# Simple Bookstore RESTful API

## Project Description
The aim of this project is to develop a simple RESTful API for managing a bookstore's inventory using Node.js, Express, TypeScript, and MongoDB. The API will allow for the creation, retrieval, updating, and deletion of books in the database. Additionally, it will include features for managing book purchases, maintaining stock, and handling customer authentication and reviews.

## Key Features

### Environment Setup
- **Node.js Project**: Initialize a new Node.js project using TypeScript.
- **Web Framework**: Use Express for handling HTTP requests and responses.
- **Database**: Integrate MongoDB to store and manage the bookstore's inventory.

### Book Management
- **Book Schema**: A Mongoose schema for books with the following fields:
  - Title: string, required
  - Author: string, required
  - Published Year: number, required
  - Genre: string, required
  - Price: number, required
  - In Stock: boolean, default: true
  - Rating: decimal
- **API Endpoints**:
  - `POST /books`: Add a new book to the inventory.
  - `GET /books`: Retrieve a list of all books.
  - `GET /books/:id`: Retrieve details of a single book by its ID.
  - `PUT /books/:id`: Update the details of a book by its ID.
  - `DELETE /books/:id`: Remove a book from the inventory by its ID.

### Order Management
- **Order Schema**: Create a custom Mongoose schema for orders, allowing customers to purchase books and track stock.

### Authentication
- **Protected Routes**: Secure routes for ordering, managing cart, viewing order history, and updating customer profiles.
- **Review System**: Customers can leave reviews only if they have purchased the book.

### Validation and Error Handling
- **Validation**: Implemented proper validation for all endpoints.
- **Error Handling**: Ensure meaningful error messages for invalid requests.


### Testing
- **Unit Tests**: Wrote unit tests for API endpoints using Jest/Mocha to ensure reliability.

### Version Control
- **Git**: Use Git for version control.
- **Commit Practices**: Commit code regularly with meaningful commit messages.
- **GitHub Repository**: Push code to a GitHub repository.

This project hopes to demonstrates skills in backend development, database management, authentication, and testing, providing a solid foundation for building scalable and maintainable RESTful APIs.
