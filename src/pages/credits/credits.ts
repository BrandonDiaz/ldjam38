import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {HomePage} from '../home/home';

@Component({
	selector: 'page-credits',
	templateUrl: 'credits.html'
})
export class CreditsPage {
	constructor(public navCtrl: NavController) {
	}

	return() {
		this.navCtrl.setRoot(HomePage, null, {
			animate : true,
			animation: 'md-transition'
		});
	}

}
