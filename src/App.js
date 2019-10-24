import React from "react";

import "./styles.css";


const SnakeBoard = Array(30).fill(0).map(y => {
  return Array(30).fill(0);
})
const initialState = {
  snakePositions: [
    { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }
  ],
  snakeDirection: 1, //1 dreapta, 2 jos, 3 stanga, 0 sus
  foodPosition: {},
  score: 0,
  lastChange: 0
}
class App extends React.Component {
  constructor() {
    super();
    this.state = { ...initialState }
  }
  reset = () => {
    this.setState({ ...initialState });
    this.spawnFood()
  }
  moveSnake = () => {
    var snakePositions = [...this.state.snakePositions];
    var head = { ...snakePositions[snakePositions.length - 1] }
    if (this.state.snakeDirection === 0) {
      head.y--;
    } else if (this.state.snakeDirection === 1) {
      head.x++;
    } else if (this.state.snakeDirection === 2) {
      head.y++;
    } else {
      head.x--;
    }
    if (head.x > 29) {
      head.x = 0;
    } else if (head.x < 0) {
      head.x = 29;
    } else if (head.y > 29) {
      head.y = 0;
    } else if (head.y < 0) {
      head.y = 29;
    }
    var score = this.state.score;
    if (head.x === this.state.foodPosition.x && head.y === this.state.foodPosition.y) {
      this.spawnFood();
      score++;
    } else {
      snakePositions.splice(0, 1);
    }
    if (this.getCellClassName(head.x, head.y) === "snakeStyle") {
      alert(`'You lost! Your score is ${this.state.score}`)
      this.reset(); return;
    }
    snakePositions.push(head);
    this.setState({
      snakePositions,
      score
    })
  }
  changeDirection = (event) => {
    console.log(event)
    if (Date.now() - this.state.lastChange < 70)
      return;
    if ((event.key === "w" || event.key === "ArrowUp") && this.state.snakeDirection !== 2) {
      this.setState({
        snakeDirection: 0,
        lastChange: Date.now()
      })
    } else if ((event.key === "d" || event.key === "ArrowRight") && this.state.snakeDirection !== 3) {
      this.setState({
        snakeDirection: 1,
        lastChange: Date.now()
      })
    } else if ((event.key === "s" || event.key === "ArrowDown") && this.state.snakeDirection !== 0) {
      this.setState({
        snakeDirection: 2,
        lastChange: Date.now()
      })
    } else if ((event.key === "a" || event.key === "ArrowLeft") && this.state.snakeDirection !== 1) {
      this.setState({
        snakeDirection: 3,
        lastChange: Date.now()
      })
    }
  }
  spawnFood = () => {
    var x = Math.floor(Math.random() * 100) % 30;
    var y = Math.floor(Math.random() * 100) % 30;
    while (this.getCellClassName(x, y) === "snakeStyle") {
      x = Math.floor(Math.random() * 100) % 30;
      y = Math.floor(Math.random() * 100) % 30;
    }
    var foodPosition = { x, y }
    this.setState({
      foodPosition
    })
  }
  componentDidMount() {
    this.setState({
      timer: setInterval(this.moveSnake, 100)
    })
    document.addEventListener("keydown", this.changeDirection);
    this.spawnFood();
  }
  componentWillUnmount() {
    clearInterval(this.state.timer)
  }
  getCellClassName = (indexX, indexY) => {
    var isSnakeCell = this.state.snakePositions.some(element => {
      return element.x === indexX && element.y === indexY;
    })
    if (isSnakeCell) {
      return "snakeStyle";
    } else {
      if (indexX === this.state.foodPosition.x && indexY === this.state.foodPosition.y) {
        return "foodStyle";
      }
      return "mapCell";
    }
  }
  render() {
    return (
      <div className="main">
        <h2>Snake</h2>
        <h4>Use the keyboard arrows to change snake direction!</h4>
        <h3>Score: {this.state.score}</h3>
        <div className="snakeBoard">
          {
            SnakeBoard.map((y, indexY) => {
              return (
                <div className="mapRow">
                  {
                    y.map((x, indexX) => {
                      return (
                        <div className={this.getCellClassName(indexX, indexY)}>
                        </div>
                      )
                    })
                  }
                </div>)
            })
          }
        </div>
      </div>
    );
  }
}

export default App;
