const logger = require('koa-logger');
const router = require('koa-router')();
const koaBody = require('koa-body');
const views = require('koa-views');
const path = require('path');
const uuid = require('uuid/v4')

const Koa = require('koa');
const app = new Koa();

// internal data store
const datastore = {};

app.use(logger());

app.use(views(path.join(__dirname, '/views')));

app.use(koaBody());

// Games
router.get('/heartbeat', heartbeat)
    .post('/game', createGame)
    .get('/game/:id', getGame)
    .post('/game/:id/start', startGame)
    .get('/game/:id/player/:pid/pieces', getPlayerPieces)
    .post('/game/:id/player/:pid/pieces', setPlayerPieces)
    .get('/game/:id/shots', getGameShots)
    .post('/game/:id/shot', createGameShot);

app.use(router.routes());

app.listen(3000);

async function heartbeat(ctx) {
    ctx.body = 'OK';
}

async function getGame(ctx) {
    ctx.body = datastore[ctx.params.id];
}

async function createGame(ctx) {
    const gameId = await uuid();
    datastore[gameId] = {
        started: false,
        players: [1, 2],
        currPlayer: 1,
        pieces: {
            '1': null,
            '2': null,
        },
        shots: [],
    };

    ctx.body = `New game created: ${gameId}`;
}

async function startGame(ctx) {
    datastore[ctx.params.id].started = true;

    ctx.body = `Game started: ${ctx.params.id}`;
}

async function getPlayerPieces(ctx) {
    ctx.body = datastore[ctx.params.id].pieces[ctx.params.pid];
}

async function setPlayerPieces(ctx) {
    datastore[ctx.params.id].pieces[ctx.params.pid] = ctx.request.body.pieces;

    ctx.body = `Player ${ctx.params.pid} updated their pieces for game: ${ctx.params.id}`;
}

async function getGameShots(ctx) {
    ctx.body = datastore[ctx.params.id].shots
}

async function createGameShot(ctx) {
    datastore[ctx.params.id].shots = ctx.request.body.shots;

    ctx.body = `Player ${ctx.request.body.shots.pid} made a shot for game: ${ctx.params.id}`;
}
