package main

import (
    "embed"
    "fmt"
    "io/fs"
    "net"
    "net/http"
    "os"
    "os/exec"
    "path/filepath"
    "runtime"
    "time"
)

//go:embed web/* web/assets/*
var site embed.FS

const installFolder = "PsychologistYaroslavlConcept3Fixed"
const defaultPort = 5273

func main() {
    dir, err := installDir()
    if err != nil { showError(err); return }
    if err := extractSite(dir); err != nil { showError(err); return }

    ln, port, err := listenPort(defaultPort)
    if err != nil { showError(err); return }
    defer ln.Close()

    handlerFS, err := fs.Sub(site, "web")
    if err != nil { showError(err); return }

    handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        w.Header().Set("Pragma", "no-cache")
        http.FileServer(http.FS(handlerFS)).ServeHTTP(w, r)
    })
    server := &http.Server{Handler: handler}
    go func() { _ = server.Serve(ln) }()

    url := fmt.Sprintf("http://127.0.0.1:%d/", port)
    if !waitReady(url, 5*time.Second) { showError(fmt.Errorf("локальный сервер не запустился: %s", url)); return }
    openBrowser(url)

    select {}
}

func installDir() (string, error) {
    base := os.Getenv("LOCALAPPDATA")
    if base == "" { base = os.TempDir() }
    dir := filepath.Join(base, installFolder)
    return dir, os.MkdirAll(dir, 0o755)
}

func extractSite(dir string) error {
    return fs.WalkDir(site, "web", func(path string, d fs.DirEntry, walkErr error) error {
        if walkErr != nil { return walkErr }
        if d.IsDir() { return nil }
        rel := filepath.FromSlash(path[len("web/"):])
        dest := filepath.Join(dir, rel)
        if err := os.MkdirAll(filepath.Dir(dest), 0o755); err != nil { return err }
        data, err := fs.ReadFile(site, path)
        if err != nil { return err }
        return os.WriteFile(dest, data, 0o644)
    })
}

func listenPort(start int) (net.Listener, int, error) {
    for p := start; p < start+100; p++ {
        ln, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", p))
        if err == nil { return ln, p, nil }
    }
    return nil, 0, fmt.Errorf("не найден свободный localhost-порт")
}

func waitReady(url string, timeout time.Duration) bool {
    deadline := time.Now().Add(timeout)
    client := &http.Client{Timeout: 400 * time.Millisecond}
    for time.Now().Before(deadline) {
        resp, err := client.Get(url)
        if err == nil {
            resp.Body.Close()
            if resp.StatusCode >= 200 && resp.StatusCode < 500 { return true }
        }
        time.Sleep(80 * time.Millisecond)
    }
    return false
}

func openBrowser(url string) {
    switch runtime.GOOS {
    case "windows":
        // PowerShell Start-Process is more reliable than cmd/start for GUI builds.
        _ = exec.Command("powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "Start-Process", url).Start()
    case "darwin":
        _ = exec.Command("open", url).Start()
    default:
        _ = exec.Command("xdg-open", url).Start()
    }
}

func showError(err error) {
    if runtime.GOOS == "windows" {
        _ = exec.Command("powershell", "-NoProfile", "-Command", "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show", err.Error(), "PsychologistYaroslavl").Run()
    }
}
