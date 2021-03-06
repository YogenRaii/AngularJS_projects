import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { HeroService } from './hero.service';

import { ROUTER_DIRECTIVES } from '@angular/router';

import { Hero } from './hero';

@Component({
	selector: 'my-hero-detail',
	templateUrl : 'app/hero-detail.component.html',
	styleUrls:['app/hero-detail.component.css'],
	directives: [ROUTER_DIRECTIVES]
})

export class HeroDetailComponent implements OnInit, OnDestroy {
	@Input()
	hero: Hero;

	@Output() 
	close = new EventEmitter();

	error: any;

	sub: any;

	navigated = false; //true if navigated here

	constructor(
		private heroService: HeroService,
		private route : ActivatedRoute){ }

	ngOnInit(){
		this.sub = this.route.params.subscribe(
			params => {
				if(params['id'] !== undefined){
					let id = +params['id'];
					this.heroService.getHero(id).then(hero => this.hero = hero);
					this.navigated = true;
				} else {
					this.navigated = false;
					this.hero = new Hero();
				}
			}
		);
	}

	ngOnDestroy(){
		this.sub.unsubscribe();
	}

	/*
	goBack(){
		window.history.back();
	}
	*/

	save() {
		this.heroService.save(this.hero)
			.then(hero => {
				this.hero = hero;
				this.goBack(hero);
			})
			.catch(error => this.error = error);
	}

	goBack(savedHero: Hero = null){
		this.close.emit(savedHero);
		if(this.navigated){
			window.history.back();
		}
	}
}