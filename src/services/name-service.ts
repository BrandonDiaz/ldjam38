import {Injectable} from '@angular/core';

@Injectable()
export class NameService {
	public first_names = [];
	public last_names  = [];

	constructor() {
		this.populateFirstNames();
		this.populateLastNames();
	}

	generate() {
		let first = this.first_names[Math.floor(Math.random() * (this.first_names.length))];
		let last  = this.last_names[Math.floor(Math.random() * (this.last_names.length))];

		return first + ' ' + last;
	}

	populateFirstNames(){
		this.first_names = [
			'Adam',
			'David',
			'Eugene',
			'John',
			'Kevin',
			'Lisa',
			'Mary',
			'Nicole',
			'Peter',
			'Sarah',
			'Tyler'
		];
	}

	populateLastNames(){
		this.last_names = [
			'Brown',
			'Collins',
			'Doe',
			'Gray',
			'Hall',
			'Moore',
			'Smith',
			'Turner',
			'Williams'
		];
	}
}