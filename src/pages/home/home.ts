import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {StateService} from '../../services/state-service';

import {GamePage} from '../game/game';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	private audio: any = null;

	constructor(public navCtrl : NavController, public stateService : StateService) {
		this.audio = new Audio();

		this.audio.src = '../assets/music/synth_2.mp3';
		this.audio.loop = true;
		this.audio.playbackRate = 0.1;
		this.audio.volume = 0.2;
		
		this.audio.load();
		this.audio.play();
	}

	start(){
		this.audio.pause();
		this.audio = null;
		
		this.stateService.new();
		this.navCtrl.push(GamePage, null, {
			animate : true,
			animation: 'md-transition'
		});
	}

	view(){
		window.open('https://ldjam.com/events/ludum-dare/38/rsv-resourcer', '_blank');
	}

}
