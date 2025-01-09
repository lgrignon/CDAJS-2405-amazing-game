
import bodyParser from "body-parser";
import express from "express";
import fs from "node:fs";
import cors from "cors";
import { Column, DataSource, Entity, EntityManager, PrimaryGeneratedColumn } from "typeorm";

import "reflect-metadata"
import { randomUUID } from "node:crypto";
import { GameState } from "./entities/GameState";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.text({ type: 'text/plain' }));

const dataSource = new DataSource({
    type: 'sqlite',
    database: './db/amazing_game.sqlite',
    entities: ['src/entities/*.ts'],
    synchronize: true,
    logging: "all"
});

app.post("/gameState/save", async (req, res) => {
    const clientId = (req.query.clientId ?? randomUUID()) as string;
    try {
        let gameState: GameState | null = await dataSource.manager.findOne(GameState, {
            where: {
                clientId
            }
        });
        if (!gameState) {
            gameState = new GameState(clientId, '');
        }
        gameState.state = JSON.stringify(req.body);
        await dataSource.manager.save(gameState);
        res.status(200).send(clientId);
    } catch (e) {
        console.error(e, "cannot save game state for client id " + clientId)
        res.status(500).send('error during save');
    }
});

app.get("/gameState/get", async (req, res) => {
    const clientId = (req.query.clientId ?? randomUUID()) as string;
    if (!clientId) {
        res.status(400).send('bad request');
        return;
    }
    try {
        let gameState: GameState | null = await dataSource.manager.findOne(GameState, {
            where: {
                clientId
            }
        });
        if (!gameState) {
            res.status(404).send('not found');
            return;
        }
        res.status(200).send(gameState.state);
    } catch (e) {
        console.error(e, "cannot get game state for client id " + clientId)
        res.status(500).send('error during get');
    }
});

app.listen(port, async () => {

    await dataSource.initialize();

    console.log(`Example app listening on port ${port}`);
});