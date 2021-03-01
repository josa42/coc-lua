# coc-lua

![build binaries](https://github.com/josa42/coc-lua-binaries/workflows/build/badge.svg)
![test](https://github.com/josa42/coc-lua/workflows/Main/badge.svg)

--------------------------------------------------------------------------------

Lua language server extension using [`sumneko/lua-language-server`](https://github.com/sumneko/lua-language-server)
for [`coc.nvim`](https://github.com/neoclide/coc.nvim)
(pre-build binaries: [coc-lua-binaries](https://github.com/josa42/coc-lua-binaries/releases/tag/latest)).

## Install

In your vim/neovim, run command:

```
:CocInstall coc-lua
```

## Features

See
- [`sumneko/lua-language-server`](https://github.com/sumneko/lua-language-server)

## Commands

- `lua.version`
  Print extension version

- `lua.update`
  Update language server

## Settings

- `lua.enable` set to `false` to disable lua language server.

Trigger completion in `coc-settings.json` to get complete list.

### sumneko/lua-language-server

- **`Lua.color.mode`** [Default: `"Semantic"`]  
  Color mode.

- **`Lua.completion.callSnippet`** [Default: `"Disable"`]  
  Shows function call snippets.

- **`Lua.completion.displayContext`** [Default: `6`]  
  Previewing the relevant code snippet of the suggestion may help you understand the usage of the suggestion. The number set indicates the number of intercepted lines in the code fragment. If it is set to `0`, this feature can be disabled.

- **`Lua.completion.enable`** [Default: `true`]  
  Enable completion.

- **`Lua.completion.keywordSnippet`** [Default: `"Replace"`]  
  Shows keyword syntax snippets.

- **`Lua.completion.workspaceWord`** [Default: `true`]  
  Shows words within the workspace.

- **`Lua.diagnostics.disable`**  
  Disabled diagnostic (Use code in hover brackets).

- **`Lua.diagnostics.enable`** [Default: `true`]  
  Enable diagnostics.

- **`Lua.diagnostics.globals`**  
  Defined global variables.

- **`Lua.diagnostics.neededFileStatus`**  
  If you want to check only opened files, choice Opened; else choice Any.

- **`Lua.diagnostics.severity`**  
  Modified diagnostic severity.

- **`Lua.diagnostics.workspaceDelay`** [Default: `0`]  
  Latency (milliseconds) for workspace diagnostics. When you start the workspace, or edit any file, the entire workspace will be re-diagnosed in the background. Set to negative to disable workspace diagnostics.

- **`Lua.diagnostics.workspaceRate`** [Default: `100`]  
  Workspace diagnostics run rate (%). Decreasing this value reduces CPU usage, but also reduces the speed of workspace diagnostics. The diagnosis of the file you are currently editing is always done at full speed and is not affected by this setting.

- **`Lua.hint.enable`** [Default: `false`]  
  Enabel hint.

- **`Lua.hint.paramName`** [Default: `true`]  
  Hint parameter name when the parameter called is literal.

- **`Lua.hint.paramType`** [Default: `true`]  
  Show type hints at the parameter of the function.

- **`Lua.hint.setType`** [Default: `false`]  
  Hint type at assignment operation.

- **`Lua.hover.enable`** [Default: `true`]  
  Enable hover.

- **`Lua.hover.fieldInfer`** [Default: `3000`]  
  When hovering to view a table, type infer will be performed for each field. When the accumulated time of type infer reaches the set value (MS), the type infer of subsequent fields will be skipped.

- **`Lua.hover.previewFields`** [Default: `100`]  
  When hovering to view a table, limits the maximum number of previews for fields.

- **`Lua.hover.viewNumber`** [Default: `true`]  
  Hover to view numeric content (only if literal is not decimal).

- **`Lua.hover.viewString`** [Default: `true`]  
  Hover to view the contents of a string (only if the literal contains an escape character).

- **`Lua.hover.viewStringMax`** [Default: `1000`]  
  The maximum length of a hover to view the contents of a string.

- **`Lua.intelliSense.searchDepth`** [Default: `0`]  
  Set the search depth for IntelliSense. Increasing this value increases accuracy, but decreases performance. Different workspace have different tolerance for this setting. Please adjust it to the appropriate value.

- **`Lua.runtime.nonstandardSymbol`**  
  Supports non-standard symbols. Make sure that your runtime environment supports these symbols.

- **`Lua.runtime.path`** [Default: `["?.lua","?/init.lua","?/?.lua"]`]  
  `package.path`

- **`Lua.runtime.plugin`** [Default: `".vscode/lua/plugin.lua"`]  
  (Proposed) Plugin path.

- **`Lua.runtime.special`**  
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

- **`Lua.signatureHelp.enable`** [Default: `true`]  
  Enable signature help.

- **`Lua.telemetry.enable`** [Default: `true`]  
  Enable telemetry to send your editor information and error logs over the network
  * [What data will be sent](https://github.com/sumneko/lua-language-server/blob/master/script/service/telemetry.lua)
  * [How to use this data](https://github.com/sumneko/lua-telemetry-server/tree/master/method)

- **`Lua.window.progressBar`** [Default: `true`]  
  Show progress bar in status bar.

- **`Lua.window.statusBar`** [Default: `true`]  
  Show extension status in status bar.

- **`Lua.workspace.ignoreDir`** [Default: `[".vscode"]`]  
  Ignored files and directories (Use `.gitignore` grammar).

- **`Lua.workspace.ignoreSubmodules`** [Default: `true`]  
  Ignore submodules.

- **`Lua.workspace.library`**  
  Load external library.
  This feature can load external Lua files, which can be used for definition, automatic completion and other functions. Note that the language server does not monitor changes in external files and needs to restart if the external files are modified.

- **`Lua.workspace.maxPreload`** [Default: `1000`]  
  Max preloaded files.

- **`Lua.workspace.preloadFileSize`** [Default: `100`]  
  Skip files larger than this value (KB) when preloading.

- **`Lua.workspace.useGitIgnore`** [Default: `true`]  
  Ignore files list in `.gitignore` .

## Development

1. Run `yarn build` or `yarn build:watch`
2. Link extension: `yarn run link` / `yarn run unlink`

## Credit

- [`sumneko/lua-language-server`](https://github.com/sumneko/lua-language-server#credit)

## License

[MIT © Josa Gesell](LICENSE)
