package main

import (
	"encoding/json"
	"flag"
	"log"
	"os"
	"path/filepath"

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
	if err := json.Unmarshal(data, &pkg); err != nil {
		log.Fatalf("parsing %s: %v", path, err)
	}
	seen := map[string]bool{}
	var externals []string
	for name := range pkg.Dependencies {
		if !seen[name] {
			seen[name] = true
			externals = append(externals, name)
		}
	}
	for name := range pkg.PeerDependencies {
		if !seen[name] {
			seen[name] = true
			externals = append(externals, name)
		}
	}
	return externals
}

func buildPackage(dir string) {
	log.Printf("> Building %s\n", dir)
	result := api.Build(api.BuildOptions{
		EntryPoints:       []string{dir + "/src/index.ts"},
		Outfile:           dir + "/dist/index.js",
		Format:            api.FormatESModule,
		Bundle:            true,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
		External:          externalsForPackage(dir),
		Target:            api.ES2020,
		Write:             true,
	})
	if len(result.Errors) > 0 {
		for _, e := range result.Errors {
			log.Printf("Error: %s", e.Text)
		}
		log.Fatalf("Build failed for %s", dir)
	}
}

func buildExamples(outdir string) {
	log.Printf("> Building examples -> %s\n", outdir)
	entries := make([]api.EntryPoint, 0, len(exampleEntryPoints))
	for out, in := range exampleEntryPoints {
		entries = append(entries, api.EntryPoint{InputPath: in, OutputPath: out})
	}
	result := api.Build(api.BuildOptions{
		EntryPointsAdvanced: entries,
		Outdir:              outdir,
		Bundle:              true,
		MinifyWhitespace:    true,
		MinifyIdentifiers:   true,
		MinifySyntax:        true,
		Write:               true,
	})
	if len(result.Errors) > 0 {
		for _, e := range result.Errors {
			log.Printf("Error: %s", e.Text)
		}
		log.Fatalf("Examples build failed")
	}
}

func devExamples(port int) {
	log.Printf("> Starting dev server on port %d\n", port)
	entries := make([]api.EntryPoint, 0, len(exampleEntryPoints))
	for out, in := range exampleEntryPoints {
		entries = append(entries, api.EntryPoint{InputPath: in, OutputPath: out})
	}
	ctx, err := api.Context(api.BuildOptions{
		EntryPointsAdvanced: entries,
		Outdir:              "examples/",
		Bundle:              true,
		Sourcemap:           api.SourceMapInline,
		Write:               true,
	})
	if err != nil {
		log.Fatalf("Context: %v", err)
	}

	if err := ctx.Watch(api.WatchOptions{}); err != nil {
		log.Fatalf("Watch: %v", err)
	}

	_, serveErr := ctx.Serve(api.ServeOptions{
		Host:     "localhost",
		Port:     port,
		Servedir: "examples/",
	})
	if serveErr != nil {
		log.Fatalf("Serve: %v", serveErr)
	}

	log.Printf("Listening on http://localhost:%d", port)
	<-make(chan struct{})
	ctx.Dispose()
}

func main() {
	mode := flag.String("mode", "build", "build | examples | dev")
	port := flag.Int("port", 4001, "dev server port")
	flag.Parse()

	switch *mode {
	case "build":
		log.Println("Building packages")
		for _, pkg := range packages {
			buildPackage(pkg)
		}
		log.Println("Done")

	case "examples":
		buildExamples("examples/")
		log.Println("Done")

	case "dev":
		devExamples(*port)

	default:
		log.Fatalf("Unknown mode: %s (use build, examples, or dev)", *mode)
	}
}
