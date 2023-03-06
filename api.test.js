const request = require('supertest');
const app = require('./server');
const User = require('./model/user.model');
const Todo = require('./model/todo.model');
const Post = require('./model/post.model');
const comments = require('./model/comment.model')

describe('API endpoints', () => {
  let userToken;
  let user;
  let todo;
  let post;
  let comments;

  beforeAll(async () => {
    // Create a test user
    user = await User.create({
      username: 'testuser',
      password: 'password',
    });

    // Create a test todo
    todo = await Todo.create({
      user: user._id,
      title: 'Test Todo',
      completed: false,
    });

    // Create a test post
    post = await Post.create({
      user: user._id,
      text: 'Test Post',
    });

    // Create a test comments
    comments = await comments.create({
      user: user._id,
      post: post._id,
      text: 'Test comments',
    });

    // Authenticate the test user
    const response = await request(app)
      .post('/login')
      .send({ username: 'testuser', password: 'password' });

    userToken = response.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    // await User.deleteMany();
    // await Todo.deleteMany();
    // await Post.deleteMany();
    // await comments.deleteMany();
  });

  describe('POST /user', () => {
    test('should create a new user', async () => {
      const response = await request(app)
        .post('/user')
        .send({ username: 'newuser', password: 'password' });

      expect(response.status).toBe(201);
      expect(response.body.username).toBe('newuser');
    });

    test('should return 400 if username is missing', async () => {
      const response = await request(app)
        .post('/user')
        .send({ password: 'password' });

      expect(response.status).toBe(400);
    });

    test('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/user')
        .send({ username: 'newuser' });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /login',() => {
    test('should authenticate an existing user', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeTruthy();
    });

    test('should return 401 if username is incorrect', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'wronguser', password: 'password' });

      expect(response.status).toBe(401);
    });

    test('should return 401 if password is incorrect', async () => {
      const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /todo', () => {
    test('should return 401 if user is not authenticated', async () => {
        const response = await request(app).get('/todo');
  
        expect(response.status).toBe(401);
      });
    });
  
    describe('POST /todo', () => {
      test('should create a new todo for authenticated user', async () => {
        const response = await request(app)
          .post('/todo')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ title: 'New Todo' });
  
        expect(response.status).toBe(201);
        expect(response.body.title).toBe('New Todo');
      });
  
      test('should return 401 if user is not authenticated', async () => {
        const response = await request(app).post('/todo').send({ title: 'New Todo' });
  
        expect(response.status).toBe(401);
      });
    });
  
    describe('GET /todo/:id', () => {
      test('should get a todo by id for authenticated user', async () => {
        const response = await request(app)
          .get(`/todo/${todo._id}`)
          .set('Authorization', `Bearer ${userToken}`);
  
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Test Todo');
      });
  
      test('should return 401 if user is not authenticated', async () => {
        const response = await request(app).get(`/todo/${todo._id}`);
  
        expect(response.status).toBe(401);
      });
  
      test('should return 404 if todo does not exist', async () => {
        const response = await request(app)
          .get('/todo/000000000000000000000000')
          .set('Authorization', `Bearer ${userToken}`);
  
        expect(response.status).toBe(404);
      });
    });
  
    describe('PUT /todo/:id', () => {
      test('should update a todo by id for authenticated user', async () => {
        const response = await request(app)
          .put(`/todo/${todo._id}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ completed: true });
  
        expect(response.status).toBe(200);
        expect(response.body.completed).toBe(true);
      });
  
      test('should return 401 if user is not authenticated', async () => {
        const response = await request(app)
          .put(`/todo/${todo._id}`)
          .send({ completed: true });
  
        expect(response.status).toBe(401);
      });
  
      test('should return 404 if todo does not exist', async () => {
        const response = await request(app)
          .put('/todo/000000000000000000000000')
          .set('Authorization', `Bearer ${userToken}`)
          .send({ completed: true });
  
        expect(response.status).toBe(404);
      });
    });
    describe('DELETE /todo/:id', () => {
        test('should delete a todo by id for authenticated user', async () => {
          const response = await request(app)
            .delete(`/todo/${todo._id}`)
            .set('Authorization', `Bearer ${userToken}`);
    
          expect(response.status).toBe(204);
    
          const deletedTodo = await Todo.findById(todo._id);
          expect(deletedTodo).toBeFalsy();
        });
    
        test('should return 401 if user is not authenticated', async () => {
          const response = await request(app).delete(`/todo/${todo._id}`);
    
          expect(response.status).toBe(401);
        });
    });
});