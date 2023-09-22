import React, { Component } from "react";
import Loading from "./Loading";
import Panel from "./Panel";
import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads,
} from "../helpers/selectors";

import classnames from "classnames";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos,
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics,
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads,
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads,
  },
];

class Dashboard extends Component {
  state = {
    photos: [],
    topics: [],
    loading: true,
    focused: null,
  };

  componentDidMount() {
    const urlPromise = ["/api/photos", "/api/topics"].map((url) =>
      fetch(url).then((res) => res.json())
    );

    Promise.all(urlPromise).then(([photos, topics]) => {
      this.setState({
        loading: false,
        photos,
        topics,
      });
    });

    const focused = JSON.parse(localStorage.getItem("focused"));
    console.log(focused);

    if (focused) {
      this.setState({ focused });
    }

  }
  
  componentDidUpdate(previousProps, previousState) {
    // console.log(this.state.focused);
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel(id) {
    this.setState((previousState) => ({
      focused: previousState.focused !== null ? null : id,
    }));
  }

  render() {
    console.log(this.state);
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused,
    });

    if (this.state.loading) {
      // this.setState({ loading: false });
      return <Loading />;
    }

    const panels = (
      this.state.focused
        ? data.filter((panel) => panel.id === this.state.focused)
        : data
    ).map((panel) => (
      <Panel
        key={panel.id}
        label ={panel.label}
        value = {panel.getValue(this.state) }
        onSelect={() => this.selectPanel(panel.id)}
      />
    ));

    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
