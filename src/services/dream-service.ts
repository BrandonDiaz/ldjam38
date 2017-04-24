import {Injectable} from '@angular/core';

@Injectable()
export class DreamService {
	public themes: string[] = [];
	public agents:any[] = [];
	public constructs:any[] = [];

	constructor() {
		this.populateThemes();
		this.populateAgents();
		this.populateConstructs();
	}

	generateTheme() {
		return this.themes[Math.floor(Math.random() * (this.themes.length))];
	}

	populateThemes(){
		this.themes = [
			'adventure'
		];
	}

	populateAgents(){
		this.agents = [
			{
				type : 'human',
				class : 'agent',
				name : 'Human Surrogate',
				lifetime : 15,
				cost : {
					cpu : 35,
					ram : 10
				},
				needs : {
					excitement : 1,
					interaction : 3,
					immersion : 2
				}
			},
			{
				type : 'snail',
				class : 'agent',
				name : 'Lifesize Snail',
				lifetime : 30,
				cost : {
					cpu : 15,
					ram : 20
				},
				needs : {
					excitement : 3,
					interaction : 0,
					immersion : 1
				}
			}
		];
	}

	populateConstructs(){
		this.constructs = [
			{
				type : 'tree_round',
				class : 'construct',
				name : 'Round Human Tree',
				cost : {
					cpu : 0,
					ram : 7.5
				},
				needs : {
					excitement : 0,
					interaction : 0,
					immersion : 0.5
				}
			},
			{
				type : 'bike',
				class : 'construct',
				name : 'Adult Bike',
				cost : {
					cpu : 0,
					ram : 10
				},
				needs : {
					excitement : 0.5,
					interaction : 0.2,
					immersion : 0
				}
			},
			{
				type : 'rocks',
				class : 'construct',
				name : 'Two Rocks',
				cost : {
					cpu : 0,
					ram : 5
				},
				needs : {
					excitement : 0,
					interaction : 0,
					immersion : 0.1
				}
			}
		];
	}
}