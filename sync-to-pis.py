#!/usr/bin/env python3

import subprocess
import concurrent.futures
import sys
from typing import List, Tuple

# Configuration
DEST_PATH = "/home/mbutki/pi_projects/"
SRC_PATH = "/home/mbutki/pi_projects/"
PI_HOSTS = [
    "pi-desk", "pi-weather", "pi-hyper", "pi-triangle", 
    "pi-kateeink", "pi-quinneink", "pi-slotcar", "pi-hallway"
]

def sync_to_host(host: str) -> Tuple[str, bool, str]:
    """
    Sync files to a single host using rsync.
    
    Args:
        host: The hostname to sync to
        
    Returns:
        Tuple of (hostname, success_boolean, output_message)
    """
    print(f"Starting sync to {host}...")
    
    # Build the rsync command
    cmd = [
        "rsync",
        "-az",
        "--exclude-from=exclude-list.txt",
        "--delete",
        SRC_PATH,
        f"mbutki@{host}:{DEST_PATH}"
    ]
    
    try:
        # Run rsync command
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            return (host, True, "Successfully synced")
        else:
            error_msg = result.stderr.strip() if result.stderr else "Unknown error"
            return (host, False, f"Rsync failed: {error_msg}")
            
    except subprocess.TimeoutExpired:
        return (host, False, "Sync timed out after 5 minutes")
    except Exception as e:
        return (host, False, f"Exception occurred: {str(e)}")

def main():
    """Main function to orchestrate parallel syncing."""
    print(f"Starting parallel sync to {len(PI_HOSTS)} hosts...")
    print(f"Source: {SRC_PATH}")
    print(f"Destination: {DEST_PATH}")
    print("-" * 50)
    
    # Track results
    successful_syncs = []
    failed_syncs = []
    
    # Use ThreadPoolExecutor for parallel execution
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(PI_HOSTS)) as executor:
        # Submit all sync jobs
        future_to_host = {executor.submit(sync_to_host, host): host for host in PI_HOSTS}
        
        # Process completed jobs as they finish
        for future in concurrent.futures.as_completed(future_to_host):
            host, success, message = future.result()
            
            if success:
                print(f"✓ {host}: {message}")
                successful_syncs.append(host)
            else:
                print(f"✗ {host}: {message}")
                failed_syncs.append(host)
    
    # Print summary
    print("-" * 50)
    print(f"Sync completed!")
    print(f"Successful: {len(successful_syncs)}/{len(PI_HOSTS)}")
    
    if successful_syncs:
        print(f"✓ Success: {', '.join(successful_syncs)}")
    
    if failed_syncs:
        print(f"✗ Failed: {', '.join(failed_syncs)}")
        sys.exit(1)  # Exit with error code if any syncs failed
    
    print("All syncs completed successfully!")

if __name__ == "__main__":
    main()
