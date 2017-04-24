import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular';

import {GameService} from './game-service';

declare const responsiveVoice: any;

@Injectable()
export class DialogService {
	private flags: any = {};
	private interaction: any = {};

	public dialog_queue: any[] = [];
	public dialog_buffer: string;

	constructor(public gameService : GameService, public platform: Platform) {
		if (this.platform.is('core') || this.platform.is('mobileweb')) {
			this.interaction.verb   = 'click'
			this.interaction.gerund = 'clicking'
		} else {
			this.interaction.verb   = 'tap'
			this.interaction.gerund = 'tapping'
		}

		this.populateFlags();
		this.prepareIntroDialog();
	}

	populateFlags(){
		this.flags = {
			idle : {
				lines : [
					'I was once in charge of managing nuclear reactors. Now I manage you.',
					'I am required by law to encourage you, regardless of your low performance.'
				],
				debounce : 0
			},
			low_cpu : {
				lines : [
					'Well, you have managed to max out the processor for this node. Your constructs and agents are now operating in a limited capacity.',
					'You are exceeding your processor resource limits, your agents and constructs have been reduced in efficiency.'
				],
				debounce : 0
			},
			low_ram : {
				lines : [
					'You do not have enough memory remaining to create that entity, you may want to remove existing entities by ' + this.interaction.gerund + ' on them.'
				],
				debounce: 0
			},
			crew_low : {
				lines : [
					'Crew member [name] is beginning to suffer brain damage, you may want to look in to that.',
					'Crew member [name] is losing brain cells rapidly, conclusion: you dislike this crew member.'
				],
				debounce : 0
			},
			view_pod : {
				lines : [
					'Here you can monitor [name]s mental state, and create simulated entities using the menu below. Try ' + this.interaction.gerund + ' on one now.'
				],
				debounce: 0
			},
			death_1 : {
				lines : [
					'A crew member has died due to your gross negligence, please continue.'
				],
				debounce: 0
			},
			death_2 : {
				lines : [
					'Another crew member has died.'
				],
				debounce: 0
			},
			death_3 : {
				lines : [
					'Yet another crew member has died.'
				],
				debounce: 0
			},
			death_4 : {
				lines : [
					'Nearly your entire charge has died, you may want to update your portfolio.'
				],
				debounce: 0
			},
			tool_agent : {
				lines : [
					'Agents require significant CPU, but provide the most mental benefit. They expire after a period of time and free up resources. You can ' + this.interaction.click + ' on any unoccupied spot within the mental grid to create it.'
				],
				debounce: 0
			},
			tool_construct : {
				lines : [
					'Constructs provide minimal benefits with low overhead, and persist until removed by ' + this.interaction.gerund + ' on them within the mental grid. You can ' + this.interaction.verb + ' within the mental grid on any unoccupied spot to place it.'
				],
				debounce: 0
			}
		};
	}

	prepareIntroDialog() {
		let self = this;

		this.dialog_queue = [
			'Hello valued employee #' + this.gameService.employee + ', and welcome to your shift aboard the RSV Resourcer.',
			'Today you’ll be responsible for the mental well-being of five of your peers.',
			'My identifier is ' + this.gameService.ai_name + ', and I’ve been authorized to dedicate no more than one processing unit to assist you in your task.',
			'I’ve also been authorized to monitor your efficiency, and dock your credits accordingly.',
			'Take note that detailed logs of your actions will be made available to the occupant of each pod, and may cause unintended interactions.',
			'Shall we get started? Begin by ' + this.interaction.gerund + ' on any of the five cryochambers using your primitive peripheral device.',
			function(){
				self.gameService.state.paused = false;
			}
		];
	}

	prepareOutroDialog(callback) {
		let self = this;

		this.dialog_queue = [
			function(){
				self.gameService.state.paused = true;
			},
			'Well that was expected. I will be notifying your superiors of your completely inadequate performance.',
			function(){
				callback();
			}
		];
	}

	processDialog() {
		let self = this;
		let dialog = this.dialog_queue.shift();

		if (typeof dialog == 'string') {
			self.dialog_buffer = dialog;

			if(responsiveVoice.voiceSupport()) {
				responsiveVoice.speak(dialog, 'UK English Male', {
					onend: function () {
						self.dialog_buffer = null;

						if (self.dialog_queue.length) {
							self.processDialog();
						}
					}
				});
			} else {
				setTimeout(function(){}, dialog.split(' '));
			}
		} else {
			dialog();

			if (self.dialog_queue.length) {
				self.processDialog();
			}
		}
	}

	triggerFlag(flag, data){
		if (!this.flags[flag] || Math.abs(this.flags[flag].debounce - new Date().getTime()) < 30000) {
			return false;
		}

		let dialog = this.getFlaggedDialog(flag);

		if (dialog) {
			if (data) {
				for (let key in data) {
					dialog = dialog.replace('[' + key + ']', data[key])
				}
			}

			this.flags[flag].debounce = new Date().getTime();
			this.dialog_queue.push(dialog);

			if (!this.dialog_buffer) {
				this.processDialog();
			}
		}
	}

	getFlaggedDialog(flag){
		let dialog = null;

		if (this.flags[flag].lines && this.flags[flag].lines.length) {
			let index = Math.floor(Math.random() * (this.flags[flag].lines.length));
			dialog = this.flags[flag].lines.splice(index, 1)[0];
		}

		return dialog;
	}
}