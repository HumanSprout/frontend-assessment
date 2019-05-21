import React from "react";
import "../../style.css";
const data = require("../../schema.json");
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
    ? // capitalize and convert underscore '_' to space ' '
      name
        .split("_")
        .map(subString => {
          switch (subString) {
            case "et":
              return "EverTrue";
            case "dt":
              return "Date";
            case "lq":
              return "Lower Quartile";
            case "uq":
              return "Upper Quartile";
            default:
              return convertToProper(subString);
          }
        })
        .join(" ")
    : convertToProper(name);
};
// rebuilds data structure to match sidenav component hierarchy
const massageData = data =>
  data.reduce(
    (acc, cur) => {
      if (cur.containing_object) {
        // spread properties to top level object
        acc[cur.containing_object.name] = { ...cur.containing_object };
      } else if (cur.properties) {
        // as above
        acc[cur.name] = { ...cur };
      } else {
        // put individual elements into general info object
        acc.general.properties.push({ ...cur });
      }
      return acc;
    },
    { general: { properties: [], name: "general" } }
  );
// cache formatted data with keys for array like iteration
const formattedData = massageData(data);
formattedData.keys = Object.keys(formattedData);
// generates strings for displaying app_key property values
const createUsageContent = arr => {
  return arr
    .map(el => {
      switch (el) {
        case "giving_tree":
          return `🌲 Giving Tree`;
          break;
        case "console":
          return `💻 Console`;
          break;
        case "community":
          return `🏙️ Community`;
          break;
        default:
          `🍺 ${formatReadableName(el)}`;
          return;
      }
    })
    .join(" ");
};
// creates content for the main section
const createFieldGroupItem = el => {
  return (
    <div
      id={el.name}
      className="fieldgroupitem__div--outer"
      key={`item_${el.name}`}
    >
      <h4 className="fieldgroupitem__h2">{formatReadableName(el.name)}</h4>
      <div className="item__property">
        <span className="item__prompt">Type:</span>
        <span className="item__content">{el.data_type}</span>
      </div>
      <div className="item__property">
        <span className="item__prompt">Usage:</span>
        <span className="item__content">
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
  const { content } = props;
  const createLinks = keys =>
    keys.map(key => (
      <div key={`sidenav__${key}`}>
        <h2>{formatReadableName(content[key].name)}</h2>
        {content[key].properties.map(el => (
          <div key={`${key}_link_${el.name}`}>
            <a href={`#${el.name}`}>{formatReadableName(el.name)}</a>
          </div>
        ))}
      </div>
    ));
  return <div id="sidenav">{createLinks(content.keys)}</div>;
};
const Content = props => {
  const { content } = props;
  const createFieldGroups = keys =>
    keys.map(key => (
      <div key={`fieldgroup_${key}`}>
        <h2>{formatReadableName(content[key].name)}</h2>
        {content[key].properties.map(el => createFieldGroupItem(el))}
      </div>
    ));
  return <div id="content">{createFieldGroups(content.keys)}</div>;
};

const dataContext = React.createContext({
  active: "general",
  ...formattedData
});

const App = () => {
  return (
    <dataContext.Provider>
      <div className="App">
        <SideNav content={formattedData} />
        <Content content={formattedData} />
      </div>
    </dataContext.Provider>
  );
};

export default App;
