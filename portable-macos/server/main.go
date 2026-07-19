package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"
)

func main() {
	executable, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}
	packageRoot := filepath.Dir(filepath.Dir(executable))

	root := flag.String("root", filepath.Join(packageRoot, "site"), "static site directory")
	port := flag.Int("port", 4173, "loopback port")
	pidFile := flag.String("pid", filepath.Join(packageRoot, ".server.pid"), "pid file")
	flag.Parse()

	siteRoot, err := filepath.Abs(*root)
	if err != nil {
		log.Fatal(err)
	}
	info, err := os.Stat(siteRoot)
	if err != nil || !info.IsDir() {
		log.Fatalf("site directory not found: %s", siteRoot)
	}

	if err := os.WriteFile(*pidFile, []byte(fmt.Sprintf("%d", os.Getpid())), 0o600); err != nil {
		log.Fatal(err)
	}
	defer removeOwnedPID(*pidFile)

	handler := staticHandler(siteRoot)
	server := &http.Server{
		Addr:              fmt.Sprintf("127.0.0.1:%d", *port),
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
	}

	errCh := make(chan error, 1)
	go func() {
		log.Printf("MAKEINE ARCHIVE available at http://127.0.0.1:%d/", *port)
		errCh <- server.ListenAndServe()
	}()

	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM)
	select {
	case <-signalCh:
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		if err := server.Shutdown(ctx); err != nil {
			log.Printf("shutdown error: %v", err)
		}
	case err := <-errCh:
		if !errors.Is(err, http.ErrServerClosed) {
			log.Fatal(err)
		}
	}
}

func staticHandler(siteRoot string) http.Handler {
	return http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		if request.Method != http.MethodGet && request.Method != http.MethodHead {
			http.Error(response, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		relative := strings.TrimPrefix(request.URL.Path, "/")
		candidate := filepath.Join(siteRoot, filepath.FromSlash(relative))
		resolved, err := filepath.Abs(candidate)
		if err != nil || !insideRoot(siteRoot, resolved) {
			http.NotFound(response, request)
			return
		}

		info, statErr := os.Stat(resolved)
		if statErr == nil && info.IsDir() {
			resolved = filepath.Join(resolved, "index.html")
		} else if statErr != nil && filepath.Ext(resolved) == "" {
			resolved = filepath.Join(resolved, "index.html")
		}

		if _, err := os.Stat(resolved); err != nil {
			http.NotFound(response, request)
			return
		}

		response.Header().Set("Cache-Control", "no-cache")
		response.Header().Set("X-Content-Type-Options", "nosniff")
		http.ServeFile(response, request, resolved)
	})
}

func insideRoot(root, candidate string) bool {
	relative, err := filepath.Rel(root, candidate)
	return err == nil && relative != ".." && !strings.HasPrefix(relative, ".."+string(filepath.Separator))
}

func removeOwnedPID(path string) {
	content, err := os.ReadFile(path)
	if err == nil && string(content) == fmt.Sprintf("%d", os.Getpid()) {
		_ = os.Remove(path)
	}
}
