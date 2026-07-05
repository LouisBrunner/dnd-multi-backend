package main

import (
	"context"
	"encoding/json"
	"flag"
	"log"
	"maps"
	"os"
	"os/signal"
	"path/filepath"
	"slices"
	"syscall"

	"github.com/LouisBrunner/esbuild-plugins/pkg/devserver"
	"github.com/evanw/esbuild/pkg/api"
)

type packageJSON struct {
	Dependencies     map[string]string `json:"dependencies"`
	PeerDependencies map[string]string `json:"peerDependencies"`
}

var packages = []string{
	"packages/dnd-multi-backend",
	"packages/react-dnd-preview",
	"packages/rdndmb-html5-to-touch",
	"packages/react-dnd-multi-backend",
}

var exampleEntryPoints = map[string]string{
	"examples_dnd-multi-backend.min":        "./packages/dnd-multi-backend/examples/index.ts",
	"examples_react-dnd-multi-backend.min":  "./packages/react-dnd-multi-backend/examples/index.tsx",
	"examples_react-dnd-preview_main.min":   "./packages/react-dnd-preview/examples/main/index.tsx",
	"examples_react-dnd-preview_offset.min": "./packages/react-dnd-preview/examples/offset/index.tsx",
}

func externalsForPackage(dir string) []string {
	path := filepath.Join(dir, "package.json")
	data, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("reading %s: %v", path, err)
	}
	var pkg packageJSON
	err = json.Unmarshal(data, &pkg)
	if err != nil {
		log.Fatalf("parsing %s: %v", path, err)
	}
	seen := map[string]struct{}{}
	for name := range pkg.Dependencies {
		if _, found := seen[name]; !found {
			seen[name] = struct{}{}
		}
	}
	for name := range pkg.PeerDependencies {
		if _, found := seen[name]; !found {
			seen[name] = struct{}{}
		}
	}
	return slices.Collect(maps.Keys(seen))
}

func buildPackage(dir string) error {
	log.Printf("> Building %s\n", dir)
	return devserver.Build(devserver.Options{
		Build: api.BuildOptions{
			EntryPoints: []string{dir + "/src/index.ts"},
			Outfile:     dir + "/dist/index.js",
			Format:      api.FormatESModule,
			Bundle:      true,
			External:    externalsForPackage(dir),
			Target:      api.ES2020,
		},
	})
}

func buildExamples(outdir string) error {
	log.Printf("> Building examples -> %s\n", outdir)
	entries := make([]api.EntryPoint, 0, len(exampleEntryPoints))
	for out, in := range exampleEntryPoints {
		entries = append(entries, api.EntryPoint{InputPath: in, OutputPath: out})
	}
	return devserver.Build(devserver.Options{
		Build: api.BuildOptions{
			EntryPointsAdvanced: entries,
			Bundle:              true,
			Tsconfig:            "./tsconfig.json",
		},
		PublicDir: outdir,
	})
}

func devExamples(port int) error {
	entries := make([]api.EntryPoint, 0, len(exampleEntryPoints))
	for out, in := range exampleEntryPoints {
		entries = append(entries, api.EntryPoint{InputPath: in, OutputPath: out})
	}

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer cancel()

	return devserver.Start(ctx, devserver.Options{
		Build: api.BuildOptions{
			EntryPointsAdvanced: entries,
			Bundle:              true,
			Tsconfig:            "./tsconfig.json",
		},
		OpenBrowser: true,
		PublicDir:   "examples/",
		Port:        port,
	})
}

func main() {
	mode := flag.String("mode", "build", "build | examples | dev")
	port := flag.Int("port", 4001, "dev server port")
	flag.Parse()

	switch *mode {
	case "build":
		log.Println("Building packages")
		for _, pkg := range packages {
			err := buildPackage(pkg)
			if err != nil {
				log.Fatalf("Build %s: %v", pkg, err)
			}
		}
		log.Println("Done")

	case "examples":
		err := buildExamples("examples/")
		if err != nil {
			log.Fatalf("Examples: %v", err)
		}

	case "dev":
		err := devExamples(*port)
		if err != nil {
			log.Fatalf("Dev: %v", err)
		}

	default:
		log.Fatalf("Unknown mode: %s (use build, examples, or dev)", *mode)
	}
}
