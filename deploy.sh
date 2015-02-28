echo "beginning rsync"
rsync -r --exclude 'deploy.sh' --exclude '.git' --exclude 'node_modules' --exclude 'my.conf.js' --exclude 'npm-debug.log' /home/thor/Code/core-echoes/* tidepool@tide-pool.ca:/home/tidepool/www/core-echoes
echo "rsync complete!"