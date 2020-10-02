import React from "react";
import ReactDOM from 'react-dom';

//ES6 type class to build a controlled components
//square is changed to a function component, with only a render method.
function Square(props){
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}
/*class Square extends React.Component {
  //constructor, called in the begining.
  /*delete, as the state is controlled by boarder
  constructor(props){
    //super is required here for parent's props
    super(props);
    //set default state, which can only be modified by setState
    this.state={
      value: null,
    };
  }

  //render function, return a react component
  render() {
        return (
            //setState to be 'X' and display it after being clicked
            //onClick is changed to this.props.onClick, and this.props.value
            //so that onClick function by Board is called.
            <button className="square" onClick={()=> this.props.onClick()}>   
                {this.props.value}
            </button>
        );
    }
}*/

class Board extends React.Component {
  //deleted as squares is passed from Game
  /*
    constructor(props) {
      super(props);
      this.state={
        //add an array of 9 squares, with defaul null
        squares: Array(9).fill(null),
        //bydefault, first input is X
        //after click, xIsNext is flipped in handleClick
        xIsNext: true,
      };
    }*/

    //handle click, a call back from square
    //this part is moved in Game
    

    renderSquare(i) {
        //pass a prop called 'value' to the Square
        //read from Board's constructor
        //pass this.handleClick(i) to square, and being called when click on square
        //on[Event] for props, handle[Event] for methods
        //update from state and handleClick(i) due to history added in Game
        return (<Square 
          value={this.props.squares[i]} 
          onClick={()=>this.props.onClick(i)}/>);
    }

    render() {
      //call cal function to cal winner
      //delete as this part is transferred in Game
      /*
      const winner = calculateWinner(this.state.squares);
      let status;
      //display winner
      if (winner) {
        status = 'Winner:' + winner;
      }
      //or display next player
      else{
        //status is determined by xIsNext as well
        status = 'Next player: ' + (this.state.xIsNext ?'X': 'O');
      }*/

        return (
            <div>
                
                <div className='board-row'>
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    //history state is stored here, to store previous Board
    //in order to pass square and onclick props from Game to Board
    constructor(props) {
      super(props);
      this.state={
        history: [{
          squares: Array(9).fill(null),
        }],
        //stepNumber for current step
        stepNumber:0,
        xIsNext:true,
      }
    }

    handleClick(i){
      //get old version of squares from state
      //slice() is used here to make a copy of array, instead of modified array directly
      //get most recent version square
      //with go back function, slice is added to drop all 'future' steps after chosen step
      const history=this.state.history.slice(0, this.state.stepNumber+1);
      const current=history[history.length-1];
      const squares=current.squares.slice();
      //early return if winner appears or it is already filled
      if (calculateWinner(squares) || squares[i]){
        return;
      }
      //update clicked square, value is determined by xIsNext
      squares[i]= this.state.xIsNext ? 'X': 'O';
      //update state. After update, square components re-render auto.
      //new square is appended to history
      this.setState({
        history:history.concat([{
          squares:squares,
        }]),
        //update stepNumber
        stepNumber: history.length,
      //flip xIsNext on every click
        xIsNext: !this.state.xIsNext});
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext:(step%2)===0,
      });
    }

    render() {
      //get history props
      const history=this.state.history;
      //render current step
      const current = history[this.state.stepNumber];
      //get most recent history version
      //const current = history[history.length-1];
      //calculate winner
      const winner=calculateWinner(current.squares);

      //map history to moves
      const moves=history.map((step, move) =>{
        const desc=move ?
          'Got to move #' + move:
          'Got to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      let status;
      //displayer winner
      if (winner) {
        status='Winner: '+winner;
      }
      //or display next player
      else {
        status='Next player: '+ (this.state.xIsNext ? 'X': 'O');
      }
        return (
          //pass current.squares and i to Board
            <div className='game'>
                <div className='game-board'>
                  
                    <Board 
                      squares={current.squares}
                      onClick={(i)=>this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

//========================================
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

//function to cal whether there is a winner
function calculateWinner(squares) {
  //winner condition array
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  for (let i =0; i<lines.length; i++){
    //get possible indexes
    const [a,b,c]=lines[i];
    //check if there is a winner
    if (squares[a] && squares[a]===squares[b] && squares[a]===squares[c]){
      //return winner's symbol
      return squares[a];
    }
  }
  //or return null if there is no winner
  return null
}

//export default Form;
