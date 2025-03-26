'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function NumberGuessrPage() {
    const [winners, setWinners] = useState<string[]>([]);
    const [guess, setGuess] = useState(0);
    const [nickname, setNickname] = useState('NICE');
    const [stage, setStage] = useState<'lobby' | 'guess' | 'waiting' | 'finished' | 'setting'>('lobby');
    const [players, setPlayers] = useState<{ id: string; nickname: string; guess?: number; }[]>([]);
    const [rooms, setRooms] = useState<{ id: string; players: number []; }[]>([]);
    const [ws, setWs] = useState<WebSocket>();
    const [isOwner, setIsOwner] = useState(false);
    const [isSetting, setIsSetting] = useState(false);
    const [finishedNumber, setFinishedNumber] = useState(0);

    useEffect(() => {
        const ws = new WebSocket(`ws://${location.host}/games/number-guessr/ws`);

        ws.onopen = () => {
            setWs(ws);
        }
    }, []);

    useEffect(() => {
        if (!ws) return;
        
        ws.send(JSON.stringify({ type: 'get_rooms' }));

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data) as any;

            if (data.type === 'get_rooms') {
                setRooms(data.rooms);
            }

            if (data.type === 'create_room') {
                joinRoom(data.roomId);
                setIsOwner(true);
            }

            if (data.type === 'start_room') {
                setStage('setting');
            }

            if (data.type === 'join_room') {
                setStage('waiting');
            }

            if (data.type === 'player_list') {
                setPlayers(data.players);
            }

            if (data.type === 'leave_room') {
                setStage('lobby');
                setPlayers([]);
            }

            if (data.type === 'set_number') {
                setStage('setting');
                setIsSetting(!!data.isSetter);
            }

            if (data.type === 'guess') {
                setStage('guess');
            }

            if (data.type === 'winners') {
                setStage('finished');
                setWinners(data.winners);
                setPlayers(data.players);
                setFinishedNumber(data.number);
            }
        }
    }, [ws]);

    function joinRoom(roomId: string) {
        ws?.send(JSON.stringify({ type: 'join_room', nickname, roomId }));
    }

    function createRoom() {
        ws?.send(JSON.stringify({ type: 'create_room', nickname }));
    }

    function startRoom() {
        ws?.send(JSON.stringify({ type: 'start_room' }));
    }

    if (!ws) {
        return (
            <div className="size-full flex flex-col items-center mt-40">
                <h1>Connecting...</h1>
            </div>
        );
    }

    if (stage === 'lobby') {
        return (
            <div className="size-full flex flex-col items-center mt-40">
                <h1>Number Guessr</h1>

                <div className="flex flex-col gap-4 mt-4">
                    {rooms.map((room) => (
                        <button key={room.id} onClick={() => joinRoom(room.id)}>{room.id}</button>
                    ))}

                    {rooms.length === 0 && (
                        <p>No rooms found</p>
                    )}
                </div>

                <div className="mt-12">
                    <input placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    <div className="mt-8 flex items-center gap-2">
                        <Button onClick={createRoom}>Create Room</Button>
                        <Button onClick={() => ws.send(JSON. stringify({ type: 'get_rooms' }))}>Refresh Rooms</Button>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'waiting') {
        return (
            <div className="size-full flex flex-col items-center justify-center mt-40">
                <h1>Waiting for players</h1>

                {players.map((player) => (
                    <p key={player.id}>{player.nickname}</p>
                ))}

                {isOwner && (
                    <Button onClick={startRoom}>Start Game</Button>
                )}
            </div>
        );
    }

    if (stage === 'setting') {
        return (
            <div className="size-full flex flex-col items-center justify-center mt-40">
                <h1>Setting the number</h1>

                {isSetting && (
                    <div>
                        <input placeholder="Number" min={1} max={100} type="number" value={guess} onChange={(e) => setGuess(parseInt(e.target.value))} />
                        <Button onClick={() => ws.send(JSON.stringify({ type: 'set_number', number: guess }))}>Submit</Button>
                    </div>
                )}
            </div>
        );
    }

    if (stage === 'guess') {
        return (
            <div className="size-full flex flex-col items-center justify-center mt-40">
                <h1>Guess the number</h1>

                {!isSetting && (
                    <>
                        <input placeholder="Number" min={1} max={100} type="number" value={guess} onChange={(e) => setGuess(parseInt(e.target.value))} />
                        <Button onClick={() => ws.send(JSON.stringify({ type: 'guess', number: guess }))}>Submit</Button>
                    </>   
                )}

                <div className="mt-12">
                    {players.filter(player => player.guess).map((player) => (
                        <p key={player.id}>{player.nickname}: {player.guess}</p>
                    ))}
                </div>
            </div>
        );
    }

    if (stage === 'finished') {
        return (
            <div className="size-full flex flex-col items-center justify-center mt-40">
                <h1>Finished</h1>

                <p>The number was {finishedNumber}</p>

                <div className="mt-12">
                    {players.map((player) => (
                        <p key={player.id}>{player.nickname}: {player.guess || '-'} {winners.includes(player.id) ? '🏆' : ''}</p>
                    ))}
                </div>
            </div>
        );
    }

    return <>Invalid Stage ig</>;
}