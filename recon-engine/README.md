# SecureVault Reconnaissance Engine

A comprehensive reconnaissance engine running in Docker isolated containers with Python orchestration scripts.

## Features

- **Subdomain Discovery**: subfinder, dnsx, assetfinder, knockpy, crt.sh
- **Port Scanning**: nmap, naabu
- **Web Crawling**: httpx, katana, subjs, wafw00f
- **Vulnerability Scanning**: nuclei, nikto
- **Directory Bruteforce**: ffuf, gobuster, dirsearch
- **CVE Lookup**: NVD/CVE Database
- **Exploit Lookup**: Exploit DB

## Installation

### Prerequisites

- Docker
- Docker Compose

### Setup

1. Clone the repository:
```bash
cd recon-engine
```

2. Build the Docker image:
```bash
docker-compose build
```

3. Run the reconnaissance engine:
```bash
docker-compose up -d
```

## Usage

### Run Full Reconnaissance

```bash
docker-compose exec recon-engine python scripts/main.py example.com
```

### Run Specific Phase

```bash
docker-compose exec recon-engine python scripts/main.py example.com --phase subdomains
```

Available phases:
- `all` - Run all phases (default)
- `subdomains` - Subdomain discovery only
- `ports` - Port scanning only
- `crawl` - Web crawling only
- `vulns` - Vulnerability scanning only
- `dirs` - Directory bruteforce only
- `cves` - CVE lookup only
- `exploits` - Exploit lookup only

### Custom Configuration

Create a `config.json` file:
```json
{
  "tools": {
    "nmap": {
      "enabled": true,
      "ports": "1-65535",
      "scan_type": "-sS -sV"
    },
    "nuclei": {
      "enabled": true,
      "severity": "critical,high,medium"
    }
  }
}
```

Run with custom config:
```bash
docker-compose exec recon-engine python scripts/main.py example.com --config config.json
```

### Output

Results are saved in the `output/` directory as JSON files.

## API Integration

The reconnaissance engine can be integrated with the SecureVault backend API.

### API Endpoint

```
POST /api/recon/run
{
  "target": "example.com",
  "phases": ["subdomains", "ports", "crawl", "vulns"]
}
```

### Environment Variables

- `SHODAN_API_KEY` - Shodan API key for additional intelligence
- `VIRUSTOTAL_API_KEY` - VirusTotal API key for malware analysis

## Architecture

```
recon-engine/
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Docker Compose orchestration
├── requirements.txt        # Python dependencies
├── scripts/               # Main orchestration scripts
│   ├── main.py           # Main entry point
├── tools/                 # Individual tool implementations
│   ├── subdomain_discovery.py
│   ├── port_scanning.py
│   ├── web_crawling.py
│   ├── vulnerability_scanning.py
│   ├── directory_bruteforce.py
│   ├── cve_lookup.py
│   └── exploit_lookup.py
├── utils/                 # Utility functions
│   ├── config.py
│   └── logger.py
└── output/                # Results directory
```

## Security

- All tools run in isolated Docker containers
- Network isolation with dedicated network
- Privileged mode required for nmap and other network tools
- No persistent data storage (results saved to mounted volume)

## License

MIT License
