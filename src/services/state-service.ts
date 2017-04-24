import {Injectable} from '@angular/core';

import {GameService} from './game-service';

@Injectable()
export class StateService {
	constructor(public gameService : GameService) {
	}

	new() {
		this.gameService.initialize();

		this.gameService.addPods(5);
	}

	save() {

	}

	restore() {

	}
}