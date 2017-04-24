import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {CreditsPage} from '../pages/credits/credits';
import {GamePage} from '../pages/game/game';
import {HomePage} from '../pages/home/home';
import {IntroPage} from '../pages/intro/intro';

import {DialogService} from '../services/dialog-service';
import {DreamService} from '../services/dream-service';
import {GameService} from '../services/game-service';
import {NameService} from '../services/name-service';
import {StateService} from '../services/state-service';

@NgModule({
	declarations: [
		MyApp,
		CreditsPage,
		GamePage,
		HomePage,
		IntroPage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		CreditsPage,
		GamePage,
		HomePage,
		IntroPage
	],
	providers: [
		DialogService,
		DreamService,
		GameService,
		NameService,
		StateService,
		SplashScreen,
		StatusBar,
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {
}
