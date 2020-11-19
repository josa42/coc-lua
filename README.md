# coc-lua

Lua language server extension using [`lua-lsp`](https://github.com/Alloyed/lua-lsp)
or [`sumneko/lua-language-server`](https://github.com/sumneko/lua-language-server)
for [`coc.nvim`](https://github.com/neoclide/coc.nvim).

## Install

In your vim/neovim, run command:

```
:CocInstall coc-lua
```

## Features

See
    - [`lua-lsp`](https://github.com/Alloyed/lua-lsp)
    - [`sumneko/lua-language-server`](https://github.com/sumneko/lua-language-server)

## Configuration options

- `lua.enable` set to `false` to disable lua language server.
- `lua.commandPath` absolute path of lua-lsp executable.
- `lua.useSumnekoLs` **EXPERIMENTAL** Use [`sumneko/lua-language-server`](https://github.com/sumneko/lua-language-server)
  as language server.

Trigger completion in `coc-settings.json` to get complete list.

## Development

1. Run `yarn build` or `yarn build:watch`
2. Link extension: `yarn run link` / `yarn run unlink`

## License

[MIT © Josa Gesell](LICENSE)
