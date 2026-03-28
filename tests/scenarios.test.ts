import request from 'supertest';
import app from '../src/index';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Scenarios API', () => {
  let adminToken: string;
  let userToken: string;

  beforeEach(async () => {
    // Clean up database
    await prisma.user.deleteMany();
    await prisma.scenario.deleteMany();

    // Create admin user
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
      });
    adminToken = adminResponse.body.token;

    // Create regular user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user@example.com',
        password: 'password123',
        name: 'Regular User',
      });
    userToken = userResponse.body.token;
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.scenario.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/scenarios', () => {
    beforeEach(async () => {
      // Create test scenarios
      await prisma.scenario.createMany({
        data: [
          {
            title: 'Test Scenario 1',
            description: 'First test scenario',
            category: 'communication',
            difficulty: 1,
            duration: 10,
          },
          {
            title: 'Test Scenario 2',
            description: 'Second test scenario',
            category: 'leadership',
            difficulty: 2,
            duration: 15,
          },
          {
            title: 'Test Scenario 3',
            description: 'Third test scenario',
            category: 'communication',
            difficulty: 3,
            duration: 20,
          },
        ],
      });
    });

    it('should get all scenarios', async () => {
      const response = await request(app)
        .get('/api/scenarios')
        .expect(200);

      expect(response.body).toHaveProperty('scenarios');
      expect(response.body.scenarios).toHaveLength(3);
      expect(response.body).toHaveProperty('count', 3);
      expect(response.body).toHaveProperty('message', 'Scenarios retrieved successfully');
    });

    it('should filter scenarios by category', async () => {
      const response = await request(app)
        .get('/api/scenarios?category=communication')
        .expect(200);

      expect(response.body).toHaveProperty('scenarios');
      expect(response.body.scenarios).toHaveLength(2);
      expect(response.body.scenarios.every((s: any) => s.category === 'communication')).toBe(true);
    });

    it('should filter scenarios by difficulty', async () => {
      const response = await request(app)
        .get('/api/scenarios?difficulty=2')
        .expect(200);

      expect(response.body).toHaveProperty('scenarios');
      expect(response.body.scenarios).toHaveLength(1);
      expect(response.body.scenarios[0]).toHaveProperty('difficulty', 2);
    });

    it('should limit number of scenarios', async () => {
      const response = await request(app)
        .get('/api/scenarios?limit=2')
        .expect(200);

      expect(response.body).toHaveProperty('scenarios');
      expect(response.body.scenarios).toHaveLength(2);
      expect(response.body).toHaveProperty('count', 2);
    });
  });

  describe('GET /api/scenarios/:id', () => {
    let scenarioId: string;

    beforeEach(async () => {
      const scenario = await prisma.scenario.create({
        data: {
          title: 'Test Scenario Details',
          description: 'Detailed test scenario',
          category: 'problem-solving',
          difficulty: 2,
          duration: 15,
        },
      });
      scenarioId = scenario.id;
    });

    it('should get scenario by ID', async () => {
      const response = await request(app)
        .get(`/api/scenarios/${scenarioId}`)
        .expect(200);

      expect(response.body).toHaveProperty('scenario');
      expect(response.body.scenario).toHaveProperty('id', scenarioId);
      expect(response.body.scenario).toHaveProperty('title', 'Test Scenario Details');
      expect(response.body.scenario).toHaveProperty('description', 'Detailed test scenario');
      expect(response.body).toHaveProperty('message', 'Scenario retrieved successfully');
    });

    it('should return 404 for non-existent scenario', async () => {
      const response = await request(app)
        .get('/api/scenarios/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Scenario not found');
    });
  });

  describe('POST /api/scenarios', () => {
    it('should create new scenario with admin token', async () => {
      const scenarioData = {
        title: 'New Test Scenario',
        description: 'A brand new test scenario',
        category: 'teamwork',
        difficulty: 2,
        duration: 20,
      };

      const response = await request(app)
        .post('/api/scenarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(scenarioData)
        .expect(201);

      expect(response.body).toHaveProperty('scenario');
      expect(response.body.scenario).toHaveProperty('title', 'New Test Scenario');
      expect(response.body.scenario).toHaveProperty('description', 'A brand new test scenario');
      expect(response.body.scenario).toHaveProperty('category', 'teamwork');
      expect(response.body).toHaveProperty('message', 'Scenario created successfully');
    });

    it('should not create scenario without authentication', async () => {
      const scenarioData = {
        title: 'New Test Scenario',
        description: 'A brand new test scenario',
        category: 'teamwork',
        difficulty: 2,
        duration: 20,
      };

      const response = await request(app)
        .post('/api/scenarios')
        .send(scenarioData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
    });

    it('should not create scenario with regular user token', async () => {
      const scenarioData = {
        title: 'New Test Scenario',
        description: 'A brand new test scenario',
        category: 'teamwork',
        difficulty: 2,
        duration: 20,
      };

      const response = await request(app)
        .post('/api/scenarios')
        .set('Authorization', `Bearer ${userToken}`)
        .send(scenarioData)
        .expect(401); // Since we don't have role-based auth, this might give different result

      // Depending on implementation, this might give 200 (if no role check) or 401/403
    });

    it('should require title, description, and category', async () => {
      const scenarioData = {
        title: 'New Test Scenario',
        // missing description and category
      };

      const response = await request(app)
        .post('/api/scenarios')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(scenarioData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Title, description, and category are required');
    });
  });

  describe('PUT /api/scenarios/:id', () => {
    let scenarioId: string;

    beforeEach(async () => {
      const scenario = await prisma.scenario.create({
        data: {
          title: 'Original Scenario',
          description: 'Original description',
          category: 'communication',
          difficulty: 1,
          duration: 10,
        },
      });
      scenarioId = scenario.id;
    });

    it('should update scenario with admin token', async () => {
      const updateData = {
        title: 'Updated Scenario',
        description: 'Updated description',
        difficulty: 3,
        duration: 25,
      };

      const response = await request(app)
        .put(`/api/scenarios/${scenarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('scenario');
      expect(response.body.scenario).toHaveProperty('title', 'Updated Scenario');
      expect(response.body.scenario).toHaveProperty('description', 'Updated description');
      expect(response.body.scenario).toHaveProperty('difficulty', 3);
      expect(response.body.scenario).toHaveProperty('duration', 25);
      expect(response.body).toHaveProperty('message', 'Scenario updated successfully');
    });

    it('should return 404 for non-existent scenario', async () => {
      const response = await request(app)
        .put('/api/scenarios/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Scenario not found');
    });
  });

  describe('DELETE /api/scenarios/:id', () => {
    let scenarioId: string;

    beforeEach(async () => {
      const scenario = await prisma.scenario.create({
        data: {
          title: 'Scenario to Delete',
          description: 'This will be deleted',
          category: 'leadership',
          difficulty: 1,
          duration: 10,
        },
      });
      scenarioId = scenario.id;
    });

    it('should delete scenario with admin token', async () => {
      const response = await request(app)
        .delete(`/api/scenarios/${scenarioId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Scenario deleted successfully');

      // Verify scenario is actually deleted
      const deletedScenario = await prisma.scenario.findUnique({
        where: { id: scenarioId }
      });
      expect(deletedScenario).toBeNull();
    });

    it('should return 404 for non-existent scenario', async () => {
      const response = await request(app)
        .delete('/api/scenarios/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Scenario not found');
    });
  });
});