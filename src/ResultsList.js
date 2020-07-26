import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import CSVReader from "react-csv-reader";
import _ from "lodash";
class ResultsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            peopleData: [
                {
                    first_name: "Vaughn",
                    last_name: "Hellison",
                    status: "active",
                    group_name: "Member",
                },
                {
                    first_name: "John",
                    last_name: "Dellison",
                    status: "active",
                    group_name: "Elder",
                },
                {
                    first_name: "Shaun",
                    last_name: "Ellison",
                    status: "active",
                    group_name: "Member",
                },

                {
                    first_name: "Gon",
                    last_name: "Gellison",
                    status: "active",
                    group_name: "Elder",
                },
            ],
            groupData: [{ group_name: "Member" }, { group_name: "Elder" }],
            column: null,
            direction: null,
            members: [],
        };
    }
    handleSort = (clickedColumn) => () => {
        const { column, peopleData, direction, members } = this.state;
        let membersCopy = [...members];
        let arrToEdit = membersCopy.splice(clickedColumn, 1);
        if (column !== clickedColumn) {
            if (Number.isInteger(clickedColumn)) {
                let sortedArr = _.sortBy(...arrToEdit, ["first_name"]);
                membersCopy.splice(clickedColumn, 0, sortedArr);
                this.setState({
                    column: clickedColumn,
                    members: [...membersCopy],
                    direction: "ascending",
                });
            } else {
                this.setState({
                    column: clickedColumn,
                    peopleData: _.sortBy(peopleData, [clickedColumn]),
                    direction: "ascending",
                });
            }

            return;
        }
        if (Number.isInteger(clickedColumn)) {
            let reversedArr = _.reverse(...arrToEdit);
            membersCopy.splice(clickedColumn, 0, reversedArr);
            this.setState({
                members: [...membersCopy],
                direction:
                    direction === "ascending" ? "descending" : "ascending",
            });
        } else {
            this.setState({
                peopleData: peopleData.reverse(),
                direction:
                    direction === "ascending" ? "descending" : "ascending",
            });
        }
        return;
    };

    createMembersArr = () => {
        const { peopleData, groupData } = this.state;
        this.setState({
            members: groupData.map(({ group_name }) =>
                _.filter(peopleData, {
                    group_name: group_name,
                    status: "active",
                })
            ),
        });
    };

    componentDidMount() {
        fetch("http://localhost:8000/api/people")
            .then((response) => response.json())
            .then((data) => this.setState({ peopleData: data.data }));
        fetch("http://localhost:8000/api/groups")
            .then((response) => response.json())
            .then((data) => this.setState({ groupData: data.data }));
        this.createMembersArr();
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.state.peopleData.length !== prevState.peopleData.length ||
            this.state.groupData.length !== prevState.groupData.length
        ) {
            this.createMembersArr();
        }
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
        const handleUpload = (data, fileInfo) => {
            Object.keys(data[0]).find((element) => element === "first_name")
                ? postPeople(data)
                : postGroups(data);
        };
        const papaparseOptions = {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            transformHeader: (header) =>
                header.toLowerCase().replace(/\W/g, "_"),
        };
        const {
            column,
            direction,
            groupData,
            peopleData,
            members,
        } = this.state;
        // Step 3
        // Update the ReactJS application to
        // receive an uploaded People & Group CSV file
        return (
            <>
                <div>Upload a .CSV file for your Groups and/or People</div>
                <CSVReader
                    cssClass="react-csv-input"
                    onFileLoaded={handleUpload}
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
                <h1>Groups</h1>
                {groupData &&
                    groupData.map(({ group_name }, index) => (
                        <Table celled padded sortable key={index}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={
                                            column === index ? direction : null
                                        }
                                        onClick={this.handleSort(index)}
                                    >
                                        {group_name}
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {_.filter(members[index], {
                                    group_name: group_name,
                                    status: "active",
                                }).map(({ first_name, last_name }, index) => {
                                    return (
                                        <Table.Row key={index}>
                                            <Table.Cell singleLine>
                                                {first_name} {last_name}
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
