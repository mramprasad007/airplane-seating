import React, { useState } from 'react';
import './App.css';

function App() {
  const [seating2DArray, setSeating2DArray] = useState('[]');
  const [noOfPassengers, setNoOfPassengers] = useState(0);
  const [filledSeatingList, setFilledSeatingList] = useState([]);
  const [toggle, setToggle] = useState(false);


  const submitValue = () => {
    try {
      JSON.parse(seating2DArray);
    } catch (e) {
      alert("Provide valid inputs");
      return;
    }
    const input = {
      seating2DArray: JSON.parse(seating2DArray),
      noOfPassengers: noOfPassengers
    }
    fetch('/seating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    })
      .then(response => response.json())
      .then(filledSeatingList => {
        setFilledSeatingList(filledSeatingList)
        setToggle(true)
      });
  }

  const seatingView = (block, blockIndex) => {
    const column = block[0];
    const row = block[1];
    return Array(row).fill().map((_, rowIndex) => {
      return (<div className='row-container'>{
        Array(column).fill().map((_, columnIndex) => {
          let blockNumber = blockIndex + 1;
          let rowNumber = rowIndex + 1;
          let columnNumber = columnIndex + 1;
          let seatNo = parseFloat(`${rowNumber}${blockNumber}${columnNumber}`);
          let seat = filledSeatingList.filter((seat) => seat.seatNo === seatNo)
          return (<div className={`column-box ${seat.length ? seat[0].seatType : ''}`}>{seat.length && seat[0].passengerNo != 0 ? seat[0].passengerNo : ''}</div>)
        })
      }</div>)
    })
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Airplane Seating App</a>
      </nav>
      <div className='input-container'>
        <div className="form-group">
          <label for="seating2DArray">Seating 2D Array</label>
          <input type="text" className="form-control" id="seating2DArray" onChange={e => {
            setToggle(false)
            return setSeating2DArray(e.target.value)
          }} placeholder="Enter Seating 2D Array" />
        </div>
        <div className="form-group">
          <label for="noOfPassengers">No Of Passengers</label>
          <input type="number" className="form-control" id="noOfPassengers" onChange={e => setNoOfPassengers(e.target.value)} placeholder="Enter No Of Passengers" />
        </div>
        <button onClick={submitValue} className="btn btn-primary">Submit</button>
      </div>
      {toggle ? <div className='seating-container-header'>Airplane Seating</div> : null}
      {toggle ?
        <div className='seating-container'>
          {JSON.parse(seating2DArray).map((block, blockIndex) => {
            return (<div className="blocks" > {
              seatingView(block, blockIndex)
            }</div>)
          })
          }
        </div>
        : null}
    </div>
  );
}

export default App;
