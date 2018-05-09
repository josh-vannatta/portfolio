import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { AsteroidsGame } from '@games/asteroids/asteroids.game';

@Component({
  selector: 'interactive-thesis',
  templateUrl: './interactive-thesis.component.html',
  styleUrls: ['./interactive-thesis.component.scss']
})
export class InteractiveThesisComponent implements OnInit {
  game: AsteroidsGame;
  @ViewChild('gameCanvas') gameCanvas: ElementRef;
  @HostListener('window:scroll', ['$event']) onscroll(event) {
    if (window.scrollY > this.gameCanvas.nativeElement.clientHeight)
      this.game.stop()
    else this.game.resume();
  }

  constructor() {  }

  ngOnInit() {
      this.game = new AsteroidsGame(this.gameCanvas.nativeElement);
      this.game.eventHandler();
      this.game.start();
      window.addEventListener("keydown", e=>{
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40:
              e.preventDefault();
        }
      })
  }

}
