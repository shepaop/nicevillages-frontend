# Framework Front Insign
**v 5.7.5**


## Framework description

- All sources are placed within the `/bin/` folder.
- All compiled filed are genrated in the `/dist` folder.
- Tasks are coded for GulpJS.
- Single tasks are splitted in part files, placed in the folder `/gulp-tasks/`.
- NodeJS packages are specified within the `package.json` file.
- SASS preprocessor
- CSS rule are specified for mobile first


## Required configuration

- node : 6.11.2
- npm : 3.10.10


## Installation

- With a command console, move to the framework's root folder. Where the `gulpfile.js` file is.
- Install all dependencies executing the following command `$ npm install`


## Configuration

- The framework's main parameters à located in the `params.json` file


## Task description

### `gulp modernizr`
- Build of ModernizR.

### `gulp favicon`
- Favicons files generator, based on one single file located at `/bin/favicon.png`.
- Imagesize sould be at least 260x260.

### `gulp files`
- Build HTML Templates located at `/bin/html/`.
- index.html automatic generation
- Destination Folder located at `dist/`.

### `gulp sass`
- SASS compilation from files located at `/bin/sass/`.
- Code verification with stylelint.
- Media queries concatenation.
- CSS minification.

### `gulp scripts`
- ESlint from files located at `/bin/scripts/`.
- Javascript concatenation from files located at `/bin/scripts/`.
- Javascript minification.
- Javascript documentation from files located at `/bin/scripts/`.

### `gulp styleguide`
- Styleguide generation with sc5styleguide plugin.
- Styleguide syntax is KSS.
- Destination Folder located at `styleguide/`.
- Exports HTML parts to `/bin/html/components/`, ready to include.

### `gulp icons`
- Icons located at `/bin/icons/`, as SVG format, are encoded in base64.
- The generation is based on a `/bin/icons/_icons.scss` template with `lodash` langage variables.
- A SASS file with the datas is generated in the `bin/sass/_theme-placeholders/_icons.scss`.

### `gulp font64`
- Encodes custom fonts into base 64 file within the main stylesheet

### `gulp images`
- Minify and copy images from `bin/img/` to `/img/`.
- JPG, PNG, GIF and SVG files are supported.

### `gulp copy`
- Copy all assets to an optional theme folder (null, therefore bypassed, by default.)

### `gulp clean`
- Delete selected files

### `gulp fullmonty`
- Executes all the routines necessary to build the whole framework functionalities

### `gulp deployment`
- Executes core routines just for VM deployment bash

### `gulp watch`
- Watch `/bin/sass/**/*.scss` files changes, and apply `gulp styleguide` and `gulp copy`.
- Watch `/bin/js/**/*.js` files changes, and apply `gulp scripts`.
- Watch `/bin/icons/*.svg` files changes, and apply `gulp icons`.
- Watch `/bin/img/**/*` files changes, and apply `gulp images`.
