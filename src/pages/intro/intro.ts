import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {HomePage} from '../home/home';

@Component({
	selector: 'page-intro',
	templateUrl: 'intro.html'
})
export class IntroPage {
	constructor(public navCtrl: NavController) {
		let self = this;

		setTimeout(function(){
			self.skip();
		}, 7000);
	}

	skip () {
		this.navCtrl.setRoot(HomePage, null, {
			animate : true,
			animation: 'md-transition'
		});
	}

}
