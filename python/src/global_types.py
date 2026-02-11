from typing import TypedDict


class PiConfig(TypedDict):
    home_dir: str  # /home/mbutki
    repo_dir: str  # /home/mbutki/pi_projects/python
    log_dir: str  # /home/mbutki/pi_projects/python/logs
    location: str  # kitchen

class DbConfig(TypedDict):
     host: str # pi-desk