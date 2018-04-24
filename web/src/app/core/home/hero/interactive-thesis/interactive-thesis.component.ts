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
  @HostListener('mousemove', ['$event']) onMouseMove(event) {
    this.game.handleHover(event);
  }
  @HostListener('mousedown', ['$event']) onMouseDown(event) {
    this.game.handleClick(event);
  }
  @HostListener('mouseup', ['$event']) onMouseUp(event) {
    this.game.handleClickOff(event);
  }
  @HostListener('window:keydown', ['$event']) onKeyDown(event) {
    this.game.handleKeyDown(event);
  }
  @HostListener('window:keyup', ['$event']) onKeyUp(event) {
    this.game.handleKeyUp(event);
  }
  @HostListener('window:scroll', ['$event']) onscroll(event) {
    if (window.scrollY > this.gameCanvas.nativeElement.clientHeight)
      this.game.stop()
    else this.game.resume();
  }

  constructor() {  }

  ngOnInit() {
      this.game = new AsteroidsGame(this.gameCanvas.nativeElement);
      this.game.start();
      window.addEventListener("keydown", e=>{
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40:
              e.preventDefault();
        }
      })
  }

}
