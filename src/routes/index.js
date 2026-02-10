const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const DominioController = require('../controllers/DominioController');
const ViewController = require('../controllers/ViewController');
const GenericController = require('../controllers/GenericController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();

// Public routes
routes.post('/signup', AuthController.signup);
routes.post('/login', AuthController.login);

// Private routes (require authentication)
routes.use(authMiddleware);

// Specialized Controllers
routes.get('/dominios', DominioController.index);
routes.get('/dominios/:id', DominioController.show);
routes.post('/dominios', DominioController.store);
routes.put('/dominios/:id', DominioController.update);
routes.delete('/dominios/:id', DominioController.destroy);

routes.get('/views/tipos-em-uso', ViewController.getTiposEmUso);

// Automating CRUD for all other relevant models
const models = [
    { name: 'alerta', id: 'id_alerta' },
    { name: 'area_entrega', id: 'id_area_entrega' },
    { name: 'aviso', id: 'id_aviso' },
    { name: 'carrinho_complemento', id: 'id_carrinho_complemento' },
    { name: 'carrinho_produto', id: 'id_carrinho_produto' },
    { name: 'categoria', id: 'id_categoria' },
    { name: 'complemento_item', id: 'id_complemento_item' },
    { name: 'complemento_tipo', id: 'id_complemento_tipo' },
    { name: 'cupom', id: 'id_cupom' },
    { name: 'endereco', id: 'id_endereco' },
    { name: 'estabelecimento', id: 'id_estabelecimento' },
    { name: 'horario_funcionamento', id: 'id_horario_funcionamento' },
    { name: 'lista_carrinho_complemento', id: 'id_lista_carrinho_complemento' },
    { name: 'lista_carrinho_produto', id: 'id_lista_carrinho_produto' },
    { name: 'lista_complemento_item', id: 'id_lista_complemento_item' },
    { name: 'lista_complemento_tipo', id: 'id_lista_complemento_tipo' },
    { name: 'lista_forma_pagamento', id: 'id_lista_forma_pagamento' },
    { name: 'pedido', id: 'id_pedido' },
    { name: 'plano', id: 'id_plano' },
    { name: 'produto', id: 'id_produto' },
    { name: 'receber_pagar', id: 'id_receber_pagar' },
    { name: 'tipo_categoria', id: 'id_tipo_categoria' },
    { name: 'usuario', id: 'id_usuario' }
];

models.forEach(model => {
    const controller = new GenericController(model.name, model.id);
    const path = `/${model.name.replace(/_/g, '-')}`;

    routes.get(path, controller.index);
    routes.get(`${path}/:id`, controller.show);
    routes.post(path, controller.store);
    routes.put(`${path}/:id`, controller.update);
    routes.delete(`${path}/:id`, controller.destroy);
});

module.exports = routes;
