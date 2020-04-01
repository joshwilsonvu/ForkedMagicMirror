## To-Do

* Rearchitect so that instead of wrapping React modules in a `Module`
  subclass with a `getComponent()` overridden method (what was I thinking?),
  legacy modules are wrapped in a React component. 

* Allow this project to be used in two ways:
  * MM2 style, `git clone` to install, `git pull` to update,
    user config in `config/` and modules in `modules/`
  * Dependency style, `npm install`/`update`, modules in `modules/`
    or npm dependencies, run from npm scripts with `mm [--prod]`, 
    `mm serve --port 8080`, `mm view --url localhost://8080`

* Reproduce all the default modules with React components

* Make running in development vs production transparent to the user
  except for speed and hot reloading
  * Self host in production if not `serve` or `view`: https://stackoverflow.com/a/43423171/7619380
  * Programmatically run `react-scripts` and `electron` concurrently in development

* API to support:
  * `MM.sendNotification(notification, payload, sender)`
  * `MM.updateDom(module: Module, speed)`
  * `MM.getModules()`
  * `MM.hideModule(module: Module, speed, callback, {lockString, force})`
  * `MM.showModule(module: Module, speed, callback, {lockString, force})`
  * 
  ```javascript
    interface Module {
      
    }
  ```
}
