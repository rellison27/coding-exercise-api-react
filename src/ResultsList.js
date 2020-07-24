import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'
import CSVReader from "react-csv-reader";

class ResultsList extends Component {
    constructor(props) {
        super(props);
        this.state = { data: [] };
    }

    componentDidMount() {
        fetch("http://localhost:8000/api/people")
          .then(response => response.json())
          .then(data => this.setState({ data: data.data }));
    }

    render() {
        var data = this.state.data || [];
        const handleForce = (data, fileInfo) => console.log(data, fileInfo);

        const papaparseOptions = {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
        };
        // Step 3
        // Update the ReactJS application to 
        // receive an uploaded People & Group CSV file
        return (
          <>
          <CSVReader
      cssClass="react-csv-input"
      label="Select CSV with Groups or People"
      onFileLoaded={handleForce}
      parserOptions={papaparseOptions}
    />
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell singleLine>First Name</Table.HeaderCell>
                  <Table.HeaderCell>Last Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>

              {
                  data.map((person, index) => {
                      return (
                          <Table.Row key={index}>
                              <Table.Cell singleLine>{ person.first_name }</Table.Cell>
                              <Table.Cell singleLine>{ person.last_name }</Table.Cell>
                              <Table.Cell singleLine>{ person.email_address }</Table.Cell>
                              <Table.Cell singleLine>{ person.status }</Table.Cell>
                          </Table.Row>
                      );
                    })
              }

              </Table.Body>
            </Table>
            </>
    );
}

}

export default ResultsList
