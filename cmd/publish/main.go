package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"slices"
	"strings"
)

type packageJSON struct {
	Name         string            `json:"name"`
	Version      string            `json:"version"`
	Dependencies map[string]string `json:"dependencies"`
	Workspaces   []string          `json:"workspaces"`
}

func run(name string, args ...string) {
	cmd := exec.Command(name, args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Run()
	if err != nil {
		log.Fatalf("❌ command failed: %s %s: %v", name, strings.Join(args, " "), err)
	}
}

func output(name string, args ...string) string {
	out, err := exec.Command(name, args...).Output()
	if err != nil {
		log.Fatalf("❌ command failed: %s %s: %v", name, strings.Join(args, " "), err)
	}
	return strings.TrimSpace(string(out))
}

func readPackageJSON(dir string) packageJSON {
	data, err := os.ReadFile(filepath.Join(dir, "package.json"))
	if err != nil {
		log.Fatalf("❌ failed to read %s/package.json: %v", dir, err)
	}
	var pkg packageJSON
	err = json.Unmarshal(data, &pkg)
	if err != nil {
		log.Fatalf("❌ failed to parse %s/package.json: %v", dir, err)
	}
	return pkg
}

func writePackageJSON(dir string, pkg packageJSON) {
	data, err := json.MarshalIndent(pkg, "", "  ")
	if err != nil {
		log.Fatalf("❌ failed to marshal package.json: %v", err)
	}
	err = os.WriteFile(filepath.Join(dir, "package.json"), append(data, '\n'), 0o644)
	if err != nil {
		log.Fatalf("❌ failed to write %s/package.json: %v", dir, err)
	}
}

func resolveWorkspaces(root string) []string {
	rootPkg := readPackageJSON(root)
	var dirs []string
	for _, pattern := range rootPkg.Workspaces {
		matches, err := filepath.Glob(filepath.Join(root, pattern))
		if err != nil {
			log.Fatalf("❌ failed to glob workspace pattern %q: %v", pattern, err)
		}
		for _, m := range matches {
			info, err := os.Stat(filepath.Join(m, "package.json"))
			if err == nil && !info.IsDir() {
				dirs = append(dirs, m)
			}
		}
	}
	slices.SortFunc(dirs, func(a, b string) int {
		pkgA := readPackageJSON(a)
		pkgB := readPackageJSON(b)
		if _, ok := pkgA.Dependencies[pkgB.Name]; ok {
			return 1
		}
		if _, ok := pkgB.Dependencies[pkgA.Name]; ok {
			return -1
		}
		return 0
	})
	return dirs
}

func main() {
	tag := flag.String("tag", "", "npm dist-tag to publish under")
	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage: publish [flags] <semver>\n\nFlags:\n")
		flag.PrintDefaults()
	}
	flag.Parse()

	if flag.NArg() < 1 {
		flag.Usage()
		os.Exit(1)
	}
	ver := flag.Arg(0)

	if *tag != "" {
		fmt.Printf("🚀 Publishing version: %s with tag %s\n", ver, *tag)
	} else {
		fmt.Printf("🚀 Publishing version: %s\n", ver)
	}

	root, err := os.Getwd()
	if err != nil {
		log.Fatalf("❌ failed to get working directory: %v", err)
	}

	fmt.Println("🔍 Checking if all changes are committed")
	changes := output("git", "status", "--porcelain")
	if changes != "" {
		fmt.Fprintln(os.Stderr, "❌ Please commit all changes before publishing")
		os.Exit(1)
	}

	fmt.Println("🔍 Checking we are on main")
	branch := output("git", "branch", "--show-current")
	if branch != "main" {
		fmt.Fprintln(os.Stderr, "❌ Please switch to main branch before publishing")
		os.Exit(1)
	}

	dirs := resolveWorkspaces(root)

	wsNames := make([]string, len(dirs))
	for i, d := range dirs {
		wsNames[i] = readPackageJSON(d).Name
	}

	var pkgFiles []string
	for _, d := range dirs {
		pkg := readPackageJSON(d)
		fmt.Printf("✏️ Updating %s version to: %s\n", pkg.Name, ver)
		pkg.Version = ver
		for dep := range pkg.Dependencies {
			if slices.Contains(wsNames, dep) {
				pkg.Dependencies[dep] = "^" + ver
			}
		}
		fmt.Printf("📝 Writing %s package.json\n", pkg.Name)
		writePackageJSON(d, pkg)
		pkgFiles = append(pkgFiles, filepath.Join(d, "package.json"))
	}

	fmt.Println("✅ Formatting package.json files")
	run("bunx", append([]string{"@biomejs/biome", "format", "--write"}, pkgFiles...)...)

	for _, d := range dirs {
		pkg := readPackageJSON(d)
		fmt.Printf("🔨 Publishing %s\n", pkg.Name)
		args := []string{"--cwd", d, "publish"}
		if *tag != "" {
			args = append(args, "--tag", *tag)
		}
		run("bun", args...)
	}

	fmt.Println("↩️ Committing changes")
	run("git", "commit", "-am", "release: v"+ver)
	run("git", "push")

	fmt.Println("🏷️ Tagging")
	run("git", "tag", "v"+ver)
	run("git", "push", "--tags")
	run("gh", "release", "create", "v"+ver, "--generate-notes")
}
