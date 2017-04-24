import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Observable} from 'rxjs';

import {DialogService} from '../../services/dialog-service';
import {GameService} from '../../services/game-service';

import {CreditsPage} from '../credits/credits';


@Component({
	selector: 'page-game',
	templateUrl: 'game.html'
})
export class GamePage {
	private audio: any = null;
	private game_over: boolean = false;
	private loop : any = null;
	private pod  : any = null;

	private tool_buffer = {};
	private map_buffer: number[] = [];

	constructor(public dialogService : DialogService, public gameService : GameService, public navCtrl : NavController) {
		this.map_buffer = [];

		for(var i = 1; i <= this.gameService.map_size; i++){
			this.map_buffer.push(i);
		}

		this.loop = Observable.interval(1000).timeInterval().subscribe(
			(status) => {
				this.gameLoop(status.value);
			}
		);
	}

	ionViewDidEnter(){
		this.dialogService.processDialog();

		this.audio = new Audio();

		this.audio.src = '../assets/music/synth_1.mp3';
		this.audio.loop = true;
		this.audio.playbackRate = 0.1;
		this.audio.volume = 0.01;

		this.audio.load();
		this.audio.play();
	}

	endGame(){
		this.navCtrl.setRoot(CreditsPage, null, {
			animate : true,
			animation: 'md-transition'
		});
	}

	gameLoop(interval){
		if (this.gameService.state.paused) {
			return false;
		}

	 	this.gameService.calculateNeeds();
	 	this.gameService.calculateUsage();

	 	if (interval % 2 == 1) {
	 	    this.gameService.processPodAI();
	    }

	    if (interval % 132 == 1) {
	 		this.dialogService.triggerFlag('idle', null);
	    }

	 	if (this.pod && this.pod.dead) {
	 	    this.exitPod();
	    }

	    this.checkStatus();
	}

	checkStatus(){
		let self = this;

		if (!this.game_over && this.gameService.state.deaths == 5) {
			this.game_over = true;

			this.dialogService.prepareOutroDialog(function(){
				self.endGame();
			});

			this.dialogService.processDialog();
		}

		this.dialogService.triggerFlag('death_' + this.gameService.state.deaths, null);

		this.gameService.state.pods.forEach(function(pod){
			if (pod.health < 25) {
				self.dialogService.triggerFlag('crew_low', {
					name : pod.name,
					age  : pod.age
				});
			}
		});

		if (this.gameService.state.cpu > 100) {
			this.dialogService.triggerFlag('low_cpu', null);
		}
	}

	enterPod(pod){
		if (pod.dead) {
			return false;
		}

		this.dialogService.triggerFlag('view_pod', {
			name : pod.name,
			age  : pod.age
		});

		pod.active = true;
		this.pod = pod;
	}

	exitPod(){
		let self = this;

		if (!this.pod.active) {
			return false;
		}
		
		this.pod.active = false;

		setTimeout(function(){
			self.pod = null;
		}, 750);
	}

	selectTool(tool){
		if (this.tool_buffer && this.tool_buffer['type'] == tool.type) {
			this.tool_buffer = {};
		} else {
			this.tool_buffer = tool;
			this.dialogService.triggerFlag('tool_' + tool.class, null);
		}
	}

	interactWithTile(x, y) {
		let contents = this.gameService.getTileContents(this.pod, x, y);

		if (contents.construct) {
		   	this.gameService.eraseTileConstructs(this.pod, x, y);
		}

		if (!this.tool_buffer['type'] || !this.pod) {
			return false;
		}

		if (this.tool_buffer['cost'].ram + this.gameService.state.ram > 100) {
			this.dialogService.triggerFlag('low_cpu', null);
			return false;
		}

		this.pod.dream[this.tool_buffer['class'] + 's'].push({
			type : this.tool_buffer['type'],
			lifetime : this.tool_buffer['lifetime'] || 0,
			cost : this.tool_buffer['cost'],
			needs : this.tool_buffer['needs'],
			x : x,
			y : y
		});

		this.tool_buffer = {};
	}

	getTileQRCode(x, y){
		let background = null;

		if (!this.pod) {
			return false;
		}

		let contents = this.gameService.getTileContents(this.pod, x, y);

		if (contents.construct) {
			background = 'url(../assets/img/qr_construct_' + contents.construct.type  + '.png)';
		}

		return background;
	}





}
