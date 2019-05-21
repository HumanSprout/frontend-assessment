import React from 'react';
import '../../style.css'

const data = require('../../schema.json')

const formatReadableName = name => {
  const convertToProper = s => s.charAt(0).toUpperCase() + s.slice(1)
  // handle edge cases
  if (name.slice(0,4) ==='name') {
    if (name === 'name_nick') return 'Nickname'
    return name.indexOf('fix') > 0
      ? convertToProper(name.slice(5))
      : convertToProper(name.slice(5)) + ' Name'
  }
  return name.indexOf('_') > 0
   // capitalize and convert '_' to ' '
   ? name.split('_')
    .map((subString) => {
      switch(subString) {
        case 'et':
          return 'EverTrue'
          break;
        case 'dt':
          return 'Date'
          break;
        case 'lq':
          return 'Lower Quartile'
          break;
        case 'uq':
          return 'Upper Quartile'
        default:
          return convertToProper(subString)
      }
    }).join(' ')
  : convertToProper(name)
}

const massageData = data => data.reduce((acc, cur) => {
  if (cur.containing_object) {
    // spread properties to top level object
    acc[cur.containing_object.name] = {...cur.containing_object}
  } else if (cur.properties) {
    // as above
    acc[cur.name] = {...cur}
  // put individual elements into general info object
  } else {
    acc.general.properties.push({...cur})
  }
  return acc
}, {general: {properties: []}})

const formattedData = massageData(data)

const createUsageContent = arr => {
  return arr.map((el) => {
    switch(el) {
      case 'giving_tree':
        return `🌲 Giving Tree`
        break;
      case 'console':
        return `💻 Console`
        break;
      case 'community':
        return `🏙️ Community`
        break;
      default: `🍺 ${formatReadableName(el)}`
        return
    }
  }).join(' ')
}

const fieldGroupItem = (props) => {
  return (
    <div id={props.name} class='fieldgroupitem_div--outer'>
      <h2 class='fieldgroupitem_h2'>{props.display_name}</h2>
      <div>
        <p class='item__prompt'>Type</p>
        <p class='item__content'>{props.type}</p>
      </div>
      <div>
        <p class='item__prompt'>Usage</p>
        <p class='item__content'>{createUsageContent(props.usage)}</p>
      </div>
      <div>
        <p class='item__prompt'>EverTrue Field Name</p>
        <p class='item__content fieldname'></p>
      </div>
    </div>
  )
}

const createLinks = arr => arr.map((el) => 
    <li>
      <a href={`#el.name`}>{el.formattedName}</a>
    </li>
  )

const SideNav = () => {
  return (d
  <div id='sidenav'>
   <ul>
     {createLinks(formattedData)}
   </ul>
  </div>)
}

const Content = props => {
  return (<div id='content'></div>)
}

const App = () => {
  return (
    <div className='App'>
      <SideNav />
      <Content />
    </div>
  );
};

export default App;
