# compile and run dev build locally
dev:
  pnpm dev

# install new dev dependency
i *PKGS:
	pnpm install -D -- {{PKGS}}

# uninstall dependancy
r *PKGS:
	pnpm rm -- {{PKGS}}

# list installed dependancy
l:
	pnpm list

# update
u:
	pnpm update && nix flake update

# build release
b:
	pnpm build

# reload dev environment
dir:
  direnv reload