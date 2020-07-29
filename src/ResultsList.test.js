import React from "react";
import { mount } from "enzyme";
import ResultsList from "./ResultsList";

let wrapper, data, people, groups, members;

describe("<ResultsList />", () => {
    beforeAll(() => {
        wrapper = mount(<ResultsList />);
        data = [
            {
                id: 132,
                first_name: "Macie",
                last_name: "Emmerich",
                email_address: "cremin.marjory@hotmail.com",
                status: "active",
                group_name: "Pastors",
                updated_at: "2019-07-20 22:05:47",
                created_at: "2019-07-20 22:05:47",
            },
            {
                id: 132,
                first_name: "Ellis",
                last_name: "Ferich",
                email_address: "bremin.marjory@hotmail.com",
                status: "archived",
                group_name: "Elders",
                updated_at: "2019-07-20 22:05:47",
                created_at: "2019-07-20 22:05:47",
            },
        ];

        wrapper.setState({ peopleData: data });
    });

    test("renders", () => {
        expect(wrapper).toMatchSnapshot();
    });

    test("Groups table shouldn't be present without GroupData", () => {
        //console.log(wrapper.find("Table").debug());
        expect(wrapper.find("Table")).toHaveLength(1);
    });

    test("People table should sort by first name", () => {
        expect(
            wrapper.find("TableBody TableRow TableCell").at(0).find("td").text()
        ).toContain("Macie");
        wrapper.find("Table TableHeaderCell").at(0).simulate("click");
        expect(
            wrapper.find("TableBody TableRow TableCell").at(0).find("td").text()
        ).toContain("Ellis");
    });

    test("People table should sort by last name", () => {
        expect(
            wrapper.find("TableBody TableRow TableCell").at(1).find("td").text()
        ).toContain("Ferich");
        wrapper.find("Table TableHeaderCell").at(1).simulate("click");
        expect(
            wrapper.find("TableBody TableRow TableCell").at(1).find("td").text()
        ).toContain("Emmerich");
    });

    test("People table should sort by email address", () => {
        expect(
            wrapper.find("TableBody TableRow TableCell").at(2).find("td").text()
        ).toContain("cremin.marjory@hotmail.com");
        wrapper.find("Table TableHeaderCell").at(2).simulate("click");
        expect(
            wrapper.find("TableBody TableRow TableCell").at(2).find("td").text()
        ).toContain("bremin.marjory@hotmail.com");
    });

    test("People table should sort by status", () => {
        expect(
            wrapper.find("TableBody TableRow TableCell").at(3).find("td").text()
        ).toContain("archived");
        wrapper.find("Table TableHeaderCell").at(3).simulate("click");
        expect(
            wrapper.find("TableBody TableRow TableCell").at(3).find("td").text()
        ).toContain("active");
    });

    test("People table should sort by group name", () => {
        expect(
            wrapper.find("TableBody TableRow TableCell").at(4).find("td").text()
        ).toContain("Pastors");
        wrapper.find("Table TableHeaderCell").at(4).simulate("click");
        expect(
            wrapper.find("TableBody TableRow TableCell").at(4).find("td").text()
        ).toContain("Elders");
        wrapper.find("Table TableHeaderCell").at(4).simulate("click");
        expect(
            wrapper.find("TableBody TableRow TableCell").at(4).find("td").text()
        ).toContain("Pastors");
    });
});

describe("<ResultsList /> with groups", () => {
    beforeAll(() => {
        wrapper = mount(<ResultsList />);
        people = [
            {
                id: 132,
                first_name: "Macie",
                last_name: "Emmerich",
                email_address: "cremin.marjory@hotmail.com",
                status: "active",
                group_name: "Elders",
                updated_at: "2019-07-20 22:05:47",
                created_at: "2019-07-20 22:05:47",
            },
            {
                id: 132,
                first_name: "Ellis",
                last_name: "Ferich",
                email_address: "bremin.marjory@hotmail.com",
                status: "active",
                group_name: "Elders",
                updated_at: "2019-07-20 22:05:47",
                created_at: "2019-07-20 22:05:47",
            },
        ];

        members = [
            [
                {
                    id: 132,
                    first_name: "Macie",
                    last_name: "Emmerich",
                    email_address: "cremin.marjory@hotmail.com",
                    status: "active",
                    group_name: "Elders",
                    updated_at: "2019-07-20 22:05:47",
                    created_at: "2019-07-20 22:05:47",
                },
                {
                    id: 132,
                    first_name: "Ellis",
                    last_name: "Ferich",
                    email_address: "bremin.marjory@hotmail.com",
                    status: "active",
                    group_name: "Elders",
                    updated_at: "2019-07-20 22:05:47",
                    created_at: "2019-07-20 22:05:47",
                },
            ],
            [],
        ];

        groups = [{ group_name: "Elders" }, { group_name: "Members" }];

        wrapper.setState({
            peopleData: people,
            groupData: groups,
            members: members,
        });
    });

    test("Two Group Tables should be present", () => {
        expect(wrapper.find("Table")).toHaveLength(3);
    });

    test("First Table should be Elders", () => {
        expect(
            wrapper.find("Table").at(1).find("TableHeaderCell").text()
        ).toContain("Elders");
    });

    test("Second Table should be Members", () => {
        expect(
            wrapper.find("Table").at(2).find("TableHeaderCell").text()
        ).toContain("Members");
    });

    test("Elders group table should have two people in the table", () => {
        expect(wrapper.find("Table").at(1).find("TableBody").text()).toContain(
            "Macie EmmerichEllis Ferich"
        );
    });

    test("Elders group table should sort by first_name", () => {
        expect(
            wrapper
                .find("Table")
                .at(1)
                .find("TableBody TableRow TableCell")
                .at(0)
                .find("td")
                .text()
        ).toContain("Macie");
        wrapper.find("Table").at(1).find("TableHeaderCell").simulate("click");

        expect(
            wrapper
                .find("Table")
                .at(1)
                .find("TableBody TableRow TableCell")
                .at(0)
                .find("td")
                .text()
        ).toContain("Ellis");

        // Making sure the people data table hasn't changed
        expect(
            wrapper.find("TableBody TableRow TableCell").at(0).find("td").text()
        ).toContain("Macie");
        wrapper.find("Table").at(1).find("TableHeaderCell").simulate("click");
        expect(
            wrapper
                .find("Table")
                .at(1)
                .find("TableBody TableRow TableCell")
                .at(0)
                .find("td")
                .text()
        ).toContain("Macie");
    });

    // Please ignore my experiemnting I want to come back to this later
    test("Trying to test upload functionality in this environment", () => {
        const postGroups = jest.fn((url) => [
            { group_name: "Pastors" },
            { group_name: "Elders" },
        ]);
        const postPeople = jest.fn((url) => [
            { first_name: "Pastors" },
            { first_name: "Elders" },
        ]);
        wrapper.find("a").props().onFileLoaded(postGroups());
        wrapper.find("a").props().onFileLoaded(postPeople());
        expect(postGroups).toHaveBeenCalled();
        expect(postPeople).toHaveBeenCalled();
    });
});
