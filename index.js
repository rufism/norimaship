const router = require('koa-router')();
const logger = require('koa-logger');
const koaBody = require('koa-body');
const serve = require('koa-static');
const views = require('koa-views');
const uuid = require('uuid/v4');
const path = require('path');

const Koa = require('koa');
const app = new Koa();

// internal data store
const datastore = {};

app.use(logger());

app.use(views(path.join(__dirname, '/views'), { extension: 'ejs' }));

app.use(koaBody());

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

router.get('/', async (ctx) => {
    await ctx.render('home');
});

router.get('/game/:id', async (ctx) => {
    await ctx.render('game', { id: ctx.params.id, game: datastore[ctx.params.id] });
});

// Games
router.get('/heartbeat', heartbeat)
router.post('/game', createGame)
router.get('/game/:id', getGame)
router.post('/game/:id/start', startGame)
router.get('/game/:id/player/:pid/pieces', getPlayerPieces)
router.post('/game/:id/player/:pid/pieces', setPlayerPieces)
router.get('/game/:id/shots', getGameShots)
router.post('/game/:id/shot', createGameShot);

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
