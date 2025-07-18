#!/bin/bash

# Check if at least one argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <pattern>"
    echo "Example: $0 'nekomei*'"
    echo "Example: $0 '*.gif'"
    exit 1
fi

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed or not in PATH"
    exit 1
fi

# Process each pattern argument
for pattern in "$@"; do
    # Expand the pattern to get actual files
    files=($pattern)
    
    # Check if any files match the pattern
    if [ ${#files[@]} -eq 1 ] && [ ! -e "${files[0]}" ]; then
        echo "No files found matching pattern: $pattern"
        continue
    fi
    
    # Process each file
    for file in "${files[@]}"; do
        # Check if file exists and is a regular file
        if [ ! -f "$file" ]; then
            echo "Skipping $file (not a regular file)"
            continue
        fi
        
        # Get filename without extension
        filename=$(basename "$file")
        name="${filename%.*}"
        
        # Set output filename
        output="${name}.mp4"
        
        # Skip if output already exists
        if [ -f "$output" ]; then
            echo "Skipping $file (output $output already exists)"
            continue
        fi
        
        echo "Converting $file to $output..."
        
        # Run ffmpeg conversion
        if ffmpeg -i "$file" -vf "fps=60,scale=-1:-1:flags=neighbor" -c:v libx264 -pix_fmt yuv420p -crf 0 "$output" -y; then
            echo "✓ Successfully converted $file to $output"
        else
            echo "✗ Failed to convert $file"
        fi
    done
done

echo "Conversion complete!"