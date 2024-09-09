const { getAll, getById, create, update, delete: deleteEspece } = require('../../controllers/empreinteController');
const {connection} = require('../../config/database');
const handleRequestError = require('../../utils/handleRequestError');

jest.mock('../../config/database');
jest.mock('../../utils/handleRequestError');


describe('Empreinte Controller', () => {

    afterEach(() => {
        jest.clearAllMocks(); // Nettoie les mocks après chaque test
    });

    describe('getAll', () => {
        it('should return all empreintes', () => {
            const req = {};
            const res = {
                json: jest.fn(),
            };
            const mockResults = [{ idEmpreinte: 1, idUser: 1, idEspece: 2, adresseImage: 'url.jpg' }];

            connection.query.mockImplementation((query, callback) => {
                callback(null, mockResults);
            });

            getAll(req, res);

            expect(connection.query).toHaveBeenCalledWith('SELECT * FROM Empreinte', expect.any(Function));
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
        it('should return empreinte by id', () => {
            const req = { params: { id: 1 } };
            const res = {
                json: jest.fn(),
            };
            const mockResults = [{ idEmpreinte: 1, idUser: 1, idEspece: 2, adresseImage: 'url.jpg' }];

            connection.query.mockImplementation((query, values, callback) => {
                callback(null, mockResults);
            });

            getById(req, res);

            expect(connection.query).toHaveBeenCalledWith('SELECT * FROM Empreinte WHERE idEmpreinte = ?', [1], expect.any(Function));
            expect(res.json).toHaveBeenCalledWith(mockResults[0]);
        });

        it('should return 404 if empreinte not found', () => {
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
            expect(res.json).toHaveBeenCalledWith({ message: 'Empreinte non trouvée' });
        });

        it('should handle database error', () => {
            const req = { params: { id: 1 } };
            const res = {};
            const mockError = new Error('DB error');

            connection.query.mockImplementation((query, values, callback) => {
                callback(mockError);
            });

            getById(req, res);

            expect(handleRequestError).toHaveBeenCalledWith(res, mockError);
        });
    });

    describe('create', () => {
        it('should create a new empreinte', () => {
            const req = {
                body: {
                    idUser: 1,
                    idEspece: 2,
                    adresseImage: 'url.jpg',
                    datePhoto: '2023-09-01',
                    heurePhoto: '10:00',
                    localisation: 'somewhere'
                }
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
                'INSERT INTO Empreinte (idUser, idEspece, adresseImage, datePhoto, heurePhoto, localisation) VALUES (?, ?, ?, ?, ?, ?)',
                [1, 2, 'url.jpg', '2023-09-01', '10:00', 'somewhere'],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: mockInsertId });
        });

        it('should handle database error during creation', () => {
            const req = {
                body: {
                    idUser: 1,
                    idEspece: 2,
                    adresseImage: 'url.jpg',
                    datePhoto: '2023-09-01',
                    heurePhoto: '10:00',
                    localisation: 'somewhere'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockError = new Error('DB error');

            connection.query.mockImplementation((query, values, callback) => {
                callback(mockError);
            });

            create(req, res);

            expect(handleRequestError).toHaveBeenCalledWith(res, mockError);
        });
    });

    describe('update', () => {
        it('should update an existing empreinte', () => {
            const req = {
                params: { id: 1 },
                body: { adresseImage: 'updatedUrl.jpg' }
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
                'UPDATE Empreinte SET ? WHERE idEmpreinte = ?',
                [req.body, req.params.id],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Empreinte mise à jour avec succès' });
        });

        it('should return 404 if empreinte not found for update', () => {
            const req = {
                params: { id: 999 },
                body: { adresseImage: 'updatedUrl.jpg' }
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
            expect(res.json).toHaveBeenCalledWith({ message: 'Empreinte non trouvée' });
        });

        it('should handle database error during update', () => {
            const req = {
                params: { id: 1 },
                body: { adresseImage: 'updatedUrl.jpg' }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockError = new Error('DB error');

            connection.query.mockImplementation((query, values, callback) => {
                callback(mockError);
            });

            update(req, res);

            expect(handleRequestError).toHaveBeenCalledWith(res, mockError);
        });
    });


});