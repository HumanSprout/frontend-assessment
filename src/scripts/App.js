import React, { useState } from "react";
import "../../style.css";

// ----- Utility Functions
// creates human readable name from elements' name property
const formatReadableName = name => {
  const convertToProper = s => s.charAt(0).toUpperCase() + s.slice(1);
  // handle edge cases
  if (name === "lat") return "Latitude";
  if (name === "lng") return "Longitude";
  if (name.slice(0, 4) === "name") {
    if (name === "name_nick") return "Nickname";
    return name.indexOf("fix") > 0
      ? convertToProper(name.slice(5))
      : convertToProper(name.slice(5)) + " Name";
  }
  return name.indexOf("_") > 0
    ? // capitalize and convert underscore '_' to space ' ' for compound name values
      name
        .split("_")
        .map(subString => {
          // handle more edge cases
          switch (subString) {
            case "et":
              return "EverTrue";
            case "dt":
              return "Date";
            case "lq":
              return "Lower Quartile";
            case "uq":
              return "Upper Quartile";
            // format compound values
            default:
              return convertToProper(subString);
          }
        })
        .join(" ")
    : // convert simple values
      convertToProper(name);
};

// rebuilds data structure to match sidenav component hierarchy
const massageData = data => {
  data = data.reduce(
    (acc, cur) => {
      if (cur.containing_object) {
        // spread properties to top level object
        acc[cur.containing_object.name] = { ...cur.containing_object };
      } else if (cur.properties) {
        acc[cur.name] = { ...cur };
      } else {
        // or put individual elements into general info object
        acc.general.properties.push({ ...cur });
      }
      return acc;
    },
    { general: { properties: [], name: "general" } }
  );
  data.keys = Object.keys(data);
  return data;
};

// generates strings for displaying app_key property values
const createUsageContent = arr => {
  return arr
    .map(el => {
      switch (el) {
        case "giving_tree":
          return `🌲 Giving Tree`;
        case "console":
          return `💻 Console`;
        case "community":
          return `🏙️ Community`;
        default:
          return `🍺 ${formatReadableName(el)}`;
      }
    })
    .join(" ");
};

// creates content for the main section
const createFieldGroupItem = (el, group) => {
  return (
    <div
      id={`${group}-${el.name}`}
      className="fieldgroupitem__div--outer"
      key={`item_${el.name}`}
    >
      <h2 className="fieldgroupitem__h2">{formatReadableName(el.name)}</h2>
      <div className="item__property">
        <span className="item__prompt">Type:</span>
        <span className="item__content datatype">{el.data_type}</span>
      </div>
      <div className="item__property">
        <span className="item__prompt">Usage:</span>
        <span className="item__content usage">
          {el.app_keys ? createUsageContent(el.app_keys) : "none"}
        </span>
      </div>
      <div className="item__property">
        <span className="item__prompt">EverTrue Field Name:</span>
        <span className="item__content fieldname">{el.name}</span>
      </div>
    </div>
  );
};

// ----- React Components
const SideNav = props => {
  const { content, active, update } = props;
  const createLinks = keys =>
    keys.map(key => (
      <div key={`sidenav__${key}`}>
        <a href={`#${content[key].name}`}>
          <p
            className="sidenav__section"
            onClick={() => update(content[key].name)}
          >
            {formatReadableName(content[key].name)}
          </p>
        </a>
        {active === content[key].name
          ? // render children if section is active
            content[key].properties.map(el => (
              <div key={`${key}_link_${el.name}`}>
                <a href={`#${content[key].name}-${el.name}`}>
                  <p className="sidenav__item">{formatReadableName(el.name)}</p>
                </a>
              </div>
            ))
          : // or dont
            []}
      </div>
    ));
  return (
    <div id="sidenav">{content.keys ? createLinks(content.keys) : []}</div>
  );
};

const Content = props => {
  const { content, active } = props;
  const createFieldGroups = keys =>
    keys.map(key =>
      active == content[key].name ? (
        <div key={`fieldgroup_${key}`} id={content[key].name}>
          <h2>{formatReadableName(content[key].name)}</h2>
          {content[key].properties.map(el =>
            createFieldGroupItem(el, content[key].name)
          )}
        </div>
      ) : (
        []
      )
    );
  return (
    <div id="content">
      {content.keys ? createFieldGroups(content.keys) : []}
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "general",
      ready: false,
      data: {}
    };
  }
  async componentDidMount() {
    const response = await fetch(
      "https://raw.githubusercontent.com/HumanSprout/frontend-assessment/master/schema.json",
      { method: "GET" }
    );
    const json = await response.json();
    const data = await massageData(json);
    this.setState({ data, ready: true });
  }
  updateActiveGroup(activeGroup) {
    this.setState({ active: activeGroup });
  }
  render() {
    return this.state.ready ? (
      <div className="App">
        <SideNav
          content={this.state.data}
          active={this.state.active}
          update={this.updateActiveGroup.bind(this)}
        />
        <Content content={this.state.data} active={this.state.active} />
      </div>
    ) : (
      <div>loading...</div>
    );
  }
}

export default App;
