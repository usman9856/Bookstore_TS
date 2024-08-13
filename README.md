# Simple Bookstore RESTful API

## Project Description
The aim of this project is to develop a simple RESTful API for managing a bookstore's inventory using Node.js, Express, TypeScript, and MongoDB. The API will allow for the creation, retrieval, updating, and deletion of books in the database. Additionally, it will include features for managing book purchases, maintaining stock, and handling customer authentication and reviews.

## Key Features

### Environment Setup
- **Node.js Project**: Initialize a new Node.js project using TypeScript.
- **Web Framework**: Use Express for handling HTTP requests and responses.
- **Database**: Integrate MongoDB to store and manage the bookstore's inventory.


### Execution of Project
- **Database Setup**: Database setup is easy navigate to ```bookstore_back/src/database/db_connect.ts``` and add your monogoDB URI path to connection
- **Package Setup**: Package setup is easy navigate terminal and type ```npm install``` to execute installation of packages.
- **Running Project**: To run the project first ensure the installation is complete and TypeScript is installed and then simply write ```npm run dev``` in the terminal it will use cocurrently packaget to execute the TypeScript and JavaScript commands side by side and constantly which will update and rerun as you make changes and save the file you are working on.





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
- **API Endpoints**:
  - `GET /orders`: Retrieve a list of all orders. (`router.get('/', getAllOrder)`)
  - `GET /orders/:orderId`: Retrieve details of a single order by its ID. (`router.get('/:orderId', getOrder)`)
  - `POST /orders/Buy`: Create a new order. (`router.post('/Buy', setOrder)`)

### Person Management
- **API Endpoints**:
  - `GET /Login`: Route handler for logging in a person. (`router.get('/Login', logInPerson)`)
  - `POST /Signup`: Route handler for signing up a new person. (`router.post('/Signup', signUpPerson)`)



### Authentication
- **Protected Routes**: Secure routes for ordering, managing cart, viewing order history, and updating customer profiles.
- **Review System**: Customers can leave reviews only if they have purchased the book.
- **Authentication Endpoints**:
  - `POST /auth/register`: Register a new user.
  - `POST /auth/login`: Login a user.
  - `GET /auth/profile`: Retrieve the logged-in user's profile.

### Validation and Error Handling
- **Validation**: Implemented proper validation for all endpoints to ensure data integrity and prevent invalid data.
- **Error Handling**: Ensure meaningful error messages for invalid requests and handle unexpected errors gracefully.


### Additional Features
- **Cart Management**: Allow users to add books to a cart and manage cart contents.
- **Order History**: Track and retrieve past orders for user profiles.
- **Reviews**: Enable users to leave reviews for books they have purchased.

This project hopes to demonstrate skills in backend development, database management, authentication, and testing, providing a solid foundation for building scalable and maintainable RESTful APIs.
