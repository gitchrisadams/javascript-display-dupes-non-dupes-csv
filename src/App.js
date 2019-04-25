import React, { Component } from 'react';
import './App.css';

// Library allows testing if words are similar.
var doubleMetaphone = require('double-metaphone');

class App extends Component {
  constructor(props) {
    super(props);
    this.handleFileChosen = this.handleFileChosen.bind(this);
    this.filterTempArray = this.filterTempArray.bind(this);

    this.state = {
      csvFile: ""
    }
  }

  /*
   * This uses the fact that email would be unique for each user.
   * It further checks if email could be a dupliate
   * by using doubleMetaphone for similar email addresses.
   * This could be further expanded to check other user properties.
   */
  filterTempArray(emailAll, tempRow) {
    let tempArray = emailAll.filter((email) => {
      let tempRowMet = doubleMetaphone(tempRow);
      let emailMet = doubleMetaphone(email.email);

      return (
        (email.email === tempRow) && (tempRowMet[0] === emailMet[0] || tempRowMet[1] === emailMet[1])
      );
    });

    return tempArray;
  }


  /*
   * Reads in the csv file for processing
   */
  handleFileChosen(file) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let text = fileReader.result;

      var textCommaSplit = text.split('\n');

      let emailAll = [];
      let dupeArray = [];
      let nonDupeArray = [];

      for (var j = 1; j < textCommaSplit.length; j++) {

        // Regex, exclude splitting on double quotes with comma
        // Handles case where data has a comma in data that is not the separator.
        var tempRow = textCommaSplit[j].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

        emailAll.push(
          {
            "email": tempRow[4],
            "data": tempRow
          }
        );

        let tempArray = this.filterTempArray(emailAll, tempRow[4]);

        if (tempArray.length > 1) {
          dupeArray.push(tempArray);
        } else {
          nonDupeArray.push(tempArray);
        }
      }

      console.log('dupeArray JSON:', JSON.stringify(dupeArray));
      console.log('nonDupeArray JSON:', JSON.stringify(nonDupeArray));

      this.setState({
        dupes: JSON.stringify(dupeArray),
        nonDupes: JSON.stringify(nonDupeArray)
      });
    }
    fileReader.readAsText(file);
  }

  render() {
    return (
      <div className="App">
      <form method="post">
        <input 
          id="csvinput" 
          type="file" 
          accept=".csv" 
          name="csvinput"
          onChange={e => this.handleFileChosen(e.target.files[0])}
        >
        </input>
        <button>Submit</button>
      </form>

      <h1>Duplicates</h1>
      {this.state.dupes}
      <br></br>
      <br></br>
      <h1>Non-Duplicates</h1>
      {this.state.nonDupes}
      </div>
    );
  }
}

export default App;
