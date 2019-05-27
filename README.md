# Frontend Assessment

This is my solution to the Frontend Engineering candidate assessment. Per the spec, I focused more on code quality and data manipulation.

## Task

I Used the file `schema.json` to create an interactive page.

This solution:

- Displays the data from the file grouped into sections as a side navigation menu.
- Displays the details of a property on the page when a menu item is clicked
- Expands a group item menu and displays all properties in that group when clicked
- Navigate to the details in the main section for that property when a sub-element is clicked

## Setup

same as the original repo:

- git clone this repository
- `npm install`
- `npm start`

## Notes

I considered using Context or render props to pass a value representing the "active group" to dynamically render content from only the active group but decided on this simpler solution only utilizing a single hook on the sidenav component. I believe this solution meets the criteria as outlined.

update: I realized I should probably make an AJAX call instead of requiring in the schema.json so I changed the App component into a container to do that. After this, dyanimic rendering was fairly trivial to wire up so I removed the hook and passed down the method to do that as well.
