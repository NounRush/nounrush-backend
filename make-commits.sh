git status -s | while read -r status file; do
    if [ "$status" == "M" ] || [ "$status" == "??" ] || [ "$status" == "A" ] || [ "$status" == "D" ]; then
        git add "$file"
        git commit -m "Update $file"
    fi
done