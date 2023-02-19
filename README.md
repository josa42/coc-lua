# coc-lua

![test](https://github.com/josa42/coc-lua/workflows/Main/badge.svg)

--------------------------------------------------------------------------------

Lua language server extension using [`LuaLS/lua-language-server`](https://github.com/LuaLS/lua-language-server)
for [`coc.nvim`](https://github.com/neoclide/coc.nvim).

## Install

In your vim/neovim, run command:

```
:CocInstall coc-lua
```

## Features

See
- [`LuaLS/lua-language-server`](https://github.com/LuaLS/lua-language-server)

## Commands

| Key               | Description             |
|-------------------|-------------------------|
| **`lua.version`** | Print extension version |
| **`lua.update`**  | Update language server  |

## Settings

| Key              | Description                                    | Default |
|------------------|------------------------------------------------|---------|
| **`lua.enable`** | set to `false` to disable lua language server. | `true`  |

Trigger completion in `coc-settings.json` to get complete list.

### LuaLS/lua-language-server

| Key | Description | Default |
|-----|-------------|---------|
| **`Lua.addonManager.enable`** | Set the on/off state for the addon manager. | true |
| **`Lua.codeLens.enable`** | Enable code lens. |  |
| **`Lua.completion.autoRequire`** | When the input looks like a file name, automatically `require` this file. | true |
| **`Lua.completion.callSnippet`** | Shows function call snippets. | "Disable" |
| **`Lua.completion.displayContext`** | Previewing the relevant code snippet of the suggestion may help you understand the usage of the suggestion. The number set indicates the number of intercepted lines in the code fragment. If it is set to `0`, this feature can be disabled. |  |
| **`Lua.completion.enable`** | Enable completion. | true |
| **`Lua.completion.keywordSnippet`** | Shows keyword syntax snippets. | "Replace" |
| **`Lua.completion.postfix`** | The symbol used to trigger the postfix suggestion. | "@" |
| **`Lua.completion.requireSeparator`** | The separator used when `require`. | "." |
| **`Lua.completion.showParams`** | Display parameters in completion list. When the function has multiple definitions, they will be displayed separately. | true |
| **`Lua.completion.showWord`** | Show contextual words in suggestions. | "Fallback" |
| **`Lua.completion.workspaceWord`** | Whether the displayed context word contains the content of other files in the workspace. | true |
| **`Lua.diagnostics.disable`** | Disabled diagnostic (Use code in hover brackets). | [] |
| **`Lua.diagnostics.disableScheme`** | Do not diagnose Lua files that use the following scheme. | ["git"] |
| **`Lua.diagnostics.enable`** | Enable diagnostics. | true |
| **`Lua.diagnostics.globals`** | Defined global variables. | [] |
| **`Lua.diagnostics.ignoredFiles`** | How to diagnose ignored files. | "Opened" |
| **`Lua.diagnostics.libraryFiles`** | How to diagnose files loaded via `Lua.workspace.library`. | "Opened" |
| **`Lua.diagnostics.unusedLocalExclude`** | Do not diagnose `unused-local` when the variable name matches the following pattern. | [] |
| **`Lua.diagnostics.workspaceDelay`** | Latency (milliseconds) for workspace diagnostics. | 3000 |
| **`Lua.diagnostics.workspaceEvent`** | Set the time to trigger workspace diagnostics. | "OnSave" |
| **`Lua.diagnostics.workspaceRate`** | Workspace diagnostics run rate (%). Decreasing this value reduces CPU usage, but also reduces the speed of workspace diagnostics. The diagnosis of the file you are currently editing is always done at full speed and is not affected by this setting. | 100 |
| **`Lua.doc.packageName`** | Treat specific field names as package, e.g. `m_*` means `XXX.m_id` and `XXX.m_type` are package, witch can only be accessed in the file where the definition is located. | [] |
| **`Lua.doc.privateName`** | Treat specific field names as private, e.g. `m_*` means `XXX.m_id` and `XXX.m_type` are private, witch can only be accessed in the class where the definition is located. | [] |
| **`Lua.doc.protectedName`** | Treat specific field names as protected, e.g. `m_*` means `XXX.m_id` and `XXX.m_type` are protected, witch can only be accessed in the class where the definition is located and its subclasses. | [] |
| **`Lua.format.defaultConfig`** | The default format configuration. Has a lower priority than `.editorconfig` file in the workspace.<br>Read [formatter docs](https://github.com/CppCXY/EmmyLuaCodeStyle/tree/master/docs) to learn usage. | {} |
| **`Lua.format.enable`** | Enable code formatter. | true |
| **`Lua.hint.arrayIndex`** | Show hints of array index when constructing a table. | "Auto" |
| **`Lua.hint.await`** | If the called function is marked `---@async`, prompt `await` at the call. | true |
| **`Lua.hint.enable`** | Enable inlay hint. |  |
| **`Lua.hint.paramName`** | Show hints of parameter name at the function call. | "All" |
| **`Lua.hint.paramType`** | Show type hints at the parameter of the function. | true |
| **`Lua.hint.semicolon`** | If there is no semicolon at the end of the statement, display a virtual semicolon. | "SameLine" |
| **`Lua.hint.setType`** | Show hints of type at assignment operation. |  |
| **`Lua.hover.enable`** | Enable hover. | true |
| **`Lua.hover.enumsLimit`** | When the value corresponds to multiple types, limit the number of types displaying. | 5 |
| **`Lua.hover.expandAlias`** | Whether to expand the alias. For example, expands `---@alias myType boolean|number` appears as `boolean|number`, otherwise it appears as `myType'. | true |
| **`Lua.hover.previewFields`** | When hovering to view a table, limits the maximum number of previews for fields. | 50 |
| **`Lua.hover.viewNumber`** | Hover to view numeric content (only if literal is not decimal). | true |
| **`Lua.hover.viewString`** | Hover to view the contents of a string (only if the literal contains an escape character). | true |
| **`Lua.hover.viewStringMax`** | The maximum length of a hover to view the contents of a string. | 1000 |
| **`Lua.misc.executablePath`** | Specify the executable path in VSCode. |  |
| **`Lua.misc.parameters`** | [Command line parameters](https://github.com/LuaLS/lua-telemetry-server/tree/master/method) when starting the language server in VSCode. | [] |
| **`Lua.runtime.fileEncoding`** | File encoding. The `ansi` option is only available under the `Windows` platform. | "utf8" |
| **`Lua.runtime.meta`** | Format of the directory name of the meta files. | "${version} ${language} ${encoding}" |
| **`Lua.runtime.nonstandardSymbol`** | Supports non-standard symbols. Make sure that your runtime environment supports these symbols. | [] |
| **`Lua.runtime.path`** | When using `require`, how to find the file based on the input name.<br>Setting this config to `?/init.lua` means that when you enter `require 'myfile'`, `${workspace}/myfile/init.lua` will be searched from the loaded files.<br>if `runtime.pathStrict` is `false`, `${workspace}/**/myfile/init.lua` will also be searched.<br>If you want to load files outside the workspace, you need to set `Lua.workspace.library` first. | ["?.lua","?/init.lua"] |
| **`Lua.runtime.pathStrict`** | When enabled, `runtime.path` will only search the first level of directories, see the description of `runtime.path`. |  |
| **`Lua.runtime.plugin`** | Plugin path. Please read [wiki](https://github.com/LuaLS/lua-language-server/wiki/Plugins) to learn more. |  |
| **`Lua.runtime.pluginArgs`** | Additional arguments for the plugin. | [] |
| **`Lua.runtime.special`** | The custom global variables are regarded as some special built-in variables, and the language server will provide special support<br>The following example shows that 'include' is treated as' require '.<br>```json<br>"Lua.runtime.special" : {<br>    "include" : "require"<br>}<br>``` | {} |
| **`Lua.runtime.unicodeName`** | Allows Unicode characters in name. |  |
| **`Lua.runtime.version`** | Lua runtime version. | "Lua 5.4" |
| **`Lua.semantic.annotation`** | Semantic coloring of type annotations. | true |
| **`Lua.semantic.enable`** | Enable semantic color. You may need to set `editor.semanticHighlighting.enabled` to `true` to take effect. | true |
| **`Lua.semantic.keyword`** | Semantic coloring of keywords/literals/operators. You only need to enable this feature if your editor cannot do syntax coloring. |  |
| **`Lua.semantic.variable`** | Semantic coloring of variables/fields/parameters. | true |
| **`Lua.signatureHelp.enable`** | Enable signature help. | true |
| **`Lua.spell.dict`** | Custom words for spell checking. | [] |
| **`Lua.type.castNumberToInteger`** | Allowed to assign the `number` type to the `integer` type. | true |
| **`Lua.type.weakNilCheck`** | When checking the type of union type, ignore the `nil` in it.<br><br>When this setting is `false`, the `number|nil` type cannot be assigned to the `number` type. It can be with `true`. |  |
| **`Lua.type.weakUnionCheck`** | Once one subtype of a union type meets the condition, the union type also meets the condition.<br><br>When this setting is `false`, the `number|boolean` type cannot be assigned to the `number` type. It can be with `true`. |  |
| **`Lua.window.progressBar`** | Show progress bar in status bar. | true |
| **`Lua.window.statusBar`** | Show extension status in status bar. | true |
| **`Lua.workspace.checkThirdParty`** | Automatic detection and adaptation of third-party libraries, currently supported libraries are:<br><br>* OpenResty<br>* Cocos4.0<br>* LÖVE<br>* LÖVR<br>* skynet<br>* Jass | true |
| **`Lua.workspace.ignoreDir`** | Ignored files and directories (Use `.gitignore` grammar). | [".vscode"] |
| **`Lua.workspace.ignoreSubmodules`** | Ignore submodules. | true |
| **`Lua.workspace.library`** | In addition to the current workspace, which directories will load files from. The files in these directories will be treated as externally provided code libraries, and some features (such as renaming fields) will not modify these files. | [] |
| **`Lua.workspace.maxPreload`** | Max preloaded files. | 5000 |
| **`Lua.workspace.preloadFileSize`** | Skip files larger than this value (KB) when preloading. | 500 |
| **`Lua.workspace.useGitIgnore`** | Ignore files list in `.gitignore` . | true |
| **`Lua.workspace.userThirdParty`** | Add private third-party library configuration file paths here, please refer to the built-in [configuration file path](https://github.com/LuaLS/lua-language-server/tree/master/meta/3rd) | [] |
## Development

1. Run `npm run build` or `npm run build:watch`
2. Link extension: `npm run link` / `npm run unlink`

## Credit

- [`LuaLS/lua-language-server`](https://github.com/LuaLS/lua-language-server#credit)

## License

[MIT © Josa Gesell](LICENSE)
