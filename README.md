# coc-lua

![test](https://github.com/josa42/coc-lua/workflows/Main/badge.svg)

--------------------------------------------------------------------------------

Lua language server extension using [`LuaLS/lua-language-server`](https://github.com/LuaLS/lua-language-server)
for [`coc.nvim`](https://github.com/neoclide/coc.nvim)
(pre-build binaries: [coc-lua-binaries](https://github.com/josa42/coc-lua-binaries/releases/tag/latest)).

## Install

In your vim/neovim, run command:

```
:CocInstall coc-lua
```

## Features

See
- [`LuaLS/lua-language-server`](https://github.com/LuaLS/lua-language-server)

## Commands

- `lua.version`
  Print extension version

- `lua.update`
  Update language server

## Settings

- `lua.enable` set to `false` to disable lua language server.

Trigger completion in `coc-settings.json` to get complete list.

### LuaLS/lua-language-server

- **`Lua.addonManger.enable`** [Default: `true`]  
  Set the on/off state for the addon manager.

- **`Lua.codeLens.enable`** [Default: `false`]  
  Enable code lens.

- **`Lua.completion.autoRequire`** [Default: `true`]  
  When the input looks like a file name, automatically `require` this file.

- **`Lua.completion.callSnippet`** [Default: `"Disable"`]  
  Shows function call snippets.

- **`Lua.completion.displayContext`** [Default: `0`]  
  Previewing the relevant code snippet of the suggestion may help you understand the usage of the suggestion. The number set indicates the number of intercepted lines in the code fragment. If it is set to `0`, this feature can be disabled.

- **`Lua.completion.enable`** [Default: `true`]  
  Enable completion.

- **`Lua.completion.keywordSnippet`** [Default: `"Replace"`]  
  Shows keyword syntax snippets.

- **`Lua.completion.postfix`** [Default: `"@"`]  
  The symbol used to trigger the postfix suggestion.

- **`Lua.completion.requireSeparator`** [Default: `"."`]  
  The separator used when `require`.

- **`Lua.completion.showParams`** [Default: `true`]  
  Display parameters in completion list. When the function has multiple definitions, they will be displayed separately.

- **`Lua.completion.showWord`** [Default: `"Fallback"`]  
  Show contextual words in suggestions.

- **`Lua.completion.workspaceWord`** [Default: `true`]  
  Whether the displayed context word contains the content of other files in the workspace.

- **`Lua.diagnostics.disable`** [Default: `[]`]  
  Disabled diagnostic (Use code in hover brackets).

- **`Lua.diagnostics.disableScheme`** [Default: `["git"]`]  
  Do not diagnose Lua files that use the following scheme.

- **`Lua.diagnostics.enable`** [Default: `true`]  
  Enable diagnostics.

- **`Lua.diagnostics.globals`** [Default: `[]`]  
  Defined global variables.

- **`Lua.diagnostics.ignoredFiles`** [Default: `"Opened"`]  
  How to diagnose ignored files.

- **`Lua.diagnostics.libraryFiles`** [Default: `"Opened"`]  
  How to diagnose files loaded via `Lua.workspace.library`.

- **`Lua.diagnostics.unusedLocalExclude`** [Default: `[]`]  
  Do not diagnose `unused-local` when the variable name matches the following pattern.

- **`Lua.diagnostics.workspaceDelay`** [Default: `3000`]  
  Latency (milliseconds) for workspace diagnostics.

- **`Lua.diagnostics.workspaceEvent`** [Default: `"OnSave"`]  
  Set the time to trigger workspace diagnostics.

- **`Lua.diagnostics.workspaceRate`** [Default: `100`]  
  Workspace diagnostics run rate (%). Decreasing this value reduces CPU usage, but also reduces the speed of workspace diagnostics. The diagnosis of the file you are currently editing is always done at full speed and is not affected by this setting.

- **`Lua.doc.packageName`** [Default: `[]`]  
  Treat specific field names as package, e.g. `m_*` means `XXX.m_id` and `XXX.m_type` are package, witch can only be accessed in the file where the definition is located.

- **`Lua.doc.privateName`** [Default: `[]`]  
  Treat specific field names as private, e.g. `m_*` means `XXX.m_id` and `XXX.m_type` are private, witch can only be accessed in the class where the definition is located.

- **`Lua.doc.protectedName`** [Default: `[]`]  
  Treat specific field names as protected, e.g. `m_*` means `XXX.m_id` and `XXX.m_type` are protected, witch can only be accessed in the class where the definition is located and its subclasses.

- **`Lua.format.defaultConfig`** [Default: `{}`]  
  The default format configuration. Has a lower priority than `.editorconfig` file in the workspace.
  Read [formatter docs](https://github.com/CppCXY/EmmyLuaCodeStyle/tree/master/docs) to learn usage.

- **`Lua.format.enable`** [Default: `true`]  
  Enable code formatter.

- **`Lua.hint.arrayIndex`** [Default: `"Auto"`]  
  Show hints of array index when constructing a table.

- **`Lua.hint.await`** [Default: `true`]  
  If the called function is marked `---@async`, prompt `await` at the call.

- **`Lua.hint.enable`** [Default: `false`]  
  Enable inlay hint.

- **`Lua.hint.paramName`** [Default: `"All"`]  
  Show hints of parameter name at the function call.

- **`Lua.hint.paramType`** [Default: `true`]  
  Show type hints at the parameter of the function.

- **`Lua.hint.semicolon`** [Default: `"SameLine"`]  
  If there is no semicolon at the end of the statement, display a virtual semicolon.

- **`Lua.hint.setType`** [Default: `false`]  
  Show hints of type at assignment operation.

- **`Lua.hover.enable`** [Default: `true`]  
  Enable hover.

- **`Lua.hover.enumsLimit`** [Default: `5`]  
  When the value corresponds to multiple types, limit the number of types displaying.

- **`Lua.hover.expandAlias`** [Default: `true`]  
  Whether to expand the alias. For example, expands `---@alias myType boolean|number` appears as `boolean|number`, otherwise it appears as `myType'.

- **`Lua.hover.previewFields`** [Default: `50`]  
  When hovering to view a table, limits the maximum number of previews for fields.

- **`Lua.hover.viewNumber`** [Default: `true`]  
  Hover to view numeric content (only if literal is not decimal).

- **`Lua.hover.viewString`** [Default: `true`]  
  Hover to view the contents of a string (only if the literal contains an escape character).

- **`Lua.hover.viewStringMax`** [Default: `1000`]  
  The maximum length of a hover to view the contents of a string.

- **`Lua.misc.executablePath`** [Default: `""`]  
  Specify the executable path in VSCode.

- **`Lua.misc.parameters`** [Default: `[]`]  
  [Command line parameters](https://github.com/LuaLS/lua-telemetry-server/tree/master/method) when starting the language server in VSCode.

- **`Lua.runtime.fileEncoding`** [Default: `"utf8"`]  
  File encoding. The `ansi` option is only available under the `Windows` platform.

- **`Lua.runtime.meta`** [Default: `"${version} ${language} ${encoding}"`]  
  Format of the directory name of the meta files.

- **`Lua.runtime.nonstandardSymbol`** [Default: `[]`]  
  Supports non-standard symbols. Make sure that your runtime environment supports these symbols.

- **`Lua.runtime.path`** [Default: `["?.lua","?/init.lua"]`]  
  When using `require`, how to find the file based on the input name.
  Setting this config to `?/init.lua` means that when you enter `require 'myfile'`, `${workspace}/myfile/init.lua` will be searched from the loaded files.
  if `runtime.pathStrict` is `false`, `${workspace}/**/myfile/init.lua` will also be searched.
  If you want to load files outside the workspace, you need to set `Lua.workspace.library` first.

- **`Lua.runtime.pathStrict`** [Default: `false`]  
  When enabled, `runtime.path` will only search the first level of directories, see the description of `runtime.path`.

- **`Lua.runtime.plugin`** [Default: `""`]  
  Plugin path. Please read [wiki](https://github.com/LuaLS/lua-language-server/wiki/Plugins) to learn more.

- **`Lua.runtime.pluginArgs`** [Default: `[]`]  
  Additional arguments for the plugin.

- **`Lua.runtime.special`** [Default: `{}`]  
  The custom global variables are regarded as some special built-in variables, and the language server will provide special support
  The following example shows that 'include' is treated as' require '.
  ```json
  "Lua.runtime.special" : {
      "include" : "require"
  }
  ```

- **`Lua.runtime.unicodeName`** [Default: `false`]  
  Allows Unicode characters in name.

- **`Lua.runtime.version`** [Default: `"Lua 5.4"`]  
  Lua runtime version.

- **`Lua.semantic.annotation`** [Default: `true`]  
  Semantic coloring of type annotations.

- **`Lua.semantic.enable`** [Default: `true`]  
  Enable semantic color. You may need to set `editor.semanticHighlighting.enabled` to `true` to take effect.

- **`Lua.semantic.keyword`** [Default: `false`]  
  Semantic coloring of keywords/literals/operators. You only need to enable this feature if your editor cannot do syntax coloring.

- **`Lua.semantic.variable`** [Default: `true`]  
  Semantic coloring of variables/fields/parameters.

- **`Lua.signatureHelp.enable`** [Default: `true`]  
  Enable signature help.

- **`Lua.spell.dict`** [Default: `[]`]  
  Custom words for spell checking.

- **`Lua.type.castNumberToInteger`** [Default: `true`]  
  Allowed to assign the `number` type to the `integer` type.

- **`Lua.type.weakNilCheck`** [Default: `false`]  
  When checking the type of union type, ignore the `nil` in it.
  
  When this setting is `false`, the `number|nil` type cannot be assigned to the `number` type. It can be with `true`.

- **`Lua.type.weakUnionCheck`** [Default: `false`]  
  Once one subtype of a union type meets the condition, the union type also meets the condition.
  
  When this setting is `false`, the `number|boolean` type cannot be assigned to the `number` type. It can be with `true`.

- **`Lua.window.progressBar`** [Default: `true`]  
  Show progress bar in status bar.

- **`Lua.window.statusBar`** [Default: `true`]  
  Show extension status in status bar.

- **`Lua.workspace.checkThirdParty`** [Default: `true`]  
  Automatic detection and adaptation of third-party libraries, currently supported libraries are:
  
  * OpenResty
  * Cocos4.0
  * LÖVE
  * LÖVR
  * skynet
  * Jass

- **`Lua.workspace.ignoreDir`** [Default: `[".vscode"]`]  
  Ignored files and directories (Use `.gitignore` grammar).

- **`Lua.workspace.ignoreSubmodules`** [Default: `true`]  
  Ignore submodules.

- **`Lua.workspace.library`** [Default: `[]`]  
  In addition to the current workspace, which directories will load files from. The files in these directories will be treated as externally provided code libraries, and some features (such as renaming fields) will not modify these files.

- **`Lua.workspace.maxPreload`** [Default: `5000`]  
  Max preloaded files.

- **`Lua.workspace.preloadFileSize`** [Default: `500`]  
  Skip files larger than this value (KB) when preloading.

- **`Lua.workspace.useGitIgnore`** [Default: `true`]  
  Ignore files list in `.gitignore` .

- **`Lua.workspace.userThirdParty`** [Default: `[]`]  
  Add private third-party library configuration file paths here, please refer to the built-in [configuration file path](https://github.com/LuaLS/lua-language-server/tree/master/meta/3rd)

## Development

1. Run `npm run build` or `npm run build:watch`
2. Link extension: `npm run link` / `npm run unlink`

## Credit

- [`LuaLS/lua-language-server`](https://github.com/LuaLS/lua-language-server#credit)

## License

[MIT © Josa Gesell](LICENSE)
