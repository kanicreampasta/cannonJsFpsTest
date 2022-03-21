import * as THREE from 'three';
import * as CANNON from 'cannon';
import "./index.css";
import { RenderingManager } from "./renderer";
import { PhysicsManager } from "./physics";
import { Player } from "./player";
import { NetworkClient } from './network';
class GameManager {
	rendering: RenderingManager;
	physics: PhysicsManager;
	players: Player[];
	playerIdMap: Map<string, Player>;
	frametime: number = 0;
	lastFrame: Date;
	keyState: KeyState = new KeyState();
	startFrame: Date;
	constructor() {
		this.rendering = new RenderingManager();
		this.physics = new PhysicsManager();
		this.players = [];
		this.playerIdMap = new Map();
		this.addPlayer(new Player(this.rendering.scene, this.physics.world));
		this.generateWorld();
		this.lastFrame = new Date();
		//add test online player
		this.addPlayer(new Player(this.rendering.scene, this.physics.world, true));
		this.startFrame = new Date();
	}
	generateWorld() {
		this.addCube(new THREE.Vector3(0, -5, 0), new THREE.Vector3(10, 1, 10), new THREE.Euler(0, 0, 0), "#f00");
		this.addCube(new THREE.Vector3(5, -5, 0), new THREE.Vector3(10, 1, 10), new THREE.Euler(45, 0, 0), "#fff");
	}
	addCube(position: THREE.Vector3, dimention: THREE.Vector3, rotation: THREE.Euler, color?: THREE.ColorRepresentation) {
		this.rendering.addCube(position, dimention, rotation, color);
		this.physics.addCube(new CANNON.Vec3(position.x, position.y, position.z), new CANNON.Vec3(dimention.x, dimention.y, dimention.z), rotation);
	}
	step() {
		const currentFrame: Date = new Date();
		const dt: number = (currentFrame.getTime() - this.lastFrame.getTime()) * 0.001;
		const time: number = (currentFrame.getTime() - this.startFrame.getTime()) * 0.001;
		if (time > 8) {
			if (this.players.length >= 3) {
				console.log(this.players.length);
				this.deletePlayerByIndex(1);
				console.log(this.players.length);
				console.log(this.players);
			}
		} else if (time > 3) {
			if (this.players.length < 3) {
				var newenemy: Player = new Player(this.rendering.scene, this.physics.world, true);
				this.addPlayer(newenemy);
				newenemy.vx = 1;
			}
		} else {
			if (Math.random() < 1 - Math.exp(-dt)) {
				this.players[1].warp(1, 0, 0);
			}
		}


		this.addThrust();
		this.physics.world.step(dt);

		for (var p of this.players) {
			p.applyGraphics();
		}
		this.rendering.setFPSCamera(this.players[0]);
		this.rendering.render();
		this.lastFrame = currentFrame;
	}
	addPlayer(player: Player, id?: string): void {
		this.players.push(player);
		if (id !== undefined) {
			this.playerIdMap.set(id, player);
		}
	}
	deletePlayerByIndex(index: number): void {
		this.players[index].delete(this.rendering.scene, this.physics.world);
		const deleted = this.players.splice(index, 1)[0];
		for (const [k, v] of this.playerIdMap) {
			if (v === deleted) {
				this.playerIdMap.delete(k);
				break;
			}
		}
	}
	deletePlayerById(id: string): void {
		if (this.playerIdMap.has(id)) {
			const playerToDelete = this.playerIdMap.get(id);
			playerToDelete.delete(this.rendering.scene, this.physics.world);
			this.playerIdMap.delete(id);
			const index = this.players.indexOf(playerToDelete);
			if (index !== -1) {
				this.players.splice(index, 1);
			}
		}
	}
	getMyPlayer(): Player {
		return this.players[0];
	}
	mouseMove(x: number, y: number) {
		this.players[0].yaw = -x / window.innerWidth * 6;
		this.players[0].pitch = -(y / window.innerHeight - 0.5) * Math.PI;
	}
	setKey(state: KeyState) {
		this.keyState = state;
	}
	addThrust() {
		const v = new THREE.Vector3(0, 0, 0);
		if (this.keyState.W) {
			v.z = 1;
		}
		if (this.keyState.S) {
			v.z = -1;
		}
		if (this.keyState.A) {
			v.x = -1;
		}
		if (this.keyState.D) {
			v.x = 1;
		}
		for (var p of this.players) {
			p.walk(v.x, v.z, this.physics.world);
		}
	}
	getCanvas(): HTMLCanvasElement {
		return this.rendering.getCanvas();
	}
}
class KeyState {
	W: boolean = false;
	A: boolean = false;
	S: boolean = false;
	D: boolean = false;
	toString(): string {
		return (this.W ? "W" : "") + (this.A ? "A" : "") + (this.S ? "S" : "") + (this.D ? "D" : "");
	}
}
let manager: GameManager = null;
let network: NetworkClient = null;
window.onload = function () {
	manager = new GameManager();
	network = new NetworkClient();
	function loop() {
		document.getElementById("log").innerText = state.toString();
		manager.step();
		requestAnimationFrame(loop);
	}
	const state: KeyState = new KeyState();
	network.init().then(() => network.start(() => {
		const player = manager.players[0];
		return {
			position: player.getPosition().toArray(),
			velocity: player.getVelocity().toArray()
		}
	})).catch(console.error)
	loop();
	{
		let mouseMoveX = 0;
		let mouseMoveY = 0;
		manager.getCanvas().onmousemove = function (e: MouseEvent) {
			mouseMoveX += e.movementX;
			mouseMoveY += e.movementY;
			manager.mouseMove(mouseMoveX, mouseMoveY);
		};
	}
	manager.setKey(state);
	window.onkeydown = function (e: KeyboardEvent) {
		if (e.code == "KeyW") {
			state.W = true;
		}
		if (e.code == "KeyA") {
			state.A = true;
		}
		if (e.code == "KeyS") {
			state.S = true;
		}
		if (e.code == "KeyD") {
			state.D = true;
		}
		manager.setKey(state);
	};
	window.onkeyup = function (e: KeyboardEvent) {
		if (e.code == "KeyW") {
			state.W = false;
		}
		if (e.code == "KeyA") {
			state.A = false;
		}
		if (e.code == "KeyS") {
			state.S = false;
		}
		if (e.code == "KeyD") {
			state.D = false;
		}
		manager.setKey(state);
	};
};