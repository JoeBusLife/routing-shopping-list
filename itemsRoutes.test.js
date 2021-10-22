process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app');
let items = require('./fakeDb');

dog = {name: 'dog', price: 2.99}
cat = {name: 'cat', price: 1.99}
chair = {name: 'chair', price: 99.99}

beforeEach(function(){
	items.push(dog, cat, chair);
});

afterEach(function(){
	items.length = 0;
});

describe('GET /items', function(){
	test('Gets a list of items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ items: [dog, cat, chair] });
	});
});

describe('POST /items', function(){
	test('Create an item', async () => {
		const table = {name: 'table', price: 450}
		const res = await request(app).post('/items').send(table);
		expect(res.statusCode).toEqual(201);
		expect(res.body).toEqual({ added: table });
	});
	test("Responds 400 for invalid item info", async () => {
		const badItem = {name: 'air'}
		const res = await request(app).post(`/items`).send(badItem);
		expect(res.statusCode).toEqual(400);
		const res2 = await request(app).post(`/items`).send({});
		expect(res2.statusCode).toEqual(400);
	});
});

describe('GET /items/:name', function(){
	test('Get item by name', async () => {
		const res = await request(app).get(`/items/${dog.name}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual(dog);
	});
	test("Responds 404 for invalid item", async () => {
		const res = await request(app).get(`/items/wirebrush`);
		expect(res.statusCode).toEqual(404);
	});
});

describe('PATCH /items/:name', function(){
	test("Edit an item's name & price", async () => {
		const res = await request(app).patch(`/items/${dog.name}`).send({name: 'fire', price: 0});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ updated: {name: 'fire', price: 0}});
	});
	test("Edit an item's name", async () => {
		const res = await request(app).patch(`/items/${dog.name}`).send({name: 'fire'});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ updated: {name: 'fire', price: dog.price}});
	});
	test("Edit an item's price", async () => {
		const res = await request(app).patch(`/items/${dog.name}`).send({price: 0});
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ updated: {name: dog.name, price: 0}});
	});
	test("Responds 406 when no changes submitted", async () => {
		const res = await request(app).patch(`/items/${dog.name}`).send({});
		expect(res.statusCode).toEqual(406);
	});
	test("Responds 404 for invalid item", async () => {
		const res = await request(app).patch(`/items/wirebrush`).send({name: 'fire'});
		expect(res.statusCode).toEqual(404);
	});
});

describe('DELETE /items/:name', function(){
	test("Delete an item", async () => {
		const res = await request(app).delete(`/items/${dog.name}`);
		expect(res.statusCode).toEqual(200);
		expect(res.body).toEqual({ message: `${dog.name} Deleted`});
	});
	test("Responds 404 for invalid item", async () => {
		const res = await request(app).delete(`/items/wirebrush`);
		expect(res.statusCode).toEqual(404);
	});
});