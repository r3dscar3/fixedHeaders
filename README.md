# Fixed Headers
Elements will fix to defined parent.

## Usage
`fixedHeaders('element', {options});`

## Options
fixedHeaderOffset: (default is 0),
scrollTarget: (must be ID or window is default),
releaseAtLastSibling: (false is default)

## Example
fixedHeaders('.header', {fixedHeaderOffset: 50, scrollTarget: 'mainContainer'});
