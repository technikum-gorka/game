import type { WebSocket, WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';

declare module 'ws' {
    interface WebSocket {
        id: string;
    }
}

interface IRoom {
    id: string;
    players: Map<string, IPlayer>;
    ownerId: string;
    settingPlayerId?: string;
    stage: 'waiting' | 'guessing' | 'finished' | 'setting';
    guesses: { playerId: string; number: number }[];
    number?: number;
}

interface IPlayer {
    id: string;
    nickname: string;
    roomId: string;
    socket: WebSocket;
    guess?: number;
}

type TMessage = {
    type: 'create_room'
} | {
    type: 'start_room'
} | {
    type: 'guess';
    number: number;
} | {
    type: 'join_room';
    roomId: string;
    nickname: string;
} | {
    type: 'leave_room';
} | {
    type: 'set_number';
    number: number;
} | {
    type: 'get_rooms';
}

const sockets = new Set<WebSocket>();
const players = new Map<string, IPlayer>();
const rooms = new Map<string, IRoom>();

function broadcastToRoom(roomId: string, message: string) {
    const room = rooms.get(roomId);

    room?.players.forEach((player) => {
        player.socket.send(message);
    });
}

function playersToArray(room: IRoom) {
    return Array.from(room.players).map(([id, player]) => ({ id, nickname: player.nickname, guess: player.guess }));
}

function getRandomPlayer(map: Map<string, IPlayer>): IPlayer {
    const keys = Array.from(map.keys());
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const randomValue = map.get(randomKey);
    return randomValue!;
}

function initRoom(room: IRoom) {
    room.stage = 'setting';

    const settinger = getRandomPlayer(room.players);
    room.settingPlayerId = settinger.id;

    
    broadcastToRoom(room.id, JSON.stringify({ type: 'set_number' }));
    settinger.socket.send(JSON.stringify({ type: 'set_number', isSetter: true }));
}

export function SOCKET(
    client: WebSocket,
    request: import('http').IncomingMessage,
    server: WebSocketServer,
    context: { params: Record<string, string | string[]> },
) {
    client.id = uuid();
    sockets.add(client);

    client.on('close', () => {
        sockets.delete(client);
        players.delete(client.id);
    });

    client.on('message', (message) => {
        handleMessage(message.toString());
    });

    async function handleMessage(message: string) {
        try {
            const data = JSON.parse(message) as TMessage;
            const player = players.get(client.id);
    
            console.log(data);

            switch (data.type) {
                case 'get_rooms': {
                    const roomsArray = Array.from(rooms.values()).filter(room => room.stage === 'waiting').map(room => ({ id: room.id, players: room.players.size }));
                    client.send(JSON.stringify({ type: 'get_rooms', rooms: roomsArray }));
                    break;
                }

                case 'create_room': {
                    if (player?.roomId) return;
                    
                    const room: IRoom = {
                        id: uuid(),
                        players: new Map(),
                        ownerId: client.id,
                        stage: 'waiting',
                        guesses: []
                    };

                    rooms.set(room.id, room);

                    client.send(JSON.stringify({ type: 'create_room', roomId: room.id }));

                    // owner has a minute to join, remove the room otherwise
                    setTimeout(() => {
                        if (room.players.size === 0 || room.ownerId !== client.id || player?.roomId !== room.id) {
                            rooms.delete(room.id);
                        }
                    }, 60_000);

                    break;
                }

                case 'join_room': {
                    if (player?.roomId) return;

                    const newPlayer: IPlayer = player || {
                        id: client.id,
                        nickname: data.nickname,
                        roomId: data.roomId,
                        socket: client,
                        guess: 0
                    }
                    const roomId = data.roomId;
                    const room = rooms.get(roomId);

                    if (!room) {
                        client.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                        return;
                    }

                    // if (room.ownerId === client.id) {
                    //     client.send(JSON.stringify({ type: 'error', message: 'You are the owner of this room' }));
                    //     return;
                    // }

                    if (room.stage !== 'waiting') {
                        client.send(JSON.stringify({ type: 'error', message: 'Room is already in progress' }));
                        return;
                    }

                    room.players.set(client.id, newPlayer);

                    players.set(client.id, {
                        id: client.id,
                        nickname: data.nickname,
                        roomId: room.id,
                        socket: client,
                        guess: 0
                    });

                    client.send(JSON.stringify({ type: 'join_room', roomId: room.id }));

                    broadcastToRoom(room.id, JSON.stringify({ type: 'player_list', players: playersToArray(room) }));
                    break;
                }

                case 'leave_room': {
                    if (!player?.roomId) return;

                    const room = rooms.get(player.roomId);

                    if (!room) {
                        client.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                        return;
                    }

                    room.players.delete(client.id);
                    players.delete(client.id);

                    client.send(JSON.stringify({ type: 'leave_room' }));
                    broadcastToRoom(room.id, JSON.stringify({ type: 'player_list', players: playersToArray(room) }));

                    break;
                }

                case 'start_room': {
                    if (!player?.roomId) return;

                    const room = rooms.get(player.roomId);

                    if (!room) {
                        client.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                        return;
                    }

                    if (room.ownerId !== client.id) {
                        client.send(JSON.stringify({ type: 'error', message: 'You are not the owner of this room' }));
                        return;
                    }

                    if (room.stage !== 'waiting') {
                        client.send(JSON.stringify({ type: 'error', message: 'Room is already in progress' }));
                        return;
                    }

                    if (room.players.size < 2) {
                        client.send(JSON.stringify({ type: 'error', message: 'Room must have at least 2 players' }));
                        return;
                    }

                    room.stage = 'guessing';
                    broadcastToRoom(room.id, JSON.stringify({ type: 'start_room' }));
                    initRoom(room);

                    break;
                }

                case 'guess': {
                    if (!player?.roomId) return;
                    
                    const room = rooms.get(player.roomId);
                    
                    if (!room) {
                        client.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
                        return;
                    }

                    if (room.stage !== 'guessing') {
                        client.send(JSON.stringify({ type: 'error', message: 'Room is not in progress' }));
                        return;
                    }

                    if (room.settingPlayerId === client.id) return;

                    if (data.number < 0 || data.number > 100) {
                        client.send(JSON.stringify({ type: 'error', message: 'Number must be between 0 and 100' }));
                        return;
                    }

                    if (room.guesses.some(guess => guess.playerId === client.id)) {
                        client.send(JSON.stringify({ type: 'error', message: 'You have already guessed' }));
                        return;
                    }

                    room.guesses.push({
                        playerId: client.id,
                        number: data.number
                    });
                    player.guess = data.number;

                    broadcastToRoom(room.id, JSON.stringify({ type: 'guess', guess: data.number, playerId: client.id }));

                    if (room.guesses.length === room.players.size - 1) {
                        room.stage = 'finished';
                        
                        // get closest guessers
                        // if multiple players are the same distance from each other, pick one with the guess furtherst away from 50
                        // if two players guessed the same number and both are the closest, pick two of them as winners
                        const closestGuessers = Array.from(room.guesses).sort((a, b) => Math.abs(a.number - 50) - Math.abs(b.number - 50)).slice(0, 2);
                        const closestGuessersIds = closestGuessers.map(guess => guess.playerId);

                        broadcastToRoom(room.id, JSON.stringify({ type: 'winners', winners: closestGuessersIds, number: room.number, players: playersToArray(room) }));
                        broadcastToRoom(room.id, JSON.stringify({ type: 'player_list', players: playersToArray(room) }));

                        setTimeout(() => {
                            initRoom(room);
                        }, 10_000);
                    }

                    break;
                }

                case 'set_number': {
                    console.log('AHHA')
                    if (!player?.roomId) return console.log('P');
                    
                    const room = rooms.get(player.roomId);
                    
                    if (!room) return console.log('A');
                    if (room.stage !== 'setting') return console.log('S');
                    if (room.settingPlayerId !== client.id) return console.log('D');
                    if (data.number < 0 || data.number > 100) {
                        client.send(JSON.stringify({ type: 'error', message: 'Number must be between 0 and 100' }));
                        return;
                    }

                    delete player.guess;
                    room.number = data.number;
                    room.stage = 'guessing';

                    broadcastToRoom(room.id, JSON.stringify({ type: 'guess' }));

                    break;
                }

                default: {
                    console.error('Invalid message type');
                    break;
                }
            }
        } catch (error) {
            console.error(error);
            return;
        }
    }
}