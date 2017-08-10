npm run dist
lftp -e "mirror -R dist public_html; exit" -u unkiwii eros-lang.org
