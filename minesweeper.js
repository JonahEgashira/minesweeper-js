let grid;
let n = 0;
let m = 0;
let mineNumber = 0;
let clickedCnt = 0;
let gameTime = 0;
let timerId;

window.onload = function() {
  document.getElementById("customText").style.display = "none";

}

function timerStart(){
  gameTime = 0;
  timerId = setInterval(timerCountUp, 1000);
}

function timerCountUp(){
  let timeLeft;
  gameTime = gameTime + 1;
  timeLeft = gameTime + "seconds";
  document.getElementById("timerArea").innerHTML = timeLeft;
}

function clearTimer(){
  clearInterval(timerId);
  document.getElementById("timerArea").innerHTML = "";
}


function setGameStatus(){

  let easySelected = document.getElementById("easy");
  let normalSelected = document.getElementById("normal");
  let hardSelected = document.getElementById("hard");
  let insaneSelected = document.getElementById("insane");
  let customSelected = document.getElementById("custom");

  if(customSelected.checked){
    document.getElementById("customText").style.display = "block";
  } else {
    document.getElementById("customText").style.display = "none";
  }

  if(easySelected.checked){
    n = 9;
    m = 9;
    mineNumber = 10;
  } else if(normalSelected.checked){
    n = 16;
    m = 16;
    mineNumber = 40;
  } else if(hardSelected.checked){
    n = 16;
    m = 30;
    mineNumber = 99;
  } else if(insaneSelected.checked){
    n = 48;
    m = 68;
    mineNumber = 777;
  } else if(customSelected.checked){
    n = document.getElementById("numberN").value;
    m = document.getElementById("numberM").value;
    mineNumber = document.getElementById("numberMine").value;
  }
}

function generateGrid() {

  setGameStatus();
  timerStart();

  grid = document.getElementById("grid");
  grid.innerHTML="";
  let row,cell;
  for (let i = 0; i < n; i++) {
    row = grid.insertRow(i);
    for (let j = 0; j < m; j++) {
      cell = row.insertCell(j);
      cell.value = 0;
      cell.onclick = function () {
        clickCell(this);
      };
      let mine = document.createAttribute("data-mine");
      mine.value = "false";
      cell.setAttributeNode(mine);
    }
  }
  createBoard();

}


function createBoard() {

  // suppose we have 10 mines in 9 x 9 board
  let cnt = 0;
  while (true) {
    let mt = new MersenneTwister();

    let x = n * m;
    let rand = mt.nextInt(x);
    let i = Math.floor(rand / m);
    let j = Math.floor(rand % m);

    let cell = grid.rows[i].cells[j];

    if(cell.getAttribute("data-mine") == "false") {
      cell.setAttribute("data-mine","true");
      cnt++;
    }
    if(cnt == mineNumber) break;

  }
}

function revealMines(){
  for(let i = 0; i < n; i++){
    for(let j = 0; j < m; j++){
      let cell = grid.rows[i].cells[j];
      if (cell.getAttribute("data-mine")=="true") {
        cell.className="mine";
        cell.innerHTML = "X";
      }
    }
  }
}


function gameOver(res){
  clearTimer();
  revealMines();

  if(res == 0){
    alert("Game Over");
  } else if(res == 1){
    alert("Congratulations");
  }
}


let nowVal = 0;

function flagChecked(radio){

  let flagSelected = document.getElementById("flag");


    if(nowVal == radio.value){
      radio.checked = false;
      nowVal = 0;
    } else {
      nowVal = radio.value;
    }

}

function clickCell(cell) {

  let flagSelected = document.getElementById("flag");
  let flagCnt = mineNumber;

  for(let i = 0; i < n; i++){
    for(let j = 0; j < m; j++){
        if(grid.rows[i].cells[j].innerHTML == "F") flagCnt--;
    }
  }

  if(flagSelected.checked){
    if(cell.innerHTML == ""){
      flagCnt--;
      if(flagCnt >= 0){
        cell.className = "flag";
        cell.innerHTML = "F";
      } else {
        return 0;
      }
    } else if(cell.innerHTML == "F"){
      cell.className = "";
      cell.innerHTML = "";
      return 0;
    }
  }

  document.getElementById("flagLeft").innerHTML = flagCnt;


  if(cell.innerHTML == "F") return 0;


  if(cell.getAttribute("data-mine") == "true"){
    gameOver(0);
  } else {
    cell.className = "isClicked";
    clickedCnt++;
    if(clickedCnt == n * m - mineNumber){
      gameOver(1);
    }

    const dx = [1, 1, 1, -1, -1, -1, 0, 0];
    const dy = [1, 0, -1, 1, 0, -1, 1, -1];

    let mineCnt = 0;
    let x = cell.parentNode.rowIndex;
    let y = cell.cellIndex;

    //check adjacent cells and count mines around the cell
    for(let i = 0; i < 8; i++){
      let next_x = x + dx[i];
      let next_y = y + dy[i];

      if(next_x >= 0 && next_x < n && next_y >= 0 && next_y < m){
        if(grid.rows[next_x].cells[next_y].getAttribute("data-mine") == "true"){
          mineCnt++;
        }
      }
    }
    cell.innerHTML = mineCnt;


    //if cell is 0, check adjacent cells
    if(mineCnt == 0){
      for(let i = 0; i < 8; i++){
        let next_x = x + dx[i];
        let next_y = y + dy[i];

        if(next_x >= 0 && next_x < n && next_y >= 0 && next_y < m){
          if(grid.rows[next_x].cells[next_y].innerHTML == "") clickCell(grid.rows[next_x].cells[next_y]);
        }
      }
    }
  }
}
