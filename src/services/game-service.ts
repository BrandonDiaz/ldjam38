import {Injectable} from '@angular/core';

import {DreamService} from './dream-service';
import {NameService} from './name-service';

@Injectable()
export class GameService {
	public state: any = null;
	public toolbox: any = {};
	public employee: number = null;
	public ai_name: string = null;
	public map_size: number = 7;

	constructor(public dreamService : DreamService, public nameService : NameService) {
		this.initialize();
	}

	initialize() {
		this.state = {
			pods   : [],
			cpu    : 0,
			ram    : 100,
			deaths : 0,
			paused : true
		};

		this.employee = Math.floor(Math.random() * 10000 + 99999);
		this.ai_name = 'UNTITLED_AI_' + Math.floor(Math.random() * 100 + 999);

		this.toolbox = {
			agents     : this.dreamService.agents,
			constructs : this.dreamService.constructs
		};
	}

	addPods(number){
		for (let i = 0; i < number; i++) {
			this.state.pods.push({
				name : this.nameService.generate(),
				age  : Math.floor(Math.random() * (50) + 20),
				health : 100,
				needs : {
					excitement : 100,
					interaction : 100,
					immersion : 100
				},
				dream : {
					theme : this.dreamService.generateTheme(),
					size  : 7,
					agents : [
						{
							type : 'crew',
							x : 2,
							y : 2
						}
					],
					constructs : []
				}
			});
		}

		this.calculateUsage();
	}

	calculateUsage(){
		let cpu = 0;
		let ram = 100;

		this.state.pods.forEach(function(pod){
			if (!pod.dead) {
				cpu += pod.dream.size * 1.5;
				ram -= pod.dream.size * 1.25;
			}

			pod.dream.agents.forEach(function(agent){
				if (agent.type != 'crew') {
					cpu += agent.cost.cpu;
					ram += agent.cost.ram;
				}
			});

			pod.dream.constructs.forEach(function(construct){
				cpu += construct.cost.cpu;
				ram += construct.cost.ram;
			});
		});

		this.state.cpu = Math.max(cpu + (Math.random() < 0.5 ? -0.1 : 0.1), 0);
		this.state.ram = ram;

		if (this.state.cpu > 100) {
			this.state.cpu = Math.floor(this.state.cpu);
		}
	}

	calculateNeeds(){
		let self = this;

		this.state.pods.map(function(pod){
			if (!pod.dead && pod.health <= 0) {

				pod.dead = true;
				self.state.deaths++;

				return pod;
			}

			pod.needs.excitement  = Math.max(pod.needs.excitement  - (Math.random() * 1), 0);
			pod.needs.interaction = Math.max(pod.needs.interaction - (Math.random() * 1), 0);
			pod.needs.immersion   = Math.max(pod.needs.immersion   - (Math.random() * 1), 0);

			pod.dream.agents.forEach(function(agent){
				if (agent.type != 'crew') {
					pod.needs.excitement  = Math.min(pod.needs.excitement + agent.needs.excitement, 100);
					pod.needs.interaction = Math.min(pod.needs.interaction + agent.needs.interaction, 100);
					pod.needs.immersion   = Math.min(pod.needs.immersion + agent.needs.immersion, 100);
				}
			});

			pod.dream.constructs.forEach(function(construct){
				pod.needs.excitement  = Math.min(pod.needs.excitement + construct.needs.excitement, 100);
				pod.needs.interaction = Math.min(pod.needs.interaction + construct.needs.interaction, 100);
				pod.needs.immersion   = Math.min(pod.needs.immersion + construct.needs.immersion, 100);
			});

			pod.health = Math.floor(Math.min(pod.needs.excitement, pod.needs.interaction, pod.needs.immersion));

			return pod;
		});
	}

	eraseTileConstructs(pod, x, y){
		pod.dream.constructs = pod.dream.constructs.filter(function(construct) {
			return (construct.x != x && construct.y != y);
		});
	}

	getTileContents(pod, x, y){
		let agent = null;
		let construct = null;

		for (let i = 0; i < pod.dream.agents.length; i++) {
			if (pod.dream.agents[i].x == x && pod.dream.agents[i].y ==y) {
				agent = pod.dream.agents[i];
				break;
			}
		}

		for (let i = 0; i < pod.dream.constructs.length; i++) {
			if (pod.dream.constructs[i].x == x && pod.dream.constructs[i].y ==y) {
				construct = pod.dream.constructs[i];
				break;
			}
		}

		return {
			agent     : agent,
			construct : construct
		};
	}

	processPodAI(){
		let self = this;

		this.state.pods.map(function(pod){
			pod.dream.agents.map(function(entity){
				let x = Math.min(Math.max(entity.x + (Math.random() < 0.5 ? -1 : 1), 0), self.map_size - 1);
				let y = Math.min(Math.max(entity.y + (Math.random() < 0.5 ? -1 : 1), 0), self.map_size - 1);

				let contents = self.getTileContents(pod, x, y);

				if (!contents.agent && !contents.construct) {
					entity.x = x;
					entity.y = y;
				}

				if (entity.lifetime) {
					entity.lifetime--;
				}

				return entity;
			});

			pod.dream.agents = pod.dream.agents.filter(function(agent){
				return (agent.type == 'crew' || agent.lifetime > 0);
			});

			return pod;
		});
	}
}