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

## Development

1. Run `yarn build` or `yarn build:watch`
2. Link extension: `yarn run link` / `yarn run unlink`

## Credit

- [`sumneko/lua-language-server`](https://github.com/sumneko/lua-language-server#credit)

## License

[MIT © Josa Gesell](LICENSE)
