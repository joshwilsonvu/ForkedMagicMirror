## To-Do

* Rearchitect so that instead of wrapping React modules in a `Module`
  subclass with a `getComponent()` overridden method (what was I thinking?),
  legacy modules are wrapped in a React component. 

* Allow this project to be used in two ways:
  * Legacy style, `git clone` to install, `git pull` to update,
    user config in `config/` and modules in `modules/`
  * Dependency style, `npm install`/`update`, modules in `modules/`
    or npm dependencies, run from npm scripts with `mm [dev]`, `mm prod`,
    `mm serve --port 8080`, `mm view --url localhost://8080`

* Reproduce all the default modules with React components

