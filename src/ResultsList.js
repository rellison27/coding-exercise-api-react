import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import CSVReader from "react-csv-reader";
import _ from "lodash";
class ResultsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peopleData: [],
            groupData: [],
            column: null,
            direction: null,
        };
    }
    handleSort = (clickedColumn) => () => {
        const { column, peopleData, direction } = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                peopleData: _.sortBy(peopleData, [clickedColumn]),
                direction: "ascending",
            });

            return;
        }

        this.setState({
            peopleData: peopleData.reverse(),
            direction: direction === "ascending" ? "descending" : "ascending",
        });
    };

    componentDidMount() {
        fetch("http://localhost:8000/api/people")
            .then((response) => response.json())
            .then((data) => this.setState({ peopleData: data.data }));
        fetch("http://localhost:8000/api/groups")
            .then((response) => response.json())
            .then((data) => this.setState({ groupData: data.data }));
    }
    render() {
        const postGroups = (data) => {
            const { groupData } = this.state;
            this.setState({ groupData: [...groupData, ...data] });
            fetch("http://localhost:8000/api/import/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        };
        const postPeople = (data) => {
            const { peopleData } = this.state;
            this.setState({ peopleData: [...peopleData, ...data] });
            fetch("http://localhost:8000/api/import/people", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        };
        const handleGroups = (data, fileInfo) => postGroups(data);
        const handlePeople = (data, fileInfo) => postPeople(data);
        const papaparseOptions = {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            transformHeader: (header) =>
                header.toLowerCase().replace(/\W/g, "_"),
        };
        const { column, direction, groupData, peopleData } = this.state;
        // Step 3
        // Update the ReactJS application to
        // receive an uploaded People & Group CSV file
        return (
            <>
                <CSVReader
                    cssClass="react-csv-input"
                    label="Select CSV for People"
                    onFileLoaded={handlePeople}
                    parserOptions={papaparseOptions}
                />
                <h1> People</h1>
                <Table celled padded sortable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                singleLine
                                sorted={
                                    column === "first_name" ? direction : null
                                }
                                onClick={this.handleSort("first_name")}
                            >
                                First Name
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={
                                    column === "last_name" ? direction : null
                                }
                                onClick={this.handleSort("last_name")}
                            >
                                Last Name
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={
                                    column === "email_address"
                                        ? direction
                                        : null
                                }
                                onClick={this.handleSort("email_address")}
                            >
                                Email
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={column === "status" ? direction : null}
                                onClick={this.handleSort("status")}
                            >
                                Status
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={
                                    column === "group_name" ? direction : null
                                }
                                onClick={this.handleSort("group_name")}
                            >
                                Group
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {peopleData &&
                            peopleData.map(
                                (
                                    {
                                        first_name,
                                        last_name,
                                        email_address,
                                        status,
                                        group_name,
                                    },
                                    index
                                ) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell singleLine>
                                                {first_name}
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {last_name}
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {email_address}
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {status}
                                            </Table.Cell>
                                            <Table.Cell singleLine>
                                                {group_name}
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                }
                            )}
                    </Table.Body>
                </Table>
                <CSVReader
                    cssClass="react-csv-input"
                    label="Select CSV for Groups"
                    onFileLoaded={handleGroups}
                    parserOptions={papaparseOptions}
                />
                <h1>Groups</h1>
                {groupData &&
                    groupData.map(({ group_name }, index) => (
                        <Table celled padded sortable key={index}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={
                                            column === group_name
                                                ? direction
                                                : null
                                        }
                                        onClick={this.handleSort(group_name)}
                                    >
                                        {group_name}
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {_.filter(peopleData, {
                                    group_name: group_name,
                                    status: "active",
                                }).map((member, index) => {
                                    console.log(member.length);
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell singleLine>
                                                {member.first_name}
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    ))}
            </>
        );
    }
}

export default ResultsList;
