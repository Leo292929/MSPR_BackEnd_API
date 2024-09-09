const { getAll, getById, create, update, delete: deleteEspece } = require('../../controllers/especeController');
const {connection} = require('../../config/database');
const handleRequestError = require('../../utils/handleRequestError');

jest.mock('../../config/database');
jest.mock('../../utils/handleRequestError');

describe('Espece Controller', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Nettoie les mocks après chaque test
    });

    describe('getAll', () => {
        it('should return all species', () => {
            const req = {};
            const res = {
                json: jest.fn(),
            };
            const mockResults = [{ idEspece: 1, nomEspece: 'Tiger' }];

            connection.query.mockImplementation((query, callback) => {
                callback(null, mockResults);
            });

            getAll(req, res);

            expect(connection.query).toHaveBeenCalledWith('SELECT * FROM Espece', expect.any(Function));
            expect(res.json).toHaveBeenCalledWith(mockResults);
        });

        it('should handle database error', () => {
            const req = {};
            const res = {};
            const mockError = new Error('DB error');

            connection.query.mockImplementation((query, callback) => {
                callback(mockError);
            });

            getAll(req, res);

            expect(handleRequestError).toHaveBeenCalledWith(res, mockError);
        });
    });

    describe('getById', () => {
        it('should return species by id', () => {
            const req = { params: { id: 1 } };
            const res = {
                json: jest.fn(),
            };
            const mockResults = [{ idEspece: 1, nomEspece: 'Tiger' }];

            connection.query.mockImplementation((query, values, callback) => {
                callback(null, mockResults);
            });

            getById(req, res);

            expect(connection.query).toHaveBeenCalledWith('SELECT * FROM Espece WHERE idEspece = ?', [1], expect.any(Function));
            expect(res.json).toHaveBeenCalledWith(mockResults[0]);
        });

        it('should return 404 if species not found', () => {
            const req = { params: { id: 999 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            connection.query.mockImplementation((query, values, callback) => {
                callback(null, []);
            });

            getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Espèce non trouvée' });
        });

    
    });

    describe('create', () => {
        it('should create a new species', () => {
            const req = {
                body: { nomEspece: 'Tiger', descriptionEspece: 'Big cat' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockInsertId = 1;

            connection.query.mockImplementation((query, values, callback) => {
                callback(null, { insertId: mockInsertId });
            });

            create(req, res);

            expect(connection.query).toHaveBeenCalledWith(
                'INSERT INTO Espece (nomEspece, descriptionEspece) VALUES (?, ?)',
                ['Tiger', 'Big cat'],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ idEspece: mockInsertId });
        });

        it('should return 400 if nomEspece or descriptionEspece is missing', () => {
            const req = { body: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Le nom de l\'espèce et sa description sont requis' });
        });

    
    });

    describe('update', () => {
        it('should update an existing species', () => {
            const req = {
                params: { id: 1 },
                body: { nomEspece: 'Updated Tiger' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockResults = { affectedRows: 1 };

            connection.query.mockImplementation((query, values, callback) => {
                callback(null, mockResults);
            });

            update(req, res);

            expect(connection.query).toHaveBeenCalledWith(
                'UPDATE Espece SET ? WHERE idEspece = ?',
                [req.body, req.params.id],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Espèce mise à jour avec succès' });
        });

        it('should return 404 if species not found', () => {
            const req = {
                params: { id: 999 },
                body: { nomEspece: 'Updated Tiger' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            connection.query.mockImplementation((query, values, callback) => {
                callback(null, { affectedRows: 0 });
            });

            update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Espèce non trouvée' });
        });

        
    });

    describe('delete', () => {
        it('should delete an existing species', () => {
            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockResults = { affectedRows: 1 };

            connection.query.mockImplementation((query, values, callback) => {
                callback(null, mockResults);
            });

            deleteEspece(req, res);

            expect(connection.query).toHaveBeenCalledWith('DELETE FROM Espece WHERE idEspece = ?', [1], expect.any(Function));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Espèce supprimée avec succès' });
        });

        it('should return 404 if species not found', () => {
            const req = { params: { id: 999 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            connection.query.mockImplementation((query, values, callback) => {
                callback(null, { affectedRows: 0 });
            });

            deleteEspece(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Espèce non trouvée' });
        });

    });
});