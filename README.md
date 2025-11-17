# phosphene

A CLI tool to track wplace progress.

A [phosphene](https://en.wikipedia.org/wiki/Phosphene) is the phenomenon of seeing light without light entering the eye.

## Usage

Currently it requires a bit of manual work. Clone the repo and install the dependencies:
```
bun install
```

Then run:
```
bun run build
```

Copy the resulting binary into your PATH and check if it works:
```
phosphene --version
```

## TODO

- [ ] add config file
- [ ] add build and publish step
- [ ] add remote storage option
- [ ] add cron job (`phosphene toggle`)
- [ ] add project success celebration
- [ ] add drawing guard (cron job)
- [ ] figure out if it's possible to consume pixel share links
- [ ] try to remove as many dependencies as possible

## Credits

[wplace-export](https://github.com/joaoalves03/wplace-export) by [João Alves](https://github.com/joaoalves03) was a great starting point, even though it only allows exporting at the chunk level.
